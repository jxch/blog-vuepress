---
title: Jumpserver 部署
date: 2025/06/16
tags:
 - Jumpserver
categories:
 - 运维手册
---

## docker compose

```yml
services:
  jumpserver: 
    image: jumpserver/jms_all
    restart: unless-stopped
    user: root
    privileged: true
    ports:
      - "10880:80"
    environment:
      SECRET_KEY: "uuid"
      BOOTSTRAP_TOKEN: "uuid"
      LOG_LEVEL: "ERROR"
      DB_ENGINE: mysql
      DB_HOST: ""
      DB_PORT: "3306"
      DB_USER: "root"
      DB_PASSWORD: ""
      DB_NAME: "jumpserver"
      REDIS_HOST: ""
      REDIS_PORT: ""
      REDIS_PASSWORD: ""
      DOMAINS: host:port
    volumes:
      - /mnt/nexus3/jumpserver:/opt/jumpserver/data
```

:::tip
- [Docker Hub - Jumpserver/jms_all](https://hub.docker.com/r/jumpserver/jms_all)
:::
