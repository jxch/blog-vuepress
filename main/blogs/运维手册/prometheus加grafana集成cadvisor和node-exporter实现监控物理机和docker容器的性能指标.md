---
title: prometheus 加 grafana 集成 cadvisor 和 node-exporter 实现监控物理机和 docker 容器的性能指标
date: 2025/04/29
tags:
 - prometheus
categories:
 - 运维手册
---

## 部署采集器

:::tip
- node-exporter 采集物理机指标
- cadvisor 采集各个 Docker 容器的指标
:::

```yml
services:
  node-exporter:
    image: prom/node-exporter:latest
    deploy:
      mode: global
      restart_policy:
        condition: any
    ports:
      - 9100:9100
    pid: host
    volumes:
      - /:/host:ro,rslave
    command:
      - --path.rootfs=/host
    labels:
      - "monitoring=enabled"

  cadvisor:
    image: cadvisor/cadvisor:latest
    deploy:
      mode: global
      restart_policy:
        condition: any
    ports: 
      - 8080:8080
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    labels:
      - "monitoring=enabled"
```

## 自动更新采集端点

:::tip
- 需要整理所有的端点供 prometheus 采集信息
- 保存到 file_sd 文件夹下的 json 文件中，这样 prometheus 就可以自动解析了
:::

```bash
#!/bin/bash

EXPORTER_PORTS=(9100 8080)
PROM_FILE_SD_DIR="/etc/prometheus/file_sd"
mkdir -p $PROM_FILE_SD_DIR

# 只选 Ready 状态节点
NODES=$(docker node ls --format '{{.Hostname}} {{.Status}}' | awk '$2 == "Ready" {print $1}')

for PORT in "${EXPORTER_PORTS[@]}"; do
  JSON_FILE="$PROM_FILE_SD_DIR/exporter_${PORT}.json"
  echo "[" > $JSON_FILE
  SEP=""
  for HOST in $NODES; do
    IP=$(docker node inspect "$HOST" --format '{{ index .Spec.Labels "exporter_ip" }}')
    if [[ -n "$IP" ]]; then
      echo "${SEP}{\"targets\":[\"$IP:$PORT\"],\"labels\":{\"node\":\"$HOST\"}}" >> $JSON_FILE
      SEP=","
    fi
  done
  echo "]" >> $JSON_FILE
done
```

## prometheus

```yml
# prometheus.yml

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-exporter'
    file_sd_configs:
      - files:
          - /etc/prometheus/file_sd/exporter_9100.json

  - job_name: 'cadvisor'
    file_sd_configs:
      - files:
          - /etc/prometheus/file_sd/exporter_8080.json
```

```yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: always
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - /etc/prometheus/file_sd:/etc/prometheus/file_sd:ro
    ports:
      - "9090:9090"
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--web.enable-lifecycle"
```

## grafana

:::tip
- node-exporter 模板：11074、1860、405
- cadvisor 模板：14282
:::

```yml
services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    user: root
    ports:
      - "9300:3000"
    volumes:
      - ./data/grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: always
```



