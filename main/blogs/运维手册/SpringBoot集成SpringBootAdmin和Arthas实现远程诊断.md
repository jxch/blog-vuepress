---
title: SpringBoot 集成 SpringBootAdmin 和 Arthas 实现远程诊断
date: 2025/05/15
tags:
 - SpringBoot
 - SpringBootAdmin
 - Arthas
categories:
 - 运维手册
---

:::tip
1. 部署 arthas-tunnel-server
2. SpringBoot 集成 arthas-spring-boot-starter
3. 将 agent-id 注册到 SpringBootAdmin
:::

## 部署 arthas-tunnel-server

:::tip
- DockerHub 地址：https://hub.docker.com/repository/docker/jxch/arthas-tunnel-server/general
- GitHub 地址：https://github.com/jxch-docker/docker-build/tree/main/arthas/tunnel
:::

```yml
services:
  tunnel-server:
    image: jxch/arthas-tunnel-server:4.0.5
    ports:
      - "7777:7777"
      - "10777:8080"
    environment:
      - ARTHAS_TOKEN=token
      - PASSWORD=password
```

## 集成 arthas-spring-boot-starter

:::info
- tunnelWeb 并非 arthas-spring-boot-starter 提供的字段，我的目的是把这个入口注册到 SpringBootAdminServer，这样就可以在 SBA Server 上直接进入远程诊断了
- tunnelToken 是 arthas-spring-boot-starter 提供的字段，但并没有显示的 Java 属性，这个字段是必填的
- tunnelServer 必须用 ws 地址
:::

```yml
arthas:
  tunnelWeb: http://arthas-tunnel-server-ip-address:10777/
  tunnelServer: ws://arthas-tunnel-server-ip-address:7777/ws
  tunnelToken: ARTHAS_TOKEN
  app-name: ${spring.application.name}
  agent-id: ${spring.application.name}-${spring.cloud.client.ip-address:${server.address:127.0.0.1}}-${server.port}
```

```xml
        <dependency>
            <groupId>com.taobao.arthas</groupId>
            <artifactId>arthas-spring-boot-starter</artifactId>
            <version>4.0.5</version>
        </dependency>
```

## 集成 SpringBootAdminClient 并注册 agent-id

:::info
- 参考：[SpringBoot 集成 SpringBootAdmin](./SpringBoot集成SpringBootAdmin.md)
- 把 agent-id 等信息通过元数据注册到 SpringBootAdminServer
- 这样就可以在 SpringBootAdminServer 的 web 面板中直接进入远程诊断了
:::

```yml
spring:
  boot:
    admin:
      client:
        url: http://asktrue.cn:8111
        username: admin
        password: password
        instance:
          prefer-ip: true
          metadata:
            application: ${spring.application.name}
            environment: ${spring.profiles.active}
            arthas-tunnel-server: ${arthas.tunnelWeb}
            arthas-agent-id: ${arthas.agent-id}
            ip: ${spring.cloud.client.ip-address}
            port: ${server.port}
            user:
              name: ${spring.security.user.name}
              password: ${spring.security.user.password}
```

