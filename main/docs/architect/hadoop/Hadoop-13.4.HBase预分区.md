---
title: 13.4. HBase 预分区
date: 2025/07/02
---

在默认情况下，在使用 hbase 创建表的时候会自动创建一个 region 分区，所有 hbase 的客户端的数据都写到这个 region 分区里面，一直到 region 足够大的时候才进行切分。每一个 region 维护着 startRow 与 endRowKey，如果加入的数据符合某个 region 维护的 rowKey范围，则该数据交给这个 region 维护, 根据这个特性，我们可以根据以后要插入 hbase 的数据进行一个预估，**将数据大致估算好，提前进行分区，用于提升 hbase 的性能**。

可以在 `http://hadoop01:16010/`(主节点) 查看分区情况

## 预分区
* 手动预分区: `create 'p1','info','partition1',SPLITS => ['1000','2000','3000','4000']`
* 16进制分区: `create 'p2','info','partition2',{NUMREGIONS => 15, SPLITALGO => 'HexStringSplit'}`
* 代码分区: 创建表的时候指定分区
    ```java
    public class SplitReginTest {
        private Configuration conf = null;
        private Connection conn = null;

        @Before
        public void init() throws Exception {
            conf = HBaseConfiguration.create();
            conf.set("hbase.zookeeper.quorum","hadoop01:2181,hadoop02:2182,hadoop03:2183");
            conn = ConnectionFactory.createConnection(conf);
        }

        @Test
        public void testCreateTable() throws Exception {
            Admin admin = conn.getAdmin();

            HTableDescriptor htd = new HTableDescriptor(TableName.valueOf("split_p"));
            HColumnDescriptor hcd1 = new HColumnDescriptor("base_info");
            htd.addFamily(hcd1);

            byte[][] splitKeys = new byte[4][];
            splitKeys[0] = Bytes.toBytes("1000");
            splitKeys[1] = Bytes.toBytes("2000");
            splitKeys[2] = Bytes.toBytes("3000");
            splitKeys[3] = Bytes.toBytes("4000");

            admin.createTable(htd,splitKeys);

            admin.close();
            conn.close();
        }
    }
    ```

















