---
title: PowerShell 实现图片大小压缩
date: 2025/07/04
tags:
 - PowerShell
categories:
 - 编码笔记
---

:::info
- 下载地址：[https://raw.githubusercontent.com/jxch/shell/refs/heads/main/powershell/imageQ.ps1](https://raw.githubusercontent.com/jxch/shell/refs/heads/main/powershell/imageQ.ps1)
:::

使用示例：
```powershell
    .\imageQ.ps1 -Help
    
    .\imageQ.ps1 -i .\*.jpg
    .\imageQ.ps1 -i img1.jpg,img2.png -s 2MB
    .\imageQ.ps1 -i img1.jpg,img2.jpg -o out1.jpg,out2.jpg -q 90
    .\imageQ.ps1 -i .\*.png -Silent
```
