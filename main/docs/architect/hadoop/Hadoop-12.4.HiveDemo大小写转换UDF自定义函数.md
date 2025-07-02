---
title: 12.4. Hive Demo 大小写转换 UDF 自定义函数
date: 2025/07/02
---

## pom.xml
```xml
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-exec</artifactId>
</dependency>
```

## Lower.java
```java
public final class Lower extends UDF {
    public Text evaluate(final Text s){
        if(s==null){return null;}
        return new Text(s.toString().toLowerCase());
    }
}
```

## 测试
将代码打成 jar 包上传到服务器

```sql
add JAR /path/to/udf.jar

create temporary function tolowercase as 'cn.enjoy.hive.Lower'

select tolowercase("AAA");
select sid,tolowercase(sname),sex from person_p;
```
















