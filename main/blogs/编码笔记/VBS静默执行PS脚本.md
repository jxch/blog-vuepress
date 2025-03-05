---
title: VBS 静默执行 PowerShell 脚本
date: 2025/03/05
tags:
 - VBS
categories:
 - 编码笔记
---

## 创建 VBS 脚本

```powershell
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell.exe -WindowStyle Hidden -File D:\personal-folder\app\powershell\wallpaper-kline.ps1", 0
Set WshShell = Nothing
```

