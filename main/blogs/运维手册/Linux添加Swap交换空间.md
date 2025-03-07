---
title: Linux 添加 Swap 交换空间
date: 2025/03/07
tags:
 - Linux
categories:
 - 运维手册
---

## 添加交换空间

```bash
mkdir /swap

# 创建交换空间文件
fallocate -l 2G /swap/swapfile1
# 或者使用 dd 命令
dd if=/dev/zero of=/swap/swapfile1 bs=1024 count=2097152

# 启用并挂载交换空间
chmod 600 /swap/swapfile1
mkswap /swap/swapfile1
swapon /swap/swapfile1
echo "/swap/swapfile1 swap swap defaults 0 0" | sudo tee -a /etc/fstab

# 查看是否挂载成功
swapon --show
free -h
```

## 删除交换空间
```bash
# 卸载交换空间
swapoff -v /swap/swapfile1

# 删除挂载交换空间的配置
vi /etc/fstab
rm /swap/swapfile1
```
