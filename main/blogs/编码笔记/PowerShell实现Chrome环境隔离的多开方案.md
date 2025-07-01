---
title: PowerShell 实现 Chrome 环境隔离的多开方案
date: 2025/07/01
tags:
 - PowerShell
categories:
 - 编码笔记
---

:::info
- 下载地址：[https://raw.githubusercontent.com/jxch/shell/refs/heads/main/powershell/chromej.ps1](https://raw.githubusercontent.com/jxch/shell/refs/heads/main/powershell/chromej.ps1)
:::

使用示例：
```powershell
    .\chromej.ps1 1
    .\chromej.ps1 devtest -Url "https://example.com"
    .\chromej.ps1 test2 -ChromePath "D:\chrome\chrome.exe" -RootDir "D:\chrome-profiles"
    .\chromej.ps1 1 -Delete
    .\chromej.ps1 1 -Delete -y
    .\chromej.ps1 -Help
    .\chromej.ps1
```

