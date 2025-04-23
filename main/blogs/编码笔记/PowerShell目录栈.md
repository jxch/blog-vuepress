---
title: PowerShell 目录栈
date: 2025/04/23
tags:
 - PowerShell
categories:
 - 编码笔记
---

:::info
如果只是在脚本里临时切换目录，使用 `Push-Location / Pop-Location` 更优雅
:::

```powershell
try {
    Push-Location path/to/dir
    # todo ...
}
finally {
    Pop-Location
}
```
