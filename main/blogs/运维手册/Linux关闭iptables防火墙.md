---
title: Linux 关闭 iptables 防火墙
date: 2025/03/05
tags:
 - Linux
categories:
 - 运维手册
---

## 允许所有流量

```shell
iptables -P FORWARD ACCEPT 
iptables -P OUTPUT ACCEPT 
iptables -P INPUT ACCEPT
iptables -F 
```

::: warning
该方式会在重启后失效
:::

## 自动生效

```shell
apt install iptables-persistent

netfilter-persistent save

# 重启后验证
iptables -L -v
```

::: tip
适用于 Debian/Ubuntu 系统
:::


