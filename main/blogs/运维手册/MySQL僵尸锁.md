---
title: MySQL 僵尸锁
date: 2025/05/10
tags:
 - MySQL
categories:
 - 运维手册
---

## 僵尸锁

```sql
SELECT * FROM performance_schema.data_locks;
```

存在锁，而查不到

```sql
SELECT
    THREAD_ID,
    PROCESSLIST_ID,
    NAME,
    TYPE
FROM performance_schema.threads
WHERE THREAD_ID IN (5468414, 5468475);
```

是一个假死的长事务导致的   
 
```sql
select * from information_schema.INNODB_TRX;
```

但是查不到这个事务的线程id  
 
```sql
SELECT
    trx_id,
    trx_state,
    trx_mysql_thread_id,
    trx_started,
    trx_query
FROM information_schema.INNODB_TRX
WHERE trx_id = 65772512;
```

也无法回滚事务

```sql
XA RECOVER;
XA ROLLBACK '10.0.6.112.tm17458036649580053510.0.6.112.tm238';
```

## 回滚事务

:::info
根据16进制xid中不同的位数，直接回滚那个造成僵尸锁的事务
:::

```sql
XA RECOVER CONVERT XID;
XA ROLLBACK X'31302E302E362E3131322E746D313734353830333636343935383030353335', X'31302E302E362E3131322E746D323338', 1096044365;
```
