---
title: dnsmasq 部署
date: 2025/03/05
tags:
 - dnsmasq
categories:
 - 运维手册
---

::: tip
1. 使用 docker 部署，docker-compose.yml 文件
2. 配置文件，dnsmasq.conf 文件
:::

## docker-compose.yml

```yml
services:
  dns-server:
    image: jpillora/dnsmasq
    container_name: dns-server
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      - HTTP_USER=username
      - HTTP_PASS=password
    ports:
      - "53:53/udp"
      - "5380:8080"
    volumes:
      - "./dns/dnsmasq.conf:/etc/dnsmasq.conf"
```

## dnsmasq.conf

```shell
# 服务器上游DNS服务器地址
resolv-file=/etc/resolv.conf
# 默认缓存条数150，这里增加到1000
cache-size=1000
# 重启后清空缓存
clear-on-reload

# DNS 服务器
server=8.8.4.4
server=8.8.8.8
server=4.2.2.1
server=4.2.2.2
server=114.114.114.114

# 自定义域名
address=/example.com/192.168.1.10
```
