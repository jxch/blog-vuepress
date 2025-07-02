---
title: 15.1. Demo 单词统计
date: 2025/07/02
---

导入 `hadoop` 和 `hadoop.mapreduce` 包下的类

## WCMapper.java
```java
// 泛型分别是：输入的键值类型; 输出的键值类型 
public class WCMapper extends Mapper<LongWritable, Text, Text, IntWritable> {

    @Override
    protected void map(LongWritable key, @NotNull Text value, Context context) throws IOException, InterruptedException {
        String line = value.toString();
        String[] words = line.split(" ");
        for (String word : words) {
            context.write(new Text(word), new IntWritable(1));
        }
    }

}
```

## WCReducer.java
```java
// 泛型分别是：输入的键值类型; 输出的键值类型 
public class WCReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

    @Override
    protected void reduce(Text key, @NotNull Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int count = 0;
        for (IntWritable v : values) {
            count += v.get();
        }
        context.write(key, new IntWritable(count));
    }

}
```

## WCJob.java
```java
public class WCJob {

    public static void main(String[] args) throws IOException, InterruptedException, ClassNotFoundException {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);

        job.setJarByClass(WCJob.class);

        job.setMapperClass(WCMapper.class);
        job.setReducerClass(WCReducer.class);
        
//        Mapper 输出键值类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

//        Reducer 输出键值类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        job.setInputFormatClass(TextInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);

//         前期准备, 在 Hadoop /wc/input 目录中上传进待分析的文件
        FileInputFormat.setInputPaths(job, new Path("/wc/input"));
        FileOutputFormat.setOutputPath(job, new Path("/wc/output"));

//        等待执行完并检查是否执行成功
        System.exit(job.waitForCompletion(true)? 0:-1);
    }

}
```

## pom.xml
```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>org.jxch.study.hadoop.mr.wc.WCJob</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

## 运行
编译 jar 包: `mvn package -Dmaven.test.skip=true -f pom.xml`
将 jar 包上传到 Hadoop 服务器之后，执行命令: `hadoop jar /home/jxch/study-hadoop-1.0-SNAPSHOT.jar `

跑完后，检查运行结果:
* `hadoop fs -ls /wc/output`
* `hadoop fs -cat /wc/output/part-r-00000`

---

## 依赖包
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
        <dependency>
            <groupId>org.jetbrains</groupId>
            <artifactId>annotations</artifactId>
            <version>RELEASE</version>
            <scope>compile</scope>
        </dependency>
    </dependencies>
```

