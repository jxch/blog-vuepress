---
title: 15.2. Demo 单词分组排序统计
date: 2025/07/02
---

先进行单词统计: [15.Demo单词统计](./Hadoop-15.Demo单词统计.md)

## 排序
利用对Mapper输出的Key的自动排序进行排序

```java
public class WCSortMapper extends Mapper<LongWritable, Text, DescIntWritable, Text> {
    @Override
    protected void map(LongWritable key, @NotNull Text value, @NotNull Context context) throws IOException, InterruptedException {
        String line = value.toString();
        String[] words = line.split("\t");
        if (words.length == 2) {
            context.write(new DescIntWritable(Integer.parseInt(words[1])), new Text(words[0]));
        }
    }
}
```

```java
public class WCSortReducer extends Reducer<DescIntWritable, Text, Text, IntWritable> {
    @Override
    protected void reduce(DescIntWritable key, @NotNull Iterable<Text> values, Context context) throws IOException, InterruptedException {
        for (Text word : values) {
            context.write(word, key);
        }
    }
}
```

```java
public class DescIntWritable extends IntWritable {

    public DescIntWritable() {
    }

    public DescIntWritable(int value) {
        super(value);
    }

    @Override
    public int compareTo(IntWritable o) {
        return -super.compareTo(o);
    }
}
```

## 分组

```java
public class WCPartitioner extends Partitioner<DescIntWritable, Text> {

    @Override
    public int getPartition(DescIntWritable descIntWritable, @NotNull Text text, int numPartitions) {
        return text.toString().contains("jxch") ? 0 : 1;
    }

}
```

## Job
先完成单词统计的任务，然后在此基础上进行分组排序
```java
public class WCSortJob {
    public static void main(String[] args) throws IOException, InterruptedException, ClassNotFoundException {
        Job job = Job.getInstance(new Configuration());

        job.setJarByClass(WCSortJob.class);

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

        FileInputFormat.setInputPaths(job, new Path("/wc/input"));
        FileOutputFormat.setOutputPath(job, new Path("/wc/output"));

//        等待执行完并检查是否执行成功
        if (job.waitForCompletion(true)) {
            Job sortJob = Job.getInstance(new Configuration());

            sortJob.setJarByClass(WCSortJob.class);
            sortJob.setMapperClass(WCSortMapper.class);
            sortJob.setReducerClass(WCSortReducer.class);
            sortJob.setMapOutputKeyClass(DescIntWritable.class);
            sortJob.setMapOutputValueClass(Text.class);
            sortJob.setOutputKeyClass(Text.class);
            sortJob.setOutputValueClass(IntWritable.class);
            sortJob.setInputFormatClass(TextInputFormat.class);
            sortJob.setOutputFormatClass(TextOutputFormat.class);
            sortJob.setPartitionerClass(WCPartitioner.class);
            sortJob.setNumReduceTasks(2);

            FileInputFormat.setInputPaths(sortJob, new Path("/wc/output"));
            FileOutputFormat.setOutputPath(sortJob, new Path("/wc/output_sort"));

            System.exit(sortJob.waitForCompletion(true)? 0:-1);
        }
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
                            <mainClass>org.jxch.study.hadoop.mr.wc.sort.WCSortJob</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

## 运行
编译 jar 包: `mvn package -Dmaven.test.skip=true -f pom.xml`
将 jar 包上传到 Hadoop 服务器之后，执行命令: `hadoop jar /home/jxch/study-hadoop-1.1-SNAPSHOT.jar `

跑完后，检查运行结果:
* `hadoop fs -ls /wc/output_sort`
* `hadoop fs -cat /wc/output_sort/part-r-00000`
* `hadoop fs -cat /wc/output_sort/part-r-00001`

