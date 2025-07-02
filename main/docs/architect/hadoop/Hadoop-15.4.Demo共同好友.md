---
title: 15.4. Demo 共同好友
date: 2025/07/02
---

## 思路
原数据:
```text
A:B,C,D,F,E,O
B:A,C,E,K
C:F,A,D,I
D:A,E,F,L
E:B,C,D,M,L
F:A,s,C,D,E,O,M
G:A,C,D,E,F
H:A,C,D,E,O
I:A,O
J:B,O
K:A,C,D
L:D,E,F
M:E,F,G
O:A,H,I,J
```

1. 先找出一个用户是哪些用户的共同好友（比如 C 是哪些用户的共同好友，以上题目中的 C 是用户 A,B,E,F,G,H,K 的共同好友，所以 AB 的共同好友为 C，AE 的共同好友为 C，以此类推。。。）
2. 经过第一步推算，得到 AE 的 共同好友还有 D，最后将 AE 的共同好友合并得到 C,D，这只是举个例子，他们的共同好友还有很多，即将两两用户作为 key，好友作为 value，以此类推，因此需要写两个 mapreduce

## JAVA 代码
### FriendsStepOne.java
```java
public class FriendsStepOne {
    public static class FriendsStepOneMapper extends Mapper<LongWritable, Text, Text, Text>{
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            String line = value.toString();
            String[] splits = line.split(":");
            String person = splits[0];
            String[] friends = splits[1].split(",");
            for(String fString :friends){
                context.write(new Text(fString), new Text(person));
            }
        }
    }

    public static class FriendsStepOneReducer extends Reducer<Text, Text, Text, Text>{
        @Override
        protected void reduce(Text friend, Iterable<Text> persons, Context context) throws IOException, InterruptedException {
            StringBuffer sBuffer = new StringBuffer();
            for(Text pText :persons){
                sBuffer.append(pText).append("-");
            }
            context.write(friend, new Text(sBuffer.toString()));
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        job.setJarByClass(FriendsStepOne.class);
        job.setMapperClass(FriendsStepOneMapper.class);
        job.setReducerClass(FriendsStepOneReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.setInputPaths(job, new Path("D:\\friends\\input"));
        FileOutputFormat.setOutputPath(job, new Path("D:\\friends\\output-1"));
        boolean res = job.waitForCompletion(true);
        System.exit(res?0:1);
    }
}
```

### FriendsStepTwo.java
```java
public class FriendsStepTwo {
    public static class FriendsStepTwoMapper extends Mapper<LongWritable, Text, Text, Text>{
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            String line = value.toString();
            String[] splits = line.split("\t");
            String friend = splits[0];
            String[] persons = splits[1].split("-");
            Arrays.sort(persons);
            for (int i = 0; i < persons.length-1; i++) {
                for (int j = i+1; j < persons.length; j++) {
                    context.write(new Text(persons[i]+"-"+persons[j]), new Text(friend));
                }
            }
        }
    }

    public static class FriendsStepTwoReducer extends Reducer<Text, Text, Text, Text>{
        @Override
        protected void reduce(Text person_pair, Iterable<Text> friends, Context context) throws IOException, InterruptedException {
            StringBuffer sBuffer = new StringBuffer();
            for(Text fText : friends){
                sBuffer.append(fText).append(" ");
            }
            context.write(person_pair, new Text(sBuffer.toString()));
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        job.setJarByClass(FriendsStepTwo.class);
        job.setMapperClass(FriendsStepTwoMapper.class);
        job.setReducerClass(FriendsStepTwoReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.setInputPaths(job, new Path("D:\\friends\\output-1"));
        FileOutputFormat.setOutputPath(job, new Path("D:\\friends\\output-2"));
        boolean res = job.waitForCompletion(true);
        System.exit(res?0:1);
    }
}
```
