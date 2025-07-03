---
title: 3.代码示例
date: 2025/07/03
---

:::tip
- 消息发送者的固定步骤
	- 同步发送消息
	- 异步发送消息
	- 单向发送消息：只管把消息发出去
- 消息消费者的固定步骤
	- 拉模式
		- DefaultMQPullConsumerImpl 这个消费者类已标记为过期
		- 替换的类是 DefaultLitePullConsumerImpl
	- 推模式
- 顺序消息
- 广播消息
- 延迟消息
- 批量消息
- 过滤消息
- 事务消息
- ACL 权限控制 
- SpringBoot 整合 RocketMQ 
:::

---
## 消息发送者的固定步骤 

1. 创建消息生产者producer，并制定生产者组名 
2. 指定Nameserver地址
3. 启动producer 
4. 创建消息对象，指定主题Topic、Tag和消息体 
5. 发送消息：同步发送、异步发送以及单向发送
6. 关闭生产者producer

```java
DefaultMQProducer producer = new DefaultMQProducer("ProducerGroupName");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
Message msg = new Message("TopicTest","TagA","OrderID188", 
	"Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
// 同步发送消息
SendResult sendResult = producer.send(msg);
// 异步发送消息
producer.setRetryTimesWhenSendAsyncFailed(3);
producer.send(msg, new SendCallback() { });
// 单向发送消息
producer.sendOneway(msg);
producer.shutdown();
```

---
## 消息消费者的固定步骤
 
1. 创建消费者Consumer，制定消费者组名 
2. 指定Nameserver地址
3. 订阅主题Topic和Tag 
4. 设置回调函数，处理消息
	- 拉模式；推模式（推模式也是由拉模式封装出来的）
5. 启动消费者consumer

```java
// 拉模式
DefaultMQPullConsumer consumer = new DefaultMQPullConsumer("group_name");
consumer.setNamesrvAddr("192.168.232.128:9876");
consumer.start();
Set<MessageQueue> mqs = consumer.fetchSubscribeMessageQueues("TopicTest");
for (MessageQueue mq : mqs) {
	// 从每个 MQ 中拉消息，指定 offset 和 maxNums
	PullResult pullResult = consumer.pullBlockIfNotFound(mq, null, 0, 32);
	// 该 MQ 中下一个消息的 offset
	long offset = pullResult.getNextBeginOffset()
	switch (pullResult.getPullStatus()) {
		// 如果该 MQ 中的消息没取完，应该继续取
	}
}
consumer.shutdown();
```
```java
// 订阅-拉模式
DefaultLitePullConsumer litePullConsumer = new DefaultLitePullConsumer("lite_pull_consumer");
litePullConsumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_LAST_OFFSET);
litePullConsumer.subscribe("TopicTest", "*");
litePullConsumer.start();
while (running) {
	List<MessageExt> messageExts = litePullConsumer.poll();
}
litePullConsumer.shutdown();
```
```java
// 分派-拉模式
DefaultLitePullConsumer litePullConsumer = new DefaultLitePullConsumer("group_name");
litePullConsumer.setAutoCommit(false);
litePullConsumer.start();
Collection<MessageQueue> mqSet = litePullConsumer.fetchMessageQueues("TopicTest");
List<MessageQueue> list = new ArrayList<>(mqSet);
// list -add-> assignList
List<MessageQueue> assignList = new ArrayList<>();
litePullConsumer.assign(assignList);
litePullConsumer.seek(assignList.get(0), 10);
while (running) {
	List<MessageExt> messageExts = litePullConsumer.poll();
	litePullConsumer.commitSync();
}

litePullConsumer.shutdown();
```
```java
// 推模式
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("CID_JODIE_1");
consumer.setNamesrvAddr("worker1:9876");
consumer.subscribe("TopicTest", "*");
consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_LAST_OFFSET);
consumer.registerMessageListener(new MessageListenerConcurrently() {
	@Override
	public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, 
			ConsumeConcurrentlyContext context) {
		// 消费 msgs 之后确认已经消费完毕
		return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
	}
};
consumer.start();
```

