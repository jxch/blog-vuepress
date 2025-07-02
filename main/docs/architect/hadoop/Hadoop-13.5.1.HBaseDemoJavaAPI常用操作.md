---
title: 13.5.1. HBase Demo Java API 常用操作
date: 2025/07/02
---

## pom.xml

```xml
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-server</artifactId>
            <version>2.5.4</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>2.5.4</version>
        </dependency>
```

## 获得连接
```java
private Configuration conf = null;
private Connection conn = null;

    @Before
    public void init() throws Exception {
        conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "hadoop01:2181,hadoop02:2182,hadoop03:2183");
        conn = ConnectionFactory.createConnection(conf);
    }
```

## 建表
```java
    @Test
    public void testCreateTable() throws Exception {
        // 获取一个表管理器
        Admin admin = conn.getAdmin();

        // 构造一个表描述器，并指定表名
        HTableDescriptor htd = new HTableDescriptor(TableName.valueOf("t_person_info"));

        // 构造一个列族描述器，并指定列族名
        HColumnDescriptor hcd1 = new HColumnDescriptor("base_info");
        // 构造第二个列族描述器，并指定列族名
        HColumnDescriptor hcd2 = new HColumnDescriptor("extra_info");

        // 将列族描述器添加到表描述器中
        htd.addFamily(hcd1).addFamily(hcd2);
        admin.createTable(htd);

        admin.close();
        conn.close();
    }
```

## 删除表
```java
    @Test
    public void testDrop() throws Exception {
        Admin admin = conn.getAdmin();

        admin.disableTable(TableName.valueOf("t_person_info"));
        admin.deleteTable(TableName.valueOf("t_person_info"));

        admin.close();
        conn.close();
    }
```

## 修改表结构
```java
    @Test
    public void testModify() throws Exception {
        Admin admin = conn.getAdmin();

        // 修改已有的ColumnFamily
        HTableDescriptor table = admin.getTableDescriptor(TableName.valueOf("t_person_info"));

        // 添加新的ColumnFamily
        table.addFamily(new HColumnDescriptor("other_info"));
        admin.modifyTable(TableName.valueOf("t_person_info"), table);

        admin.close();
        conn.close();
    }
```

## 插入/修改数据
```java
    @Test
    public void testPut() throws Exception {
        Table table = conn.getTable(TableName.valueOf("t_person_info"));

        ArrayList<Put> puts = new ArrayList<Put>();
        // 构建一个put 对象（kv），指定其行键
        Put put01 = new Put(Bytes.toBytes("user001"));
        put01.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("zhangsan"));
        Put put02 = new Put("user001".getBytes());
        put02.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("password"),Bytes.toBytes("123456"));
        Put put03 = new Put("user002".getBytes());
        put03.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("lisi"));
        put03.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));
        Put put04 = new Put("zhang_sh_01".getBytes());
        put04.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("zhang01"));
        put04.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));
        Put put05 = new Put("zhang_sh_02".getBytes());
        put05.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("zhang02"));
        put05.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));
        Put put06 = new Put("liu_sh_01".getBytes());
        put06.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("liu01"));
        put06.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));
        Put put07 = new Put("zhang_bj_01".getBytes());
        put07.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("zhang03"));
        put07.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));
        Put put08 = new Put("zhang_bj_01".getBytes());
        put08.addColumn(Bytes.toBytes("base_info"), Bytes.toBytes("username"),Bytes.toBytes("zhang04"));
        put08.addColumn(Bytes.toBytes("extra_info"), Bytes.toBytes("married"),Bytes.toBytes("false"));

        puts.add(put01);
        puts.add(put02);
        puts.add(put03);
        puts.add(put04);
        puts.add(put05);
        puts.add(put06);
        puts.add(put07);
        puts.add(put08);
        table.put(puts);

        table.close();
        conn.close();
    }
```

## get 查询
```java
    @Test
    public void testGet() throws Exception {
        Table table = conn.getTable(TableName.valueOf("t_person_info"));

        // 构造一个get 查询参数对象，指定要get 的是哪一行
        Get get = new Get("user001".getBytes());
        Result result = table.get(get);

        CellScanner cellScanner = result.cellScanner();
        while (cellScanner.advance()) {
            Cell current = cellScanner.current();
            byte[] familyArray = current.getFamilyArray();
            byte[] qualifierArray = current.getQualifierArray();
            byte[] valueArray = current.getValueArray();
            System.out.print(new String(familyArray, current.getFamilyOffset(),current.getFamilyLength()));
            System.out.print(":" + new String(qualifierArray, current.getQualifierOffset(),current.getQualifierLength()));
            System.out.println(" " + new String(valueArray, current.getValueOffset(),current.getValueLength()));
        }

        table.close();
        conn.close();
    }
```

## 删除表中数据
```java
    @Test
    public void testDel() throws Exception {
        Table t_person_info = conn.getTable(TableName.valueOf("t_person_info"));

        Delete delete = new Delete("user001".getBytes());
        delete.addColumn("base_info".getBytes(), "password".getBytes());

        t_person_info.delete(delete);

        t_person_info.close();
        conn.close();
    }
```

