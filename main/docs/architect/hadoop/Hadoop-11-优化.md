---
title: 11.优化
date: 2025/07/02
---

## 参数调优
**以下参数是在用户自己的 mr 应用程序中配置就可以生效**
1. `mapreduce.map.memory.mb`: 一个 Map Task 可使用的资源上限（单位:MB），默认为 1024。如果 Map Task 实际使用的资源量超过该值，则会被强制杀死。
2. `mapreduce.reduce.memory.mb`: 一个 Reduce Task 可使用的资源上限（单位:MB），默认为 1024。如果 Reduce Task 实际使用的资源量超过该值，则会被强制杀死。
3. `mapreduce.map.cpu.vcores`: 每个 Map task 可使用的最多 cpu core 数目, 默认值: 1
4. `mapreduce.reduce.cpu.vcores`: 每个 Reduce task 可使用的最多 cpu core 数目, 默认值: 1
5. `mapreduce.map.java.opts`: Map Task 的 JVM 参数，你可以在此配置默认的 java heap size 等参数, e.g. "-Xmx1024m -verbose:gc -Xloggc:/tmp/@taskid@.gc" （@taskid@ 会被 Hadoop 框架自动换为相应的 taskid）, 默认值: ""
6. `mapreduce.reduce.java.opts`: Reduce Task 的 JVM 参数，你可以在此配置默认的 java heap size 等参数, e.g. "-Xmx1024m -verbose:gc -Xloggc:/tmp/@taskid@.gc", 默认值: ""

**应该在 yarn 启动之前就配置在服务器的配置文件中才能生效**
1. `yarn.scheduler.minimum-allocation-mb`: 1024 给应用程序 container 分配的最小内存
2. `yarn.scheduler.maximum-allocation-mb`: 8192 给应用程序 container 分配的最大内存
3. `yarn.scheduler.minimum-allocation-vcores`: 1 最小核数
4. `yarn.scheduler.maximum-allocation-vcores`: 32 最大核数
5. `yarn.nodemanager.resource.memory-mb`: 8192 nodemanager resource 内存大小

**shuffle 性能优化的关键参数，应在 yarn 启动之前就配置好**
1. `mapreduce.task.io.sort.mb`: 100  shuffle 的环形缓冲区大小，默认 100m
2. `mapreduce.map.sort.spill.percent`: 0.8  环形缓冲区溢出的阈值，默认 80%

**可靠性相关**
1. `mapreduce.map.speculative`: 是否为 Map Task 打开推测执行机制，默认为 false 
2. `mapreduce.reduce.speculative`: 是否为 Reduce Task 打开推测执行机制，默认为 false
3. `mapreduce.job.user.classpath.first` & `mapreduce.task.classpath.user.precedence`：当同一个 class 同时出现在用户 jar 包和 hadoop jar 中时，优先使用哪个 jar 包中的 class，默认为 false，表示优先使用 hadoop jar 中的 class
4. `mapreduce.input.fileinputformat.split.minsize`: FileInputFormat 做切片时的最小切片大小，
5. `mapreduce.input.fileinputformat.split.maxsize`: FileInputFormat 做切片时的最大切片大小 (切片的默认大小就等于 blocksize，即 134217728)

推测执行机制就是同时执行两台机器，选最先出结果的机器的结果，杀死另一台机器的任务，防止出现其中一台机器计算速度太慢的情况

**压缩**
* 如果是 IO 密集形任务，可以考虑开启压缩

## 代码优化
1. 输出的时候不要频繁创建对象
```java
for(String word: words) {
    context.write(new Text(word),new IntWritable(1));
}
// 改为
Text text = new Text("");
IntWritable count = new IntWritable(1);
for(String word: words) {
    context.write(text.set(word), count);
}
```
2. 尽量使用Combiner机制，减轻Reduce的压力: `job.setCombinerClass(XXReducer.class);`


