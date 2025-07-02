---
title: HAProxy TCP 端口代理
date: 2025/07/02
tags:
 - proxy
categories:
 - 运维手册
---


## docker-compose.yml
```yml
version: '3.8'
services: 
  haproxy: 
    image: haproxy:lts-alpine
    privileged: true
    ports:
      - 1080:1080
      - 3306:3306
    volumes: 
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg
```

## haproxy.cfg
```properties
defaults
    mode            tcp
    log             global
    option          tcplog
    option          dontlognull
    option http-server-close
    option          redispatch
    retries         3
    timeout http-request 10s
    timeout queue   1m
    timeout connect 10s
    timeout client  1m
    timeout server  1m
    timeout http-keep-alive 10s
    timeout check   10s
    maxconn         3000
frontend    mysql
    bind        0.0.0.0:3306
    mode        tcp
    log         global
    default_backend mysql_server
backend     mysql_server
    balance roundrobin
    server capital_mysql qbh.jiangxicheng.xyz:3306 check inter 5s rise 2 fall 3
listen stats
    mode    http
    bind    0.0.0.0:1080
    stats   enable
    stats   hide-version
    stats uri /haproxyamdin?stats
    stats realm Haproxy\ Statistics
    stats auth admin:admin
    stats admin if TRUE
```
