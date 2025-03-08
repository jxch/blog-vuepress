---
title: Docker Swarm 将服务部署到指定标签的节点上
date: 2025/03/05
tags:
 - Docker
categories:
 - 运维手册
---

::: tip 
1. 给节点打标签
2. 给服务加约束
:::

```shell
# 给节点打标签
docker node update --label-add memory=high NODE_ID

# 给服务添加约束，他就会自动调度到特定标签的节点上
docker service update --constraint-add 'node.labels.memory == high' SERVICE_ID
```


```yml
services:
  app:
    image: app-images
    deploy:
      placement:
        constraints:
          - node.labels.memory == high
```
