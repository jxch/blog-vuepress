---
title: 16.1. 启动时没有启动 datanode
date: 2025/07/02
---

原因:
在第一次格式化`dfs`后，启动并使用了`hadoop`，后来又重新执行了格式化命令 `hdfs namenode -format`，这时`namenode`的`clusterID`会重新生成，而`datanode`的`clusterID` 保持不变。

解决方法:
1. 删除目录，重新格式化
2. 将`name/current`下的`VERSION`中的`clusterID`复制到`data/current`下的`VERSION`中，覆盖掉原来的`clusterID`