---
## 顺序消息 

```java
// 生产者
DefaultMQProducer producer = new DefaultMQProducer("group_name");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
Message msg = new Message("OrderTopicTest", "order_" + orderId, "KEY" + orderId,
	 ("order_"+orderId+" step " + j).getBytes(RemotingHelper.DEFAULT_CHARSET));
SendResult sendResult = producer.send(msg, new MessageQueueSelector() {
	@Override
	public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
		// 根据传入的 arg (即 producer#send 的第二个参数，orderId) 选一个 MessageQueue
		return mqs.get(index);
	}
}, orderId);
producer.shutdown();
```
```java
// 消费者
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name");
consumer.setNamesrvAddr("localhost:9876");
consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_LAST_OFFSET);
consumer.subscribe("OrderTopicTest", "*");
// 需要使用 MessageListenerOrderly 保证顺序性，而不是 MessageListenerConcurrently
consumer.registerMessageListener(new MessageListenerOrderly() {
	@Override
	public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs, 
			ConsumeOrderlyContext context) {
		context.setAutoCommit(true);
		// 消费 msgs 后确认消费完毕
		return ConsumeOrderlyStatus.SUCCESS;
	}
});

consumer.start();
```

---
## 广播消息

```java
// 消费者
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name");
consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_LAST_OFFSET);
consumer.setMessageModel(MessageModel.BROADCASTING);
consumer.subscribe("TopicTest", "*");
consumer.registerMessageListener(new MessageListenerConcurrently() {
	@Override
	public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
			ConsumeConcurrentlyContext context) {
		// 消费 msgs 后确认消费完毕
		return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
	}
});
consumer.start();
```

---
## 延迟消息 

```java
// 生产者
DefaultMQProducer producer = new DefaultMQProducer("group_name");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
Message message = new Message("TestTopic", ("Hello scheduled message ").getBytes());
message.setDelayTimeLevel(3);
producer.send(message);
producer.shutdown();
```

---
## 批量消息 

```java
DefaultMQProducer producer = new DefaultMQProducer("group_name");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
producer.send(List<Message> messages);
producer.shutdown();
```

---
## 过滤消息 

```java
// tag-生产者
DefaultMQProducer producer = new DefaultMQProducer("group_name");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
Message msg = new Message("TagFilterTest", "TagA", 
	 "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
SendResult sendResult = producer.send(msg);
producer.shutdown();

// tag-消费者
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name");
consumer.subscribe("TagFilterTest", "TagA || TagC");
consumer.registerMessageListener(new MessageListenerConcurrently() {
	@Override
	public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
			ConsumeConcurrentlyContext context) {
		// 消费 msgs 后确认消费完毕
		return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
	}
});
consumer.start();
```
```java
// sql-生产者
DefaultMQProducer producer = new DefaultMQProducer("group_name");
producer.setNamesrvAddr("192.168.232.128:9876");
producer.start();
Message msg = new Message("SqlFilterTest","TagA",
	("Hello RocketMQ").getBytes(RemotingHelper.DEFAULT_CHARSET));
msg.putUserProperty("a", String.valueOf(i));
SendResult sendResult = producer.send(msg);
producer.shutdown();

// sql-消费者
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name");
consumer.subscribe("SqlFilterTest",
	MessageSelector.bySql("(TAGS is not null and TAGS in ('TagA', 'TagB'))" +
	"and (a is not null and a between 0 and 3)"));
consumer.registerMessageListener(new MessageListenerConcurrently() {
	@Override
	public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
			ConsumeConcurrentlyContext context) {
		// 消费 msgs 后确认消费完毕
		return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
	}
});
consumer.start();
```

---
## 事务消息 

