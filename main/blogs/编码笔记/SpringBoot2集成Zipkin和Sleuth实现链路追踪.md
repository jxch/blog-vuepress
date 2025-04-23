---
title: SpringBoot2 集成 Zipkin 和 Sleuth 实现链路追踪
date: 2025/04/22
tags:
 - SpringBoot
 - Zipkin
 - Sleuth
categories:
 - 编码笔记
---

## 依赖

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.9</version>
        <relativePath/>
    </parent>
```

```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-sleuth</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-sleuth-zipkin</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>
```

## 配置

:::tip
- 关闭 sleuth 组件自动注入的链路日志信息：`spring.sleuth.default-logging-pattern-enabled: false`
- logback 自定义链路日志：`%X{traceId:-} %X{spanId:-}`
- logback 中自定义的默认就可以上传到 ELK，而 sleuth 默认输出的则默认上传不到 ELK
- ELK 搭建见：[ELK 部署](../运维手册/ELK部署.md)
:::

```yml
spring:
  sleuth:
    default-logging-pattern-enabled: false
    jdbc:
      datasource-proxy:
        query:
          enable-logging: true
        slow-query:
          enable-logging: true
      p6spy:
        enable-logging: true
    sampler:
      probability: 1.0
      rate: 100
  zipkin:
    base-url: http://zipkin:port
    sender:
      type: web
```

## 标签

:::info
- 多环境公用一个Zipkin的时候，可以使用打标签的方式进行环境隔离
- Zipkin 查询语句：`tagQuery=env=dev`
:::

```java
@Configuration
public class ZipkinTracingConfig {
    @Value("${spring.profiles.active:unknown}")  // 读取当前环境
    private String activeProfile;

    @Bean
    public SpanHandler spanHandler() {
        return new SpanHandler() {
            @Override
            public boolean end(TraceContext context, MutableSpan span, Cause cause) {
                span.tag("env", activeProfile); // 给 Zipkin 添加环境信息
                return true;
            }
        };
    }
}
```



