---
title: WIN 安装 ANDROID 安卓子系统
date: 2025/06/19
tags:
 - Windows
 - Android
categories:
 - 运维手册
---

1. 打开链接 [https://store.rg-adguard.net/](https://store.rg-adguard.net/)
2. 输入 `https://www.microsoft.com/store/productid/9p3395vx91nr`
3. 选择 `slow`，点击 `√`
4. `MicrosoftCorporationII.WindowsSubsystemForAndroid_1.8.32837.0_neutral_~_8wekyb3d8bbwe.msixbundle`，右键这个链接，复制链接地址，新建标签页，打开这个链接，开始下载
5. 进入管理员模式 PS
6. `Add-AppxPackage "D:\xicheng_jiang\下载\浏览器\MicrosoftCorporationII.WindowsSubsystemForAndroid_1.8.32837.0_neutral___8wekyb3d8bbwe.Msixbundle"`


:::danger 安装过程中报错
- 若报错则以同样的方式安装 `Microsoft.UI.Xaml.2.6_2.62112.3002.0_x64__8wekyb3d8bbwe.appx`，然后重试
:::
