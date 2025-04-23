---
title: Docker Registry2 镜像仓库清理
date: 2025/04/23
tags:
 - Docker
categories:
 - 运维手册
---

:::info
1. 必须在配置文件中允许删除镜像：`/etc/docker/registry/config.yml`
2. 手动删除镜像：`/var/lib/registry/docker/registry/v2/repositories/`
3. 清理镜像：`registry garbage-collect /etc/docker/registry/config.yml`
:::

```yml
# /etc/docker/registry/config.yml
storage:
  delete:
    enabled: true
```

```bash
cd /var/lib/registry/docker/registry/v2/repositories/
rm -rf ./<要删除的镜像>

registry garbage-collect /etc/docker/registry/config.yml
```

```bash
# 检查清理效果
df -h
```
