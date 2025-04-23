---
title: SpringBoot 集成 Dockerfile 健康检查
date: 2025/04/23
tags:
 - Docker
 - SpringBoot
categories:
 - 编码笔记
---

:::info
健康检查成功后，容器才视为启动成功，包括 docker swarm 的 update 也是这样，可以利用这个特性实现集群的不停机更新
:::

## HEALTHCHECK

```dockerfile
ENV ACTUATOR_PORT=13011
ENV ACTUATOR_USER=admin
ENV ACTUATOR_PASS=123456

HEALTHCHECK --interval=30s --timeout=10s --start-period=300s CMD curl -f -u $ACTUATOR_USER:$ACTUATOR_PASS http://127.0.0.1:$ACTUATOR_PORT/actuator/health || exit 1

ENTRYPOINT [...]
```

## 依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
```

## 配置

```yml
management:
  server:
    port: 13011
  endpoints:
    web:
      exposure:
        include: '*'

spring:
  security:
    user:
      name: admin
      password: 123456
```
