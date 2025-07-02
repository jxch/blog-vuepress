---
title: 12.2. Hive 常用命令 dd 与 dmll
date: 2025/07/02
---

## 创建表
```sql
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] table_name
    [(col_name data_type [COMMENT col_comment], ...)]
    [COMMENT table_comment]
    [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
    [CLUSTERED BY (col_name, col_name, ...)
    [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]
    [ROW FORMAT row_format]
    [STORED AS file_format]
    [LOCATION hdfs_path]
```

### 创建内部表
删除表的时候数据也会被删除

```sql
create table if not exists mytable(sid int ,sname string) 
row format delimited
fields terminated by ',' stored as textfile;

show tables;
```

上传数据: `hdfs dfs -put a /user/hive/warehouse/test.db/mytable/`
`select * from mytable`

### 创建外部表
删除表的时候数据不会被删除

```sql
create external table mytable_ext(sid int ,sname string)
row format delimited
fields terminated by ',' location '/dbdata'

show tables;
select * from mytable_ext;
```

### 创建分区表
```sql
create table person_p(sid int ,sname string) partitioned by(sex string) 
row format delimited fields
terminated by ','stored as textfile;

load data local inpath '/testdata/a' into table person_p partition(sex='nan');
load data local inpath '/testdata/a' into table person_p partition(sex='nv');

show tables;
select * from person_p;
```

### 创建动态分区表
```sql
set hive.exec.dynamic.partition.mode=nonstrict;

create table person_p2(sid int ,sname string) partitioned by(sex string) row format delimited
fields terminated by ','stored as textfile;

insert into person_p2 partition(sex) select sid,sname,sex from person_p;

show tables;
select * from person_p2;
```

## 修改表
```sql
ALTER TABLE table_name ADD [IF NOT EXISTS] partition_spec [ LOCATION 'location1' ] partition_spec [ LOCATION 'location2' ] ...
partition_spec:
: PARTITION (partition_col = partition_col_value, partition_col = partiton_col_value, ...)

ALTER TABLE table_name DROP partition_spec, partition_spec,...
```

### 增加分区
```sql
create table person_p3(sid int ,sname string) partitioned by(sex string) 
row format delimited
fields terminated by ','stored as textfile;

alter table person_p3 add partition(sex='1') partition(sex='2');

load data local inpath '/testdata/a' into table person_p3 partition(sex='1');
load data local inpath '/testdata/a' into table person_p3 partition(sex='2');

show tables;
select * from person_p3;
```

### 删除分区
```sql
alter table person_p3 drop partition(sex='2')
```

###  重命名表
```sql
ALTER TABLE person_p3 RENAME TO person_p4;
```

### 新增列
ADD 是代表新增一字段，字段位置在所有列后面(partition 列前)，REPLACE 则是表示替换表中所有字段。
```sql
ALTER TABLE table_name ADD|REPLACE COLUMNS (col_name data_type [COMMENT col_comment], ...
```

```sql
create table person_p5(sid int ,sname string) partitioned by(sex string) 
row format delimited
fields terminated by 

Alter table person_p5 add COLUMNS (age int);
desc person_p5;

Alter table person_p5 REPLACE COLUMNS (age2 int);
desc person_p5;
```

### 修改列
```sql
ALTER TABLE table_name CHANGE [COLUMN] col_old_name col_new_name column_type
[COMMENT col_comment] [FIRST|AFTER column_name]
```

```sql
alter table person_p5 change column age2 age2 string;

desc person_p5;
```

## 显示命令
```sql
show tablese;
show databasese;
show partitions table_namee;
show functionse;
desc extended table_name;
desc formatted table_name;
```

## Load 操作
```sql
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO
TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]
```

## Insert
```sql
INSERT INTO TABLE VALUES(XX,YY,ZZ);

INSERT OVERWRITE [INTO] TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...)]
select_statement1 
```

## SELECT
```sql
SELECT [ALL | DISTINCT] select_expr, select_expr, ... FROM table_reference
[WHERE where_condition]
[GROUP BY col_list [HAVING condition]]
[CLUSTER BY col_list
| [DISTRIBUTE BY col_list] [SORT BY| ORDER BY col_list]
]
[LIMIT number]
```

1. `order by` 会对输入做全局排序，因此只有一个 reducer，会导致当输入规模较大时，需要较长的计算时间。
2. `sort by` 不是全局排序，其在数据进入 reducer 前完成排序。因此，如果用 `sort by` 进行排序，并且设置 `mapred.reduce.tasks>1`，则 `sort by` 只保证每个 reducer 的输出有序，**不保证全局有序**。
3. `distribute by`(字段) 根据指定的字段将数据分到不同的 reducer，且分发算法是 **hash 散列**。
4. `Cluster by`(字段) 除了具有 `Distribute by` 的功能外，还会对该字段进行**排序**。

因此，如果分桶和 sort 字段是同一个时，此时，`cluster by = distribute by + sort by`
