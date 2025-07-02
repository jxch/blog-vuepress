---
title: 15.5. Demo 自定义 InputFileFormat
date: 2025/07/02
---

以 excel 的文件举例

## pom.xml
```xml
<dependency>
    <groupId>net.sourceforge.jexcelapi</groupId>
    <artifactId>jxl</artifactId>
    <version>2.6.12</version>
</dependency>
```

## ExcelInputFormat.java
```java
public class ExcelFileInputFormat extends FileInputFormat<IntWritable,Text> {
    @Override
    protected boolean isSplitable(JobContext context, Path filename) {
        return false;
    }
    public RecordReader<IntWritable, Text> createRecordReader(InputSplit split, TaskAttemptContext context) throws IOException, InterruptedException {
        return new ExcelRecordReader();
    }
}
```

## ExcelRecordReader.java
```java
public class ExcelRecordReader extends RecordReader<IntWritable,Text> {
    private int rows;
    private int current = -1;
    private Sheet sheet;
    private Workbook workbook;
    
    @Override
    public void initialize(InputSplit split, TaskAttemptContext context) throws IOException, InterruptedException {
        FileSplit filesplit = (FileSplit) split;
        Configuration conf= context.getConfiguration();
        Path filePath =filesplit.getPath();
        FileSystem fs=filePath.getFileSystem(conf);
        FSDataInputStream inputStream = fs.open(filePath);
        try {
            workbook = Workbook.getWorkbook(inputStream);
            sheet = workbook.getSheets()[0];
            rows = sheet.getRows();
        } catch (BiffException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean nextKeyValue() throws IOException, InterruptedException {
        if(current<rows-1) {
            current++;
            return true;
        }
        return false;
    }

    @Override
    public IntWritable getCurrentKey() throws IOException, InterruptedException {
        return new IntWritable(current);
    }

    @Override
    public Text getCurrentValue() throws IOException, InterruptedException {
        StringBuffer sb = new StringBuffer("");
        for(int i=0; i<sheet.getColumns(); i++){
            Cell cell = sheet.getCell(i, current);
            sb.append(cell.getContents() + " ");
        }
        return new Text(sb.toString());
    }

    @Override
    public float getProgress() throws IOException, InterruptedException {
        return current/rows;
    }

    @Override
    public void close() throws IOException {
        workbook.close();
    }
}
```

## ExcelMapper.java
```java
public class ExcelMapper extends Mapper<IntWritable,Text,IntWritable,Text> {
    @Override
    protected void map(IntWritable key, Text value, Context context) throws IOException, InterruptedException {
        super.map(key, value, context);
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
        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(Text.class);
        job.setInputFormatClass(ExcelFileInputFormat.class);
        //不需要Reduce
        job.setNumReduceTasks(0);
        //指定文件得读取位置
        FileInputFormat.setInputPaths(job, new Path("/wc/excel"));
        //指定文件得输出位置
        FileOutputFormat.setOutputPath(job, new Path("/wc/excelout"));

        System.exit(job.waitForCompletion(true) ? 0 : -1);
    }
}
```

