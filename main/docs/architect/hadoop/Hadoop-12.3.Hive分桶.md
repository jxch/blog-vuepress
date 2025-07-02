---
title: 12.3. Hive 分桶
date: 2025/07/02
---

## 创建桶表
```sql
set hive.enforce.bucketing=true;
set mapreduce.job.reduces=4;

drop table person_buck;

create table person_buck(sid int ,sname string)
partitioned by(sex string)
clustered by(sid)
sorted by(sid DESC)
into 4 buckets
row format delimited
fields terminated by ',';

insert into person_buck partition(sex) select sid,sname,sex from person_p;
```

## 桶表抽样查询
```sql
select * from table_name tablesample(bucket X out of Y on field);

select * from person_buck tablesample(bucket 1 out of 2 on sid);
```

* X 表示从哪个桶中开始抽取
* Y 表示相隔多少个桶再次抽取
    * Y 必须为分桶数量的倍数或者因子，比如分桶数为 6，Y 为 6，则表示只从桶中抽取 1 个 bucket 的数据；若 Y 为 3，则表示从桶中抽取 6/3 (2)个 bucket 的数据

