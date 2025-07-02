---
title: 15.6. Demo 自定义 OutputFileFormat
date: 2025/07/02
---

如果单词是老师人名，放到一个目录，否则放到另外一个目录

## TeacherOutPutFormat.java
```java
public class TeacherOutPutFormat extends FileOutputFormat<Text,NullWritable> {
    
    public RecordWriter<Text,NullWritable> getRecordWriter(TaskAttemptContext job) throws IOException, InterruptedException {
        FileSystem fs = FileSystem.get(job.getConfiguration());
        Path teacherPath = new Path("/wc/excelteacher/excelteacher.txt");
        Path otherPath = new Path("/wc/excelother/excelother.txt");
        FSDataOutputStream teacherOut = fs.create(teacherPath);
        FSDataOutputStream otherOut = fs.create(otherPath);
        return new TeacherRecordWriter(teacherOut,otherOut);
    }

    static class TeacherRecordWriter extends RecordWriter<Text,NullWritable> {
        FSDataOutputStream teacherOut;
        FSDataOutputStream otherOut;
        
        public TeacherRecordWriter(FSDataOutputStream teacherOut, FSDataOutputStream otherOut) {
            this.teacherOut = teacherOut;
            this.otherOut = otherOut;
        }

        public void write(Text key, NullWritable value) throws IOException, InterruptedException {
            String keyStr = key.toString()+"\n";
            if(keyStr.contains(":teacher")){
                String resultKey = keyStr.replace(":teacher", "");
                teacherOut.write(resultKey.getBytes());
            }else {
                otherOut.write(keyStr.getBytes());
            }
        }

        public void close(TaskAttemptContext context) throws IOException, InterruptedException {
            if(teacherOut !=null) {
                teacherOut.close();
            }
            if(otherOut !=null) {
                otherOut.close();
            }
        }
    }
}
```

## ExcelMapper.java
```java
public class ExcelMapper extends Mapper<IntWritable,Text,Text,NullWritable> {
    private List<String> teachers = null;
    
    @Override
    protected void map(IntWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] words = value.toString().split(" ");
        for(String word :words) {
            if(teachers.contains(word)) {
                word = word+":teacher";
            }
            context.write(new Text(word),NullWritable.get());
        }
    }

    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        teachers = new ArrayList<String>();
        teachers.add("deer");
        teachers.add("james");
        teachers.add("peter");
        teachers.add("lison");
        teachers.add("king");
        teachers.add("mark");
    }
}
```

## ExcelJob.java
```java
public class ExcelJob {
    public static void main(String[] args) throws Exception{
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        job.setJarByClass(ExcelJob.class);
        job.setMapperClass(ExcelMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(NullWritable.class);
        job.setInputFormatClass(ExcelFileInputFormat.class);
        job.setOutputFormatClass(TeacherOutPutFormat.class);
        //不需要Reduce
        job.setNumReduceTasks(0);
        //指定文件得读取位置
        FileInputFormat.setInputPaths(job,new Path("D:\\wc\\excel"));
        //指定文件得输出位置 还有success文件需要输出 
        FileOutputFormat.setOutputPath(job,new Path("D:\\wc\\excelout"));

        System.exit(job.waitForCompletion(true) ? 0 : -1);
    }
}
```







