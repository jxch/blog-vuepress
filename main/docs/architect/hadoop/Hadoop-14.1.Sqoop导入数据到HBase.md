---
title: 14.1. Sqoop 导入数据到 HBase
date: 2025/07/02
---

1. 创建 HBase 表: `create 'hbase_person','info'`
2. 导入数据到 HBase
    ```bash
    sqoop import \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --table person \
        --columns "pid,name,sex" \
        --column-family "info" \
        --hbase-create-table \
        --hbase-row-key "pid" \
        --hbase-table "hbase_person" \
        --num-mappers 1 \
        --split-by pid
    ```
3. `scan 'hbase_person'`