## scan 查询
```java
    @Test
    public void testScan() throws Exception {
        Table t_person_info = conn.getTable(TableName.valueOf("t_person_info"));
        Scan scan = new Scan(Bytes.toBytes("liu_sh_01"), Bytes.toBytes("zhang_bj_01" + "\000"));
        ResultScanner scanner = t_person_info.getScanner(scan);
        Iterator<Result> iter = scanner.iterator();
        while (iter.hasNext()) {
            Result result = iter.next();
            CellScanner cellScanner = result.cellScanner();
            while (cellScanner.advance()) {
                Cell current = cellScanner.current();
                byte[] familyArray = current.getFamilyArray();
                byte[] valueArray = current.getValueArray();
                byte[] qualifierArray = current.getQualifierArray();
                byte[] rowArray = current.getRowArray();
                System.out.println(new String(rowArray, current.getRowOffset(),current.getRowLength()));
                System.out.print(new String(familyArray, current.getFamilyOffset(),current.getFamilyLength()));
                System.out.print(":" + new String(qualifierArray, current.getQualifierOffset(),current.getQualifierLength()));
                System.out.println(" " + new String(valueArray, current.getValueOffset(),current.getValueLength()));
            }
            System.out.println("-----------------------");
        }
    }
```

## 过滤查询
```java
    @Test
    public void testFilter() throws Exception {
        // 针对行键的前缀过滤器
        Filter pf = new PrefixFilter(Bytes.toBytes("liu"));
        testScan(pf);

        // 行过滤器
        RowFilter rf1 = new RowFilter(CompareOp.LESS, new BinaryComparator(Bytes.toBytes("user002")));
        RowFilter rf2 = new RowFilter(CompareOp.EQUAL, new SubstringComparator("00"));
        testScan(rf1);
        System.out.println("**********");
        testScan(rf2);

        // 针对指定一个列的 value 来过滤
        SingleColumnValueFilter scvf = new SingleColumnValueFilter("base_info".getBytes(),"password".getBytes(), CompareOp.EQUAL, "123456".getBytes());
        scvf.setFilterIfMissing(true); // 如果指定的列缺失，则也过滤掉
        testScan(scvf);

        ByteArrayComparable comparator1 = new RegexStringComparator("^zhang");
        ByteArrayComparable comparator2 = new SubstringComparator("ang");
        SingleColumnValueFilter scvf = new SingleColumnValueFilter("base_info".getBytes(),
        "username".getBytes(), CompareOp.EQUAL, comparator2);
        testScan(scvf);

        // 针对列族名的过滤器返回结果中只会包含满足条件的列族中的数据
        FamilyFilter ff1 = new FamilyFilter(CompareOp.EQUAL, new BinaryComparator(Bytes.toBytes("inf")));
        FamilyFilter ff2 = new FamilyFilter(CompareOp.EQUAL, new BinaryPrefixComparator(Bytes.toBytes("base")));
        testScan(ff1);

        // 针对列名的过滤器返回结果中只会包含满足条件的列的数据
        QualifierFilter qf = new QualifierFilter(CompareOp.EQUAL, new BinaryComparator(Bytes.toBytes("password")));
        QualifierFilter qf2 = new QualifierFilter(CompareOp.EQUAL, new BinaryPrefixComparator(Bytes.toBytes("us")));
        testScan(qf);

        // 跟 SingleColumnValueFilter 结果不同，只返回符合条件的该column
        ColumnPrefixFilter cf = new ColumnPrefixFilter("passw".getBytes());
        testScan(cf);

        byte[][] prefixes = new byte[][]{ Bytes.toBytes("username"),Bytes.toBytes("password") };
        MultipleColumnPrefixFilter mcf = new MultipleColumnPrefixFilter(prefixes);
        testScan(mcf);

        FamilyFilter ff2 = new FamilyFilter(CompareOp.EQUAL, new BinaryPrefixComparator(Bytes.toBytes("base")));
        ColumnPrefixFilter cf = new ColumnPrefixFilter("passw".getBytes());
        FilterList filterList = new FilterList(Operator.MUST_PASS_ALL);
        filterList.addFilter(ff2);
        filterList.addFilter(cf);
        testScan(filterList);
    }
```

```java
    private void testScan(Filter filter) throws Exception {
        Table t_person_info = conn.getTable(TableName.valueOf("t_person_info"));
        Scan scan = new Scan();
        scan.setFilter(filter);
        ResultScanner scanner = t_person_info.getScanner(scan);
        Iterator<Result> iter = scanner.iterator();
        while (iter.hasNext()) {
            Result result = iter.next();
            CellScanner cellScanner = result.cellScanner();
            while (cellScanner.advance()) {
                Cell current = cellScanner.current();
                byte[] familyArray = current.getFamilyArray();
                byte[] valueArray = current.getValueArray();
                byte[] qualifierArray = current.getQualifierArray();
                byte[] rowArray = current.getRowArray();
                System.out.println(new String(rowArray, current.getRowOffset(),current.getRowLength()));
                System.out.print(new String(familyArray, current.getFamilyOffset(),current.getFamilyLength()));
                System.out.print(":" + new String(qualifierArray, current.getQualifierOffset(),current.getQualifierLength()));
                System.out.println(" " + new String(valueArray, current.getValueOffset(),current.getValueLength()));
            }
            System.out.println("-----------------------");
        }
    }
```

