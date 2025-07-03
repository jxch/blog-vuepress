---
title: 2.代码模板
date: 2025/07/03
---

:::tip
- 配置：`server.properties`
- 绑定Kafka服务器
- 生产者配置
- 生产者发送消息
- 消费配置
- 消费者接收消息
- 消费提交
- springboot 集成
    - ack‐mode
    - 生产者 & 消费者
- Kafka事务
:::

---

## 配置：`server.properties`

- 配置：`server.properties`
```properties
#broker.id属性在kafka集群中必须要是唯一
broker.id=0
#kafka部署的机器ip和提供服务的端口号
listeners=PLAINTEXT://192.168.65.60:9092
#kafka的消息存储文件
log.dir=/usr/local/data/kafka‐logs
#kafka连接zookeeper的地址
zookeeper.connect=192.168.65.60:2181
```

## 绑定Kafka服务器

- 绑定Kafka服务器
```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "192.168.65.60:9092,192.168.65.60:9093,192.168.65.60:9094");
// 生产者
Producer<String, String> producer = new KafkaProducer<String, String>(props);
// 消费者
KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
```

## 生产者配置

- 生产者配置
```java
/* 
 * 发出消息持久化机制参数
 * acks=0： 表示producer不需要等待任何broker确认收到消息的回复，就可以继续发送下一条消息。性能最高，但是最容易丢消息
 * acks=1： 至少要等待leader已经成功将数据写入本地log，但是不需要等待所有follower是否成功写入，就可以继续发送下一条消息
 *          如果follower没有成功备份数据，而此时leader又挂掉，则消息会丢失
 * acks=‐1或all： 需要等待 min.insync.replicas(默认为1，推荐配置大于等于2) 这个参数配置的副本个数都成功写入日志
 *                这种策略会保证只要有一个备份存活就不会丢失数据。这是最强的数据保证。一般除非是金融级别，或跟钱打交道的场景才会使用这种配置
 */
props.put(ProducerConfig.ACKS_CONFIG, "1");
// 发送失败重试次数，重试能保证消息发送的可靠性，但是也可能造成消息重复发送，需要接收者做好消息接收的幂等性处理
props.put(ProducerConfig.RETRIES_CONFIG, 3);
// 重试间隔设置，默认重试间隔100ms
props.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 300);
// 设置发送消息的本地缓冲区，如果设置了该缓冲区，消息会先发送到本地缓冲区，可以提高消息发送性能，默认值是33554432，即32MB
props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
// kafka本地线程会从缓冲区取数据，批量发送到broker，设置批量发送消息的大小，默认值是16384，即16kb，就是说一个batch满了16kb就发送出去
props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
/* 
 * batch最大的延迟发送时间
 * 默认值是0：意思就是消息必须立即被发送，但这样会影响性能
 * 一般设置10毫秒左右，就是说这个消息发送完后会进入本地的一个batch，如果10毫秒内，这个batch满了16kb就会随batch一起被发送出去
 * 如果10毫秒内，batch没满，那么也必须把消息发送出去，不能让消息的发送延迟时间太长
 * 
 *  消息 -> 本地缓冲区（32M）-> batch（16k）-> 发送（10ms batch不满也发送）
 */
props.put(ProducerConfig.LINGER_MS_CONFIG, 10);
// 把发送的key和value从字符串序列化为字节数组
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
```

## 生产者发送消息

- 生产者发送消息：指定分区；不指定分区；同步；异步
```java
// 指定发送分区
var producerRecord = new ProducerRecord<String, String>(TOPIC_NAME, 0, key_json, value_json);
// 未指定发送分区，具体发送的分区计算公式：hash(key) % partitionNum
var producerRecord = new ProducerRecord<String, String>(TOPIC_NAME, key_json, value_json);
// 等待消息发送成功的同步阻塞方法
RecordMetadata metadata = producer.send(producerRecord).get();
// 异步回调方式发送消息
producer.send(producerRecord, new Callback() {
	public void onCompletion(RecordMetadata metadata, Exception exception) {
		// 处理异常
	}
});
// 关闭
producer.close();
```

## 消费配置

- 消费配置
```java
// 消费分组名
props.put(ConsumerConfig.GROUP_ID_CONFIG, CONSUMER_GROUP_NAME);
// 是否自动提交offset，默认就是true
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
// 自动提交offset的间隔时间
props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
/* 
 * 当消费主题的是一个新的消费组，或者指定offset的消费方式，offset不存在，那么应该如何消费
 * latest(默认) ：只消费自己启动之后发送到主题的消息
 * earliest：第一次从头开始消费，以后按照消费offset记录继续消费，这个需要区别于 consumer.seekToBeginning(每次都从头开始消费)
 */
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
// consumer给broker发送心跳的间隔时间，broker接收到心跳如果此时有rebalance发生会通过心跳响应将rebalance方案下发给consumer，这个时间可以稍微短一点
props.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, 1000);
// 服务端broker多久感知不到一个consumer心跳就认为他故障了，会将其踢出消费组，对应的Partition也会被重新分配给其他consumer，默认是10秒
props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 10 * 1000);
// 一次poll最大拉取消息的条数，如果消费者处理速度很快，可以设置大点，如果处理速度一般，可以设置小点
props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500);
// 如果两次poll操作间隔超过了这个时间，broker就会认为这个consumer处理能力太弱，会将其踢出消费组，将分区分配给别的consumer消费
props.put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, 30 * 1000);
// 把发送的key和value从字符串序列化为字节数组
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
```

