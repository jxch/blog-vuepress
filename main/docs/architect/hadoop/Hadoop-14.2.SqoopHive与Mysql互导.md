---
title: 14.2. Sqoop Hive 与 Mysql 互导
date: 2025/07/02
---

* 导入数据到 HIVE
    ```bash
    sqoop import \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --table person \
        --num-mappers 1 \
        --hive-import \
        --fields-terminated-by "," \
        --hive-overwrite \
        --hive-table person_hive
    ```
* hive/hdfs 导入数据到 mysql
    ```bash
    sqoop export \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --table person2 \
        --export-dir /user/hive/warehouse/person_hive \
        --m 1
    ```
