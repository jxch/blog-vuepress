---
title: Windows 使用 NSSM 管理 Service
date: 2025/06/29
tags:
 - Windows
categories:
 - 运维手册
---

- 安装：`winget install NSSM.NSSM`
- 安装服务：`nssm install cloudflared-dns`
  - 在弹出的对话框中
    - Application path 添应用的绝对路径
    - Startup dir 添 `win + r` 输入 `shell:startup` 回车后弹出的文件夹路径
    - Arguments 填应用的启动参数
    - 最后点击 Install service
- 启动服务：`net start cloudflared-dns` 或 `Start-Service cloudflared-dns`
- 检查服务状态： `Get-Service cloudflared-dns`
- 修改服务参数：`nssm edit cloudflared-dns`
- 卸载服务：`nssm remove cloudflared-dns confirm`

:::info
- 需要以管理员权限运行
:::

