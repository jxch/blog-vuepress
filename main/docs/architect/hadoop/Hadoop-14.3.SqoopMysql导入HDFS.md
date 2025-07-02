---
title: 14.3. Sqoop Mysql 导入 HDFS
date: 2025/07/02
---

1. Mysql 测试数据
    ```sql
    create database sqooptest;
    Use sqooptest
    create table person(pid int primary key auto_increment, name varchar(20), sex varchar(20));
    insert into person(name, sex) values('james', 'Male');
    insert into person(name, sex) values('lison', 'Female');
    ```
2. 全量导入
    ```bash
    sqoop import \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --table person \
        --target-dir /user/person \
        --delete-target-dir \
        --num-mappers 1 \
        --fields-terminated-by ","

    hadoop fs -cat /user/person/part-m-00000
    ```
3. 带查询条件导入: `$CONDITIONS` 不能省略, 要链接 sqoop 默认的条件
    ```bash
    sqoop import \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --target-dir /user/person \
        --delete-target-dir \
        --num-mappers 1 \
        --fields-terminated-by "," \
        --query 'select name,sex from person where pid <=1 and $CONDITIONS;'

    hadoop fs -cat /user/person/part-m-00000
    ```
4. 导入特定列
    ```bash
    sqoop import \
        --connect jdbc:mysql://192.168.244.100:3306/sqooptest \
        --username root \
        --password root1234% \
        --target-dir /user/person \
        --delete-target-dir \
        --num-mappers 1 \
        --fields-terminated-by "," \
        --columns pid,sex \
        --table person
    ```
