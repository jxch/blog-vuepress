---
title: 12.1. Hive 窗口函数
date: 2025/07/02
---

```sql
CREATE TABLE window_demo(cookieid STRING, createtime STRING, pv INT)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ',';

load data local inpath '/testdata/window' into table window_demo;
```

## SUM
```sql
SELECT cookieid,createtime,pv, 
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime) AS pv1, -- 默认为从起点到当前行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime 
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pv2, --从起点到当前行，结果同 pv1
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime 
ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS pv3, --当前行+往前 3 行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime 
ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING) AS pv4, --当前行+往前 3 行+往后 1 行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime 
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS pv5 --当前行+往后所有行
FROM test1;
```

* 如果不指定 `ROWS BETWEEN`, 默认统计窗口为从起点到当前行
* 如果不指定 `ORDER BY`, 不仅分区内没有排序, 则将分组内所有值累加
* `max()` 函数无论有没有 `order by` 都是计算整个分区的最大值

关键是理解 `ROWS BETWEEN` 含义, 也叫做 window 子句：
* `PRECEDING`：往前
* `FOLLOWING`：往后
* `CURRENT ROW`：当前行
* `UNBOUNDED`：无边界
* `UNBOUNDED PRECEDING`：表示从最前面的起点开始 
* `UNBOUNDED FOLLOWING`：表示到最后面的终点

## NTILE
`NTILE(n)`，用于将分组数据按照顺序切分成 n 片，返回当前切片值，`NTILE` 不支持 `ROWS BETWEEN`

```sql
SELECT cookieid,createtime,pv, 
NTILE(2) OVER(PARTITION BY cookieid ORDER BY createtime) AS ntile1, --分组内将数据分成 2 片
NTILE(3) OVER(PARTITION BY cookieid ORDER BY createtime) AS ntile2, --分组内将数据分成 3 片
NTILE(4) OVER(PARTITION BY cookieid ORDER BY createtime) AS ntile3 --将所有数据分成 4 片
FROM window_demo;
```

## ROW_NUMBER
`ROW_NUMBER()` 从 1 开始，按照顺序，生成分组内记录的序列
`ROW_NUMBER()` 的应用场景非常多，比如获取分组内排序第一的记录

```sql
SELECT cookieid,createtime,pv, 
ROW_NUMBER() OVER(PARTITION BY cookieid ORDER BY pv desc) AS rn
FROM window_demo;
```

## RANK DENSE_RANK
`RANK()` 生成数据项在分组中的排名，排名相等会在名次中留下空位
`DENSE_RANK()` 生成数据项在分组中的排名，排名相等会在名次中不会留下空位

```sql
SELECT cookieid,createtime,pv, 
RANK() OVER(PARTITION BY cookieid ORDER BY pv desc) AS rank1, 
DENSE_RANK() OVER(PARTITION BY cookieid ORDER BY pv desc) AS d_rank2, 
ROW_NUMBER() OVER(PARTITION BY cookieid ORDER BY pv DESC) AS rn3
FROM window_demo
```

## CUME_DIST
`cume_dist` 返回 小于等于 当前值的行数/分组内总行数

```sql
SELECT cookieid,createtime,pv, 
round(CUME_DIST() OVER(ORDER BY pv),2) AS cd1, 
round(CUME_DIST() OVER(PARTITION BY cookieid ORDER BY pv),2) AS cd2
FROM window_demo;
```
