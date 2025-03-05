---
title: Docker 容器启动时提示内存太小
date: 2025/03/05
tags:
 - Docker
categories:
 - 运维手册
---

::: danger 类似的报错信息
`Maximum number of memory map areas per process (vm.max_map_count) 262144 is too low, recommended value: 1048575, you can change it with sysctl.`
:::

## 解决方案

:::: code-group
::: code-group-item LINUX
```bash
sysctl -w vm.max_map_count=1048575
```
:::
::: code-group-item WINDOWS
```powershell
wsl -d docker-desktop sh -c "sysctl -w vm.max_map_count=1048575"
```
:::
::::

::: info 
1. 提示应该设置多少就设置多少
2. 然后重启docker服务即可
:::
