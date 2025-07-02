---
title: 13.6.1. HBase ServerNotRunningYetException
date: 2025/07/02
---

:::denger ServerNotRunningYetException
- HBase ServerNotRunningYetException: Server is not running yet
:::

`hbase-site.xml` 中添加:
```xml
  <property>
    <name>hbase.wal.provider</name>
    <value>filesystem</value>
  </property>
```

重启 HBase 即可

