---
title: 13.6.2. HBase No Hbase Master Found
date: 2025/07/02
---

:::denger
- HBase-stop-hbase.sh: no hbase master found
:::

1. `hbase-env.sh` 中添加: `export HBASE_PID_DIR=/var/hbase/pids`
2. `jps` 查看 hbase 相关的 pid, 然后 `kill -9` 结束进程
3. `start-hbase.sh` 启动 hbase

