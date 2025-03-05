---
title: Docker 清理
date: 2025/03/05
tags:
 - Docker
categories:
 - 运维手册
---

::: tip
通常可以直接使用 `docker system prune --all -f` 命令进行深度清理并且无需手动确认
:::

|命令|作用|
|-|-|
|`docker container prune`|容器清理|
|`docker image prune`|镜像清理|
|`docker volume prune`|数据卷清理|
|`docker builder prune`|缓存清理|
|`docker system prune`|一键清理|
|`docker system prune -a`|深度清理|

