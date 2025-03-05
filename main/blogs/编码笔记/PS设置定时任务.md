---
title: PowerShell 设置定时任务
date: 2025/03/05
tags:
 - PowerShell
categories:
 - 编码笔记
---

:::tip
1. 注册任务
2. 注销任务

---

[使用VBS保持PS脚本的静默执行](./VBS静默执行PS脚本.md)
:::


## 注册任务

```powershell
# 使用vbs脚本的好处是可以保持静默执行
$Action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "D:\personal-folder\app\powershell\wallpaper-kline.vbs"

# 设置开机执行一次
$Trigger1 = New-ScheduledTaskTrigger -AtStartup
# 设置每小时执行一次
$Trigger2 = New-ScheduledTaskTrigger -Once -At (Get-Date).Date -RepetitionInterval (New-TimeSpan -Hours 1)

# 注册任务
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable
Register-ScheduledTask -Action $Action -Trigger $Trigger1,$Trigger2 -TaskName "wallpaper-kline-task" -Description "wallpaper-kline.vbs"  -Settings $Settings
```

## 注销任务

```powershell
Unregister-ScheduledTask -TaskName "wallpaper-kline-task" -Confirm:$false
```
