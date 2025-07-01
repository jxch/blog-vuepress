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
    chromej.ps1 1 2 --disable-web-security --incognito
        # 启动/多开 1、2 两个 profile，并传递原生参数

    chromej.ps1 dev -a -u "https://example.com" --disable-gpu
        # 激活已开的 dev profile，或未开则以指定网址和参数新开

    chromej.ps1 1 -Delete -y
        # 强制删除 1 号 profile 目录，无需确认

    chromej.ps1 --disable-software-rasterizer -sc
        # 启动 Chrome 并显示完整命令行

    chromej.ps1 -s
        # 静默启动 Chrome 本体

    chromej.ps1 1 2 3 -Activate -ShowCmd -Silent
        # 激活/多开 1、2、3，命令行输出，静默执行
```

