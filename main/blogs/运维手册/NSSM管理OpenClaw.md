---
title: NSSM 管理 OpenClaw
date: 2026/06/05
tags:
 - NSSM
 - OpenClaw
categories:
 - 运维手册
---

## 安装

```sh
winget install NSSM.NSSM
winget install version-fox.vfox

vfox install nodejs@24.13.0
vfox use -g nodejs@24.13.0

npm install -g openclaw
openclaw onboard
```

## 服务化

```sh
nssm install OpenclawGateway
```

:::info
- `Application Path`: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`
- `Startup directory`: `C:\Users\xiche\.vfox\sdks\nodejs`
- `Arguments`: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\xiche\.vfox\sdks\nodejs\openclaw.ps1" gateway run`
:::

