---
title: Windows 使用 Diskpart 永久固定 USB 盘符
date: 2025/03/05
tags:
 - Windows
categories:
 - 运维手册
---

::: tip Diskpart
先执行 Diskpart 命令，进入 Diskpart 命令窗
:::

```powershell
# 列出所有的硬盘
list volume

# 选择需要操作的硬盘
select volume 6

# 手动设置盘符
assign letter=U
```

