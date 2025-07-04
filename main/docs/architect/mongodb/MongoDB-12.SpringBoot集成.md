---
title: 12.SpringBoot集成
date: 2025-07-04
---

- MongoTemplate
	- CRUD
		- 实体 `@Document @Id @Field @Transient`
			- `@Transient` 指定此成员变量不参与文档的序列化
		- `Query`
			- `Criteria`
			- `Sort`
			- `new BasicQuery(json)`
	- 聚合操作 `MongoTemplate#aggregate`
		- `Aggregation`
		- `TypedAggregation`
			- `GroupOperation`
			- `MatchOperation`
			- `SortOperation`
			- `ProjectionOperation`
	- 事务操作
		- 编程式事务：`TransactionOptions -> ClientSession`
		- 声明式事务（配置事务管理器）：`MongoDatabaseFactory -> MongoTransactionManager`
	- change stream：`MessageListenerContainer`

---
```java
// 编程式事务
var txo = TransactionOptions.builder()
	.readPreference(ReadPreference.primary())
	.readConcern(ReadConcern.MAJORITY)
	.writeConcern(WriteConcern.MAJORITY).build();
try (ClientSession clientSession = client.startSession()) {
	clientSession.startTransaction(txo);
	clientSession.commitTransaction();
	clientSession.abortTransaction(); // 回滚事务
}

// 声明式事务：配置事务管理器 -> @Transactional
@Bean
MongoTransactionManager transactionManager(MongoDatabaseFactory factory){
	TransactionOptions txnOptions = TransactionOptions.builder()
		.readPreference(ReadPreference.primary())
		.readConcern(ReadConcern.MAJORITY)
		.writeConcern(WriteConcern.MAJORITY).build();
	return new MongoTransactionManager(factory);
}
```

---
```java
// change stream
// 配置 mongo 监听器的容器 MessageListenerContainer
// spring 启动时会自动启动监听的任务用于接收 changestream
@Bean
MessageListenerContainer messageListenerContainer(MongoTemplate template, 
					DocumentMessageListener documentMessageListener) {
  Executor executor = Executors.newFixedThreadPool(5);
	
  MessageListenerContainer messageListenerContainer = 
	new DefaultMessageListenerContainer(template, executor) { 
		@Override 
		public boolean isAutoStartup() { return true; } 
	}; 
			
  ChangeStreamRequest<Document> request = ChangeStreamRequest
	.builder(documentMessageListener) 
	.collection("user") //需要监听的集合名 
			
	//过滤需要监听的操作类型，可以根据需求指定过滤条件 
	.filter(Aggregation.newAggregation(
	  Aggregation.match( 
		Criteria
		  .where("operationType")
		  .in("insert", "update", "delete")))) 
			
	//不设置时，文档更新时，只会发送变更字段的信息，设置UPDATE_LOOKUP会返回文档的全部信息 
	.fullDocumentLookup(FullDocument.UPDATE_LOOKUP) 
	.build(); 
	
  messageListenerContainer.register(request, Document.class); 
  return messageListenerContainer;
}

// 配置mongo监听器，用于接收数据库的变更信息
@Component
public class DocumentMessageListener<S, T> implements MessageListener<S, T> {
  @Override 
  public void onMessage(Message<S, T> message) { 
	System.out.println(String.format(
	  "Received Message in collection %s.\n\trawsource: %s\n\tconverted: %s", 
		message.getProperties().getCollectionName(), 
		message.getRaw(), 
		message.getBody())); 
	}
}
```