## 消费者接收消息

- 消费者接收消息（topic）：指定分区；回溯（从头，指定offset）；拉取集合
```java
// 订阅Topic
consumer.subscribe(Arrays.asList(TOPIC_NAME));
// 消费指定分区
consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
// 回溯消费（从头消费 - seekToBeginning）
consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
consumer.seekToBeginning(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
// 指定offset消费
consumer.assign(Arrays.asList(new TopicPartition(TOPIC_NAME, 0)));
consumer.seek(new TopicPartition(TOPIC_NAME, 0), 10);
// 从指定时间点开始消费 - 1小时前
List<PartitionInfo> topicPartitions = consumer.partitionsFor(TOPIC_NAME);
long fetchDataTime = new Date().getTime() ‐ 1000 * 60 * 60;
Map<TopicPartition, Long> map = new HashMap<>();
for (PartitionInfo par : topicPartitions) {
	map.put(new TopicPartition(topicName, par.partition()), fetchDataTime);
}
// 遍历 value.offset(); 获取offset，然后指定offset消费
Map<TopicPartition, OffsetAndTimestamp> parMap = consumer.offsetsForTimes(map);
// 拉取消息集合
ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1000));
```

## 消费提交

- 消费提交（offset）：同步；异步
```java
// 手动同步提交offset，当前线程会阻塞直到offset提交成功，一般使用同步提交，因为提交之后一般也没有什么逻辑代码了
consumer.commitSync();
// 手动异步提交offset，当前线程提交offset不会阻塞，可以继续处理后面的程序逻辑
consumer.commitAsync(new OffsetCommitCallback() {
	@Override
	public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception ex) {
		// 处理异常
	}
});
```
---

## springboot 集成

- springboot配置application.yml
```yml
spring:
	kafka:
		bootstrap‐servers: 192.168.65.60:9092,192.168.65.60:9093,192.168.65.60:9094
		producer:
			retries: 3
			batch‐size: 16384
			buffer‐memory: 33554432
			acks: 1
			key‐serializer: org.apache.kafka.common.serialization.StringSerializer
			value‐serializer: org.apache.kafka.common.serialization.StringSerializer
		consumer:
			group‐id: default‐group
			enable‐auto‐commit: false
			auto‐offset‐reset: earliest
			key‐deserializer: xxx.StringDeserializer
			value‐deserializer: xxx.StringDeserializer
			listener:
				ack‐mode: manual_immediate
```

### ack‐mode

- ack‐mode
	- RECORD：当每一条记录被消费者监听器（ListenerConsumer）处理之后提交
	- BATCH：当每一批poll()的数据被消费者监听器处理之后提交
	- TIME：当每一批poll()的数据被消费者监听器处理之后，距离上次提交时间大于TIME时提交
	- COUNT：当每一批poll()的数据被消费者监听器处理之后，被处理record数量大于等于COUNT时提交
	- TIME | COUNT：有一个条件满足时提交
	- MANUAL：当每一批poll()的数据被消费者监听器处理之后, 手动调用Acknowledgment.acknowledge()后提交
	- MANUAL_IMMEDIATE：手动调用Acknowledgment.acknowledge()后立即提交，一般使用这种（一次提交一条消息）

### 生产者 & 消费者

- 生产者
```java
@Autowired
private KafkaTemplate<String, String> kafkaTemplate;
kafkaTemplate.send(TOPIC_NAME, 0, "key", "this is a msg");
```
- 消费者
```java
@KafkaListener(topics = "my‐replicated‐topic",groupId = "zhugeGroup")
public void listenZhugeGroup(ConsumerRecord<String, String> record, Acknowledgment ack) {
	String value = record.value();
	ack.acknowledge();  //手动提交offset
}

// 配置多个消费组（再写一个消费组处理同一个topic）
@KafkaListener(topics = "my‐replicated‐topic",groupId = "tulingGroup")

// 配置多个topic，concurrency就是同组下的消费者个数，就是并发消费数，必须小于等于分区总数
@KafkaListener(groupId = "testGroup", topicPartitions = {
	@TopicPartition(topic = "topic1", partitions = {"0", "1"}),
	@TopicPartition(topic = "topic2", partitions = "0",
		partitionOffsets = @PartitionOffset(partition = "1", initialOffset = "100"))
},concurrency = "6")
```
---

## Kafka事务

- Kafka事务
```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("transactional.id", "my‐transactional‐id");
Producer<String, String> producer = new KafkaProducer<>(props, new StringSerializer(), new StringSerializer());

// 初始化事务
producer.initTransactions();
try {
	// 开启事务
	producer.beginTransaction();
	// 发到不同的主题的不同分区
	producer.send(/*...*/);

	// 提交事务
	producer.commitTransaction();
} catch (ProducerFencedException | OutOfOrderSequenceException | AuthorizationException e) {
	producer.close();
} catch (KafkaException e) {
	// 回滚事务
	producer.abortTransaction();
}
// 关闭
producer.close();
```




