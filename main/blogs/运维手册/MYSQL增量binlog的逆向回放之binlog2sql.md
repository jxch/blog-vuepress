---
title: MYSQL 增量 binlog 的逆向回放【danfengcao/binlog2sql】
date: 2025/06/28
tags:
 - MYSQL
categories:
 - 运维手册
---

:::tip
1. 下载工具 `binlog2sql`: `git clone https://github.com/danfengcao/binlog2sql.git`
2. 初始化依赖环境
3. 校验 mysql binlog 功能：其他实例的binlog在本地实例中的应用
4. 生成逆向sql：兼容性问题（字符集问题）
:::

## binlog2sql

```shell
# 下载
git clone https://github.com/danfengcao/binlog2sql.git
# 依赖环境（conda 为例）
conda create -n binlog2sql_env python=3.9 -y
conda activate binlog2sql_env

pip install -r requirements.txt
pip install mysqlclient
pip install pymysql
pip install requests
pip install python-dateutil

# 验证
cd .\binlog2sql\
python binlog2sql.py --help
```

## binlog
:::warning
- 如果你的binlog文件来自其他实例，记得提前把binlog文件放入mysql的数据文件夹下（`/var/lib/mysql`），并修改`mysql-bin.index`文件
- 查看binlog：`SHOW BINARY LOGS;`
- 查看数据库字符集：`SHOW CREATE DATABASE matcheasy_new;`
- 查看数据库表字符集：`SHOW FULL COLUMNS FROM matcheasy_new.i_resume;`
:::

以本地环境（docker mysql）为例（把线上实例的binlog放在本地实例上回放测试）

```yml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_USER: root_user
      MYSQL_PASSWORD: password
    ports:
      - "33306:3306"
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --binlog-format=ROW
      --server-id=1
      --log-bin=mysql-bin
      --local-infile=1
      --log-bin-trust-function-creators=1
      --gtid-mode=ON
      --enforce-gtid-consistency=ON
    volumes:
      - ./mysql_data:/var/lib/mysql
```

```sql
-- 启动实例后给用户赋权
GRANT ALL PRIVILEGES ON *.* TO 'root_user'@'%';
FLUSH PRIVILEGES;
```

:::tip
- 基础数据准备参考：[MYSQL数据导出导入](./MYSQL数据导出导入.md)
- mysql版本以8.0为例，binlog以开启gtid为例
- 源实例字符集以 utf8mb3 为例（注意我的docker compose文件中字符集指定的是 utf8mb4 ，因为它和 utf8mb3 可能会有兼容性问题，且本工具对 utf8mb3 也有兼容性问题，方便进行演示，实际场景中请保证两实例字符集一致）
:::

## 生成逆向sql

:::info
- 本工具可以直接连线上的mysql，包括阿里云什么的，就不用折腾两个实例了，这里只是对这种特殊需求的演示
:::

```shell
python ..\binlog2sql\binlog2sql.py \
    --start-file=mysql-bin.001030 \
    --stop-file=mysql-bin.001039 \
    --host=127.0.0.1 --port=33306 \
    --user=root_user \
    --password='password' \
    --database=test_database \
    --flashback \
        > rollback.sql
```

:::danger utf8mb3字符集兼容性问题报错
```shell
Traceback (most recent call last):
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql.py", line 150, in <module>
    binlog2sql.process_binlog()
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql.py", line 105, in process_binlog
    for row in binlog_event.rows:
  File "C:\Users\xiche\anaconda3\envs\binlog2sql_env\lib\site-packages\pymysqlreplication\row_event.py", line 428, in rows
    self._fetch_rows()
  File "C:\Users\xiche\anaconda3\envs\binlog2sql_env\lib\site-packages\pymysqlreplication\row_event.py", line 423, in _fetch_rows
    self.__rows.append(self._fetch_one_row())
  File "C:\Users\xiche\anaconda3\envs\binlog2sql_env\lib\site-packages\pymysqlreplication\row_event.py", line 476, in _fetch_one_row
    row["values"] = self._read_column_data(self.columns_present_bitmap)
  File "C:\Users\xiche\anaconda3\envs\binlog2sql_env\lib\site-packages\pymysqlreplication\row_event.py", line 132, in _read_column_data
    values[name] = self.__read_string(1, column)
  File "C:\Users\xiche\anaconda3\envs\binlog2sql_env\lib\site-packages\pymysqlreplication\row_event.py", line 220, in __read_string
    string = string.decode(charset_to_encoding(column.character_set_name))
LookupError: unknown encoding: utf8mb3
```

解决方案：因为本工具引用的pymysql版本太老，无法识别utf8mb3，所以需要手动修改pymysql包下的`charset.py`
```py
def charset_to_encoding(name):
    """Convert MySQL's charset name to Python's codec name"""
    if name == 'utf8mb4':
        return 'utf8'
    if name == 'utf8mb3':
        return 'utf8'
    return name
```
:::

:::danger 字符解码报错
```shell
Traceback (most recent call last):
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql.py", line 150, in <module>
    binlog2sql.process_binlog()
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql.py", line 121, in process_binlog
    self.print_rollback_sql(filename=tmp_file)
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql.py", line 129, in print_rollback_sql
    for line in reversed_lines(f_tmp):
  File "E:\DB-BACK\binlog2sql\binlog2sql\binlog2sql\binlog2sql_util.py", line 249, in reversed_lines
    block = block.decode("utf-8")
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x83 in position 0: invalid start byte
```

解决方案：因为两实例字符集不同，或实例修改字符集导致的历史数据问题，总之解析binlog时发现存在无法解析的字符编码，所以需要手动修改工具中的解码逻辑，修改`binlog2sql_util.py`文件，这样非法字符就会被`�`代替，等回放完需要去sql文件中手动修改非法字符
```py
block = block.decode("utf-8")
# 改为
block = block.decode("utf-8", errors="replace")
```
- 字符编码的报错没有好的办法彻底避免
:::

