---
title: Linux 开启 BBR
date: 2025/03/05
tags:
 - Linux
categories:
 - 运维手册
---

## 开启 BBR

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf

# 生效
sysctl -p

# 查看内核是否已开启BBR
sysctl net.ipv4.tcp_available_congestion_control

# 查看BBR是否启动
lsmod | grep bbr
```

::: warning 内核版本
1. Linux 内核版本 4.9 以上才可以开启
2. 查看版本是否符合要求：`uname -r` 
:::
