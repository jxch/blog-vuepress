---
title: 16.2. ClassNotFoundException
date: 2025/07/02
---

1. 输入命令 `hadoop classpath`, 将结果复制下来
2. `mapred-site.xml` 中加入:
```xml
  <property>
     <name>mapreduce.application.classpath</name>
     <value>刚才复制的值</value>
   </property>
```
1. `yarn-site.xml` 中加入:
```xml
  <property>
     <name>yarn.application.classpath</name>
     <value>刚才复制的值</value>
   </property>

```
4. 重启 hadoop 集群
