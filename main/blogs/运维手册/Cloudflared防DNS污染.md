---
title: Cloudflared 防 DNS 污染
date: 2025/06/29
tags:
 - DNS
categories:
 - 运维手册
---

:::tip
- 下载：[https://github.com/cloudflare/cloudflared/releases](https://github.com/cloudflare/cloudflared/releases)
- 启动命令：`cloudflared proxy-dns`
- win11 安装：`winget install Cloudflare.cloudflared`，然后把 `C:\Program Files (x86)\cloudflared` 设进环境变量 path
- win11 开机自启
  - NSSM方式参考：[WIN使用NSSM管理service](./WIN使用NSSM管理service.md)
  - VBS方式：
    - 启动脚本参考：[VBS静默执行PS脚本](../编码笔记/VBS静默执行PS脚本.md)
    - 脚本放入 `win + r` 输入 `shell:startup` 回车后出现的文件夹中
:::

## 以 Ubuntu - arm64 为例

### 安装
```shell
# 下载
wget https://github.com/cloudflare/cloudflared/releases/download/2025.6.1/cloudflared-linux-arm64.deb

# 安装
dpkg -i cloudflared-linux-arm64.deb

# 启动
cloudflared proxy-dns
```

### 部署
设为 service
```shell
# 查看路径
which cloudflared
# 编辑配置文件
vi /etc/systemd/system/cloudflared-proxy-dns.service
# 启动 service
systemctl daemon-reload
systemctl enable --now cloudflared-proxy-dns
systemctl status cloudflared-proxy-dns
```

`cloudflared-proxy-dns.service` 配置文件：

```shell 
[Unit]
Description=cloudflared DNS over HTTPS Proxy
After=network.target

[Service]
Type=simple
User=nobody
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
ExecStart=/usr/local/bin/cloudflared proxy-dns
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

