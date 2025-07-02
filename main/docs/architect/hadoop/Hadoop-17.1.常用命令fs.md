---
title: 17.1. 常用命令 fs
date: 2025/07/02
---

|命令|作用|
|-|-|
|`hadoop fs -help`|帮助命令|
|`hadoop fs -ls /`|显示目录信息|
|`hadoop fs -ls hdfs://hadoop01:9000/`|显示目录信息(使用Nn节点)|
|`hadoop fs -mkdir -p /path1/path2/path3`|创建目录|
|`hadoop fs -moveFromLocal /file/a.txt /path1/path2`|从本地剪切粘贴到hdfs|
|`hadoop fs -appendToFile  b.txt /file/a.txt`|追加文件|
|`hadoop fs -cat /a.txt`|显示文件|
|`hadoop fs -chmod 666 /file/a.txt`|改权限|
|`hadoop fs -chown root:root /file/a.txt`|改组和拥有者|
|`hadoop fs -chgrp group /file/a.txt`|改组|
|`hadoop fs -copyFromLocal ./b.txt /`|拷贝文件到HDFS (上传)|
|`hadoop fs -copyToLocal /b.txt /c.txt`|拷贝HDFS文件到本地 (下载)|
|`hadoop fs -cp /aa.txt /bbb.txt`|复制|
|`hadoop fs -mv /aa.txt /bbb.txt`|移动|
|`hadoop fs -get /aa.txt`|下载|
|`hadoop fs -put aa.txt /file`|上传|
|`hadoop fs -getmerge /file bb.txt`|合并下载某个目录中的多个文件|
|`hadoop fs -rmdir /file1/file2`|删除空目录|
|`hadoop fs -rm -r /d.txt`|删除文件或文件夹|
|`hadoop fs -df -h /`|统计文件系统可用空间|
|`hadoop fs -du -s -h /file`|统计文件夹大小|
|`hadoop fs -count /file`|统计文件夹节点数量|
|`hadoop fs -setrep 3 /aa.txt`|设置副本数量|
|`hdfs dfsadmin -report`|查看集群状态|

---
[官方文档](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/FileSystemShell.html)

