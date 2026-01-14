---
title: GlusterFS 分布式存储方案
date: 2026/01/14
tags:
 - GlusterFS
 - 分布式存储
categories:
 - 运维手册
---

:::tip
- 当前方案采用容量最大化的方案，无备份无高可用，节点挂掉后里面的文件将无法打开，节点重启后可恢复
:::

## 每台机器都安装 GlusterFS Server

```shell
sudo apt update
sudo apt install -y glusterfs-server

sudo systemctl enable --now glusterd
sudo systemctl status glusterd --no-pager

gluster --version
```

## 每台机器都准备 brick 目录

```shell
sudo mkdir -p /data/gluster/brick1/gv0
sudo chown -R root:root /data/gluster
sudo chmod -R 755 /data/gluster
```

:::info
- `/data/gluster/brick1/gv0` 必须是空目录
- `/data/gluster` 建议用独立数据盘
:::

## 把其他节点加入集群

```shell
sudo gluster peer probe 10.0.0.12
sudo gluster peer probe 10.0.0.13
sudo gluster peer probe 10.0.0.14

sudo gluster peer status
```

## 创建 distribute 卷

```shell
sudo gluster volume create gv0 transport tcp \
  10.0.0.11:/data/gluster/brick1/gv0 \
  10.0.0.12:/data/gluster/brick1/gv0 \
  10.0.0.13:/data/gluster/brick1/gv0 \
  10.0.0.14:/data/gluster/brick1/gv0

sudo gluster volume start gv0

sudo gluster volume info gv0
sudo gluster volume status gv0
```

:::warning
若没使用独立数据盘，需要指定 `force` 参数

```shell
sudo gluster volume create gv0 transport tcp \
  10.0.0.11:/data/gluster/brick1/gv0 \
  10.0.0.12:/data/gluster/brick1/gv0 \
  10.0.0.13:/data/gluster/brick1/gv0 \
  10.0.0.14:/data/gluster/brick1/gv0
  force
```
:::

## 参数优化

```shell
sudo gluster volume set gv0 network.ping-timeout 10
sudo gluster volume set gv0 performance.quick-read on
sudo gluster volume set gv0 performance.read-ahead on
sudo gluster volume set gv0 performance.io-cache on
```

## 客户端挂载

```shell
sudo apt install -y glusterfs-client

sudo mkdir -p /mnt/gv0
sudo mount -t glusterfs 10.0.0.11:/gv0 /mnt/gv0

mount | grep gv0
df -h /mnt/gv0
```

### 开机自动挂载

```shell
sudo tee /etc/systemd/system/mnt-gv0.mount > /dev/null <<'EOF'
[Unit]
Description=GlusterFS mount gv0
After=network-online.target glusterd.service
Wants=network-online.target

[Mount]
What=10.0.0.11:/gv0
Where=/mnt/gv0
Type=glusterfs
Options=defaults,_netdev,log-level=WARNING

[Install]
WantedBy=multi-user.target
EOF
```

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now mnt-gv0.mount
sudo systemctl status mnt-gv0.mount --no-pager
```
