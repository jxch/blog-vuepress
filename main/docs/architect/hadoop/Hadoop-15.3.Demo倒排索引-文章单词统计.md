---
title: 15.3. Demo 倒排索引-文章单词统计
date: 2025/07/02
---

## 思路 (倒推法)

第二步:
* Reduce
    * key:单词
    * values[] 文章--次数
* Map 
    * key: 单词
    * value: 文章--次数

第一步:
* Reduce
    * key: 单词--文档位置 
    * value: 单词次数
* Map
    * key: 单词--文档位置 
    * value: 1

---

## JAVA 代码

### IndexStepOne.java
```java
public class IndexStepOne {
    public static class IndexStepOneMapper extends Mapper<LongWritable, Text, Text, IntWritable>{
        Text k = new Text();
        IntWritable v = new IntWritable(1);

        @Override
        protected void map(LongWritable key, Text value,Context context) throws IOException, InterruptedException {
            String line = value.toString();
            String[] words = line.split(" ");
            FileSplit Split = (FileSplit)context.getInputSplit();
            String filename = Split.getPath().getName();
            //输出 key :单词--文件名 value:1
            for(String word : words){
                k.set(word +"--"+ filename);
                context.write(k, v);
            }
        }
    }

    public static class IndexStepOneReducer extends Reducer<Text, IntWritable, Text, IntWritable>{
        IntWritable v = new IntWritable();

        @Override
        protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
            int count = 0;
            for(IntWritable value : values){
                count += value.get();
            }
            v.set(count);
            context.write(key, v);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        job.setJarByClass(IndexStepOne.class);
        job.setMapperClass(IndexStepOneMapper.class);
        job.setReducerClass(IndexStepOneReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        //这里可以进行 combiner 组件的设置
        job.setCombinerClass(IndexStepOneReducer.class);
        job.setInputFormatClass(TextInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        FileInputFormat.setInputPaths(job, new Path("D:/index/input"));
        FileOutputFormat.setOutputPath(job, new Path("D:/index/output-1"));
        boolean res = job.waitForCompletion(true);
        System.exit(res?0:1);
    }
}
```

### IndexStepTwo.java
```java
public class IndexStepTwo {
    public static class IndexStepTwoMapper extends Mapper<LongWritable, Text, Text, Text>{
        Text k = new Text();
        Text v = new Text();
        
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            String line = value.toString();
            String[] fields = line.split("\t");
            String word_file = fields[0];
            String count = fields[1];
            String[] split = word_file.split("--");
            String word = split[0];
            String file = split[1];
            k.set(word);
            v.set(file+"--"+count);
            context.write(k, v);
        }
    }

    public static class IndexStepTwoReducer extends Reducer<Text, Text, Text, Text>{
        Text v = new Text();

        @Override
        protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            StringBuffer sBuffer = new StringBuffer();
            for (Text value : values) {
                sBuffer.append(value.toString()).append(" ");
            }
            v.set(sBuffer.toString());
            context.write(key, v);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        job.setJarByClass(IndexStepTwo.class);
        //告诉程序，我们的程序所用的 mapper 类和 reducer 类是什么
        job.setMapperClass(IndexStepTwoMapper.class);
        job.setReducerClass(IndexStepTwoReducer.class);
        //告诉框架，我们程序输出的数据类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        //这里可以进行 combiner 组件的设置
        job.setCombinerClass(IndexStepTwoReducer.class);
        //告诉框架，我们要处理的数据文件在那个路劲下
        FileInputFormat.setInputPaths(job, new Path("D:/index/output-1"));
        //告诉框架，我们的处理结果要输出到什么地方
        FileOutputFormat.setOutputPath(job, new Path("D:/index/output-2"));
        boolean res = job.waitForCompletion(true);
        System.exit(res?0:1);
    }
}
```


