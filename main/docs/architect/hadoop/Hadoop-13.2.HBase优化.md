---
title: 13.2. HBase 优化
date: 2025/07/02
---

* [13.3. HBase 设计优化 rowkey](./Hadoop-13.3.HBase设计优化rowkey.md)
* 代码优化
    * 创建表的时候，可以通过 `HColumnDescriptor.setInMemory(true)` 将表放到 RegionServer 的缓存中，**保证在读取的时候被 cache 命中**
    * 创建表的时候，可以通过 `HColumnDescriptor.setMaxVersions(int maxVersions)` **设置表中数据的最大版本**，如果只需要保存最新版本的数据，那么可以设置 `setMaxVersions(1)`
    * 创建表的时候，可以通过 `HColumnDescriptor.setTimeToLive(int timeToLive)` **设置表中数据的存储生命期，过期数据将自动被删除**，例如如果只需要存储最近两天的数据，那么可以设置 `setTimeToLive(2 * 24 * 60 * 60)`
* `hdfs-site.xml`: **HDFS 副本数的调整**
    * `dfs.replication`: 如果数据量巨大，且不是非常之重要，可以调整为2~3，如果数据非常之重要，可以调整为3~5
    * `dfs.datanode.max.transfer.threads`: HBase 一般都会同一时间操作大量的文件，根据集群的数量和规模以及数据动作，设置为 4096 或者更高。默认值：4096
* `mapred-site.xml`: **优化数据的写入效率, 减少写入时间 (压缩)**
    * `mapreduce.map.output.compress`: 修改为 `true`
    * `mapreduce.map.output.compress.codec`: 修改为 `org.apache.hadoop.io.compress.GzipCodec` 或者其他压缩方式
* `hbase-site.xml`
    * `hbase.regionserver.handler.count`: 默认值为 30，用于指定 **RPC 监听的数量**，可以根据客户端的请求数进行调整，读写请求较多时，增加此值
    * `hbase.hregion.max.filesize`: 默认值10737418240(10GB)，如果需要运行 HBase 的 MR 任务，可以减小此值，因为**一个 region 对应一个 map 任务**，如果单个 region 过大，会导致 map 任务执行时间过长。该值的意思就是，如果 HFile 的大小达到这个数值，则这个 region 会被切分为两个 Hfile
    * `hbase.client.write.buffer`: 用于指定 HBase 客户端缓存，**增大该值可以减少 RPC 调用次数，但是会消耗更多内存**。一般我们需要设定一定的缓存大小，以达到减少 RPC 次数的目的
    * `hbase.client.scanner.caching`: 用于指定 `scan.next` 方法**获取的默认行数，值越大，消耗内存越大**