```java
public class TransactionListenerImpl implements TransactionListener {
	@Override
	public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
		// COMMIT_MESSAGE ROLLBACK_MESSAGE UNKNOW
		msg.getTransactionId(); // 事务ID
		return LocalTransactionState.COMMIT_MESSAGE;
	}
	@Override
	public LocalTransactionState checkLocalTransaction(MessageExt msg) {
		// COMMIT_MESSAGE ROLLBACK_MESSAGE UNKNOW
		msg.getTransactionId(); // 事务ID
		return LocalTransactionState.COMMIT_MESSAGE;
	}
}
```
```java
TransactionListener transactionListener = new TransactionListenerImpl();
TransactionMQProducer producer = new TransactionMQProducer("group_name");
producer.setNamesrvAddr("127.0.0.1:9876");
producer.setExecutorService(executorService);
producer.setTransactionListener(transactionListener);
producer.start();
Message msg = new Message("TopicTest", "TagA", "KEY", 
	("Hello RocketMQ ").getBytes(RemotingHelper.DEFAULT_CHARSET));
SendResult sendResult = producer.sendMessageInTransaction(msg, null);
producer.shutdown();
```

---
## ACL 权限控制 
- `<artifactId>rocketmq-acl</artifactId>`
- `broker.conf -> aclEnable=true`
- `plan_acl.yml`
```yaml
#全局白名单，不受ACL控制 
#通常需要将主从架构中的所有节点加进来 
globalWhiteRemoteAddresses:
- 10.10.103.*
- 192.168.0.*

accounts:
#第一个账户
- accessKey: RocketMQ
  secretKey: 12345678 
  whiteRemoteAddress: 
  admin: false 
  defaultTopicPerm: DENY #默认Topic访问策略是拒绝 
  defaultGroupPerm: SUB #默认Group访问策略是只允许订阅 
  topicPerms:
  - topicA=DENY #topicA拒绝
  - topicB=PUB|SUB #topicB允许发布和订阅消息
  - topicC=SUB #topicC只允许订阅
  groupPerms:
  # the group should convert to retry topic
  - groupA=DENY
  - groupB=PUB|SUB
  - groupC=SUB
#第二个账户，只要是来自192.168.1.*的IP，就可以访问所有资源 
- accessKey: rocketmq2
  secretKey: 12345678 
  whiteRemoteAddress: 192.168.1.*
  # if it is admin, it could access all resources 
  admin: true
```

---
## SpringBoot 整合 RocketMQ 

```properties
#NameServer地址 
rocketmq.name-server=192.168.232.128:9876 
#默认的消息生产者组 
rocketmq.producer.group=springBootGroup
```
```java
// 生产者
@Component
public class SpringProducer {
	@Resource
	private RocketMQTemplate rocketMQTemplate;
	// 发送普通消息
	public void sendMessage(String topic,String msg){
		this.rocketMQTemplate.convertAndSend(topic,msg);
	}
	// 发送事务消息
	public void sendMessageInTransaction(String topic,String msg) {
		String destination =topic + ":" + "TagA";
		Message<String> message = MessageBuilder.withPayload(msg).build();
		SendResult sendResult = rocketMQTemplate.sendMessageInTransaction(
			destination, message, destination);
	}
}
// 事务消息监听器
@RocketMQTransactionListener(rocketMQTemplateBeanName = "rocketMQTemplate")
public class MyTransactionImpl implements RocketMQLocalTransactionListener{
	@Override
	public RocketMQLocalTransactionState executeLocalTransaction(Message msg, Object arg) {
		// COMMIT ROLLBACK UNKNOWN
		// SpringBoot 的消息对象中，并没有 transactionId 这个属性
		return RocketMQLocalTransactionState.COMMIT;
	}
	@Override
	public RocketMQLocalTransactionState checkLocalTransaction(Message msg){
		// COMMIT ROLLBACK UNKNOWN
		return RocketMQLocalTransactionState.COMMIT;
	}
}
// 消费者
@Component
@RocketMQMessageListener(consumerGroup = "MyConsumerGroup", topic = "TestTopic")
public class SpringConsumer implements RocketMQListener<String> {
    @Override
    public void onMessage(String message) { 
        System.out.println("Received message : "+ message);
    }
}
```



