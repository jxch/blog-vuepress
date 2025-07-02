---
title: 13.1. HBase 常用命令
date: 2025/07/02
---

`hbase shell` 进入shell
`help` 命令查看帮助文档
`list` 命令查看数据库中的表

## 创建表
创建 person 表，包含 info, data 两个列族
然后查看表结构
```sql
create 'person', 'info', 'data'
describe 'person'
```

## 插入数据
```sql
-- 向person 表中插入信息，row key 为rk0001，列族info 中添加name 列标示符，值为zhangsan
put 'person', 'rk0001', 'info:name', 'zhangsan'

-- 向person 表中插入信息，row key 为rk0001，列族info 中添加gender 列标示符，值为female
put 'person', 'rk0001', 'info:gender', 'female'

-- 向person 表中插入信息，row key 为rk0001，列族info 中添加age 列标示符，值为20
put 'person', 'rk0001', 'info:age', 20

-- 向person 表中插入信息，row key 为rk0001，列族data 中添加pic 列标示符，值为picture
put 'person', 'rk0001', 'data:pic', 'picture'
```

## 查询数据
`get` 适用于获取单个记录或少量记录的场景，`scan` 适用于获取大量记录的场景
```sql
-- 获取person 表中row key 为rk0001 的所有信息
get 'person', 'rk0001'

-- 获取person 表中row key 为rk0001，info 列族的所有信息
get 'person', 'rk0001', 'info'

-- 获取person 表中row key 为rk0001，info 列族的name、age 列标示符的信息
get 'person', 'rk0001', 'info:name', 'info:age'

-- 获取person 表中row key 为rk0001，info、data 列族的信息
get 'person', 'rk0001', 'info', 'data'

get 'person', 'rk0001', {COLUMN => ['info', 'data']}
get 'person', 'rk0001', {COLUMN => ['info:name', 'data:pic']}

-- 获取person 表中row key 为rk0001，列族为info，版本号最新5 个的信息
get 'person', 'rk0001', {COLUMN => 'info', VERSIONS => 5}

get 'person', 'rk0001', {COLUMN => 'info:name', VERSIONS => 5}
get 'person', 'rk0001', {COLUMN => 'info:name', VERSIONS => 5, TIMERANGE => [1567491377530,1567491377590]}

-- 获取person 表中row key 为rk0001，cell 的值为zhangsan 的信息
get 'person', 'rk0001', {FILTER => "ValueFilter(=, 'binary:zhangsan')"}

-- 获取person 表中row key 为rk0001，列标示符中含有a 的信息
get 'person', 'rk0001', {FILTER => "(QualifierFilter(=,'substring:a'))"}

put 'person', 'rk0002', 'info:name', 'fanbingbing'
put 'person', 'rk0002', 'info:gender', 'female'
put 'person', 'rk0002', 'info:nationality', '中国'
get 'person', 'rk0002', {FILTER => "ValueFilter(=, 'binary:中国')"}

-- 查询person 表中的所有信息
scan 'person'

-- 查询person 表中列族为info 的信息
scan 'person', {COLUMNS => 'info'}

-- 查询person 表中列族为info 和data 的信息
scan 'person', {COLUMNS => ['info', 'data']}
scan 'person', {COLUMNS => ['info:name', 'data:pic']}

-- 查询person 表中列族为info、列标示符为name 的信息
scan 'person', {COLUMNS => 'info:name'}

-- 查询person 表中列族为info、列标示符为name 的信息,并且版本最新的5 个
scan 'person', {COLUMNS => 'info:name', VERSIONS => 5}

-- 查询person 表中列族为info 和data 且列标示符中含有a 字符的信息
scan 'person', {COLUMNS => ['info', 'data'], FILTER => "(QualifierFilter(=,'substring:a'))"}

-- 查询person 表中列族为info，rk 范围是[rk0001, rk0003)的数据
scan 'person', {COLUMNS => 'info', STARTROW => 'rk0001', ENDROW => 'rk0003'}

-- 查询person 表中row key 以rk 字符开头的
scan 'person',{FILTER=>"PrefixFilter('rk')"}

-- 查询person 表中指定范围的数据
scan 'person', {TIMERANGE => [1392368783980, 1392380169184]}
```

## 删除数据
```sql
-- 删除person 表row key 为rk0001，列标示符为info:name 的数据
delete 'person', 'rk0001', 'info:name'

-- 删除person 表row key 为rk0001，列标示符为info:name，timestamp 为1392383705316 的数据
delete 'person', 'rk0001', 'info:name', 1392383705316

-- 清空person 表中的数据
truncate 'person'
```

## 修改表结构
```sql
-- 首先停用person 表
disable 'person'

-- 添加两个列族f1 和f2
alter 'person', NAME => 'f1'
alter 'person', NAME => 'f2'

-- 删除一个列族
alter 'person', NAME => 'f1', METHOD => 'delete'
alter 'person', 'delete' => 'f1'

-- 添加列族f1 同时删除列族f2
alter 'person', {NAME => 'f1'}, {NAME => 'f2', METHOD => 'delete'}

-- 将person 表的f1 列族版本号改为5
alter 'person', NAME => 'info', VERSIONS => 5

-- 启用表
enable 'person'
```

## 删除表
```sql
disable 'person'
drop 'person'
```

