---
title: ELK 部署
date: 2025/04/16
tags:
 - elasticsearch
categories:
 - 运维手册
---

## docker-compose.yml

```yml
services:
  elasticsearch: 
    image: elasticsearch:8.16.1
    restart: always
    environment:
      - discovery.type=single-node 
      - xpack.security.enabled=true
    volumes:
      - /mnt/nexus3/es_data:/usr/share/elasticsearch/data 
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
  kibana: 
    image: kibana:8.16.1 
    ports:
      - "12563:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - XPACK_SECURITY_ENABLED=true
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD="3UGDvTkAmzhprC5*9PUw"
    depends_on:
      - elasticsearch
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
  zipkin:
    image: bitnami/zipkin:3
    ports:
      - "12411:9411"
    environment:
      - STORAGE_TYPE=elasticsearch
      - ES_HOSTS=elasticsearch:9200
      - ES_USERNAME=elastic
      - ES_PASSWORD=rC4hG9mR9DUC109=DeS8
    depends_on:
      - elasticsearch
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
  logstash:
    image: bitnami/logstash:8.17.0
    ports: 
      - "5044:8080"
    volumes:
      - ./logstash.conf:/opt/bitnami/logstash/pipeline/logstash.conf
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
```

## logstash.conf

```config
input {
  tcp {
    port => 8080 
    codec => json_lines 
  }
}


output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"] 
    user => "elastic"
    password => "rC4hG9mR9DUC109=DeS8"
    index => "logs-%{+YYYY.MM.dd}"
    ssl => false 
  }
}
```

## 设置密码

```bash
# 进入 elasticsearch 容器内部
docker exec -it <elasticsearch> sh

# 设置超级用户的密码，此用户名密码可以用在logstash、zipkin和kibana web ui的登录上
bin/elasticsearch-reset-password -u elastic

# 设置kibana用户的密码，此用户专用于kibana容器与elasticsearch容器的交互
bin/elasticsearch-reset-password -u kibana_system
```
