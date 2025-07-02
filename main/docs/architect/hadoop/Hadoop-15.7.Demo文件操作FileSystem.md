---
title: 15.7. Demo 文件操作 FileSystem 
date: 2025/07/02
---


## FSTest.java
```java
/**
 * 需要安装Hadoop程序, 并配置环境变量(HADOOP_HOME)
 * 不配置也可以使用部分功能
 * 配置本地的hosts文件, 对应hadoop01的ip地址
 */
@Slf4j
public class FSTest {

    public static FileSystem fileSystem;


    @Before
    public void init() throws URISyntaxException, IOException, InterruptedException {
        fileSystem = FileSystem.get(new URI("hdfs://hadoop01:9000"), new Configuration(), "root");
    }

    @After
    public void close() throws IOException {
        fileSystem.close();
    }

    //显示根目录下文件
    @Test
    public void showRootFiles() throws Exception {
        RemoteIterator<LocatedFileStatus> files = fileSystem.listFiles(new Path("/"), false);
        while (files.hasNext()) {
            LocatedFileStatus fileStatus = files.next();
            Path path = fileStatus.getPath();
            String name = path.getName();
            log.info("{} -> {}", path, name);
        }
    }

    //测试上传文件
    @Test
    public void testCopyFromLocalFile() throws Exception {
        Path src = new Path("E:\\work\\test.txt");
        Path dst = new Path("/");
        fileSystem.copyFromLocalFile(src, dst);
    }

    //测试删除文件
    @Test
    public void testDelete() throws Exception {
        Path dst = new Path("/test.txt");
        fileSystem.delete(dst, true);
    }

    //测试使用流的方式上传
    @Test
    public void testUploadUseStream() throws Exception {
        FileInputStream fis = new FileInputStream("E:\\work\\test.txt");
        Path path = new Path("/test.txt");
        FSDataOutputStream fos = fileSystem.create(path);
        IOUtils.copy(fis, fos);
    }

    //测试下载文件
    @Test
    public void testCopyToLocalFile() throws Exception {
//        这种方式只有配置了HADOOP_HOME之后才能使用
//        fileSystem.copyToLocalFile(new Path("/test.txt"), new Path("E:\\work\\test2.txt"));

//        使用Java默认的方式 (RawLocalFileSystem)
        fileSystem.copyToLocalFile(false, new Path("/test.txt"), new Path("E:\\work\\test2.txt"), true);
    }
}
```


## pom.xml
```xml
    <dependencies>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>3.3.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-hdfs</artifactId>
            <version>3.3.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>3.3.5</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>2.0.7</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.7</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.26</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
```




