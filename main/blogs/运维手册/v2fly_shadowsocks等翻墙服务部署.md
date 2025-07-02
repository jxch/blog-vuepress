---
title: V2fly Shadowsocks 等翻墙服务部署
date: 2025/03/08
tags:
 - proxy
categories:
 - 运维手册
---

::: info
替换一下各配置文件中的 uuid 就可以了
:::

## docker swarm 部署

```yml
services:
  shadowsocks: 
    image: shadowsocks/shadowsocks-libev 
    restart: unless-stopped
    ports: 
      - 12346:12346
      - 12346:12346/udp 
    configs: 
      - source: shadowsocks_config
        target: /etc/shadowsocks-libev/config.json 
    environment:
      - DNS_ADDRS=8.8.8.8,8.8.4.4
    command: ss-server -c /etc/shadowsocks-libev/config.json 
  v2fly:
    image: v2fly/v2fly-core
    restart: unless-stopped
    ports:
      - 12345:12345
    configs: 
      - source: v2fly_config
        target: /etc/v2ray/config.json
    entrypoint: ["v2ray", "run",  "-c", "/etc/v2ray/config.json"]


configs:
  shadowsocks_config:
    file: /root/server/config/shadowsocks/config.json 
  v2fly_config:
    file: /root/server/config/v2fly/config.json
```

## shadowsocks config.json

```json
{
    "server":"0.0.0.0",
    "server_port":12346,
    "password":"uuid",
    "timeout":3000,
    "method":"aes-256-gcm",
    "fast_open":false,
    "mode":"tcp_and_udp"
}

```

## v2fly config.json

```json
{
    "log": {
        "access": "/var/log/v2ray/access.log",
        "error": "/var/log/v2ray/error.log",
        "loglevel": "warning"
    },
    "inbound": {
        "port": 12345,
        "protocol": "vmess",
        "settings": {
            "clients": [
                {
                    "id": "uuid",
                    "level": 1,
                    "alterId": 0
                }
            ]
        }
    },
    "outbound": {
        "protocol": "freedom",
        "settings": {}
    },
    "inboundDetour": [],
    "outboundDetour": [
        {
            "protocol": "blackhole",
            "settings": {},
            "tag": "blocked"
        }
    ],
    "routing": {
        "strategy": "rules",
        "settings": {
            "rules": [
                {
                    "type": "field",
                    "ip": [
                        "0.0.0.0/8",
                        "10.0.0.0/8",
                        "100.64.0.0/10",
                        "127.0.0.0/8",
                        "169.254.0.0/16",
                        "172.16.0.0/12",
                        "192.0.0.0/24",
                        "192.0.2.0/24",
                        "192.168.0.0/16",
                        "198.18.0.0/15",
                        "198.51.100.0/24",
                        "203.0.113.0/24",
                        "::1/128",
                        "fc00::/7",
                        "fe80::/10"
                    ],
                    "outboundTag": "blocked"
                }
            ]
        }
    }
}

```


