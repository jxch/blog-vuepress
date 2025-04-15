---
title: shlink 部署及 openfeign 调用
date: 2025/04/16
tags:
 - shlink
 - openfeign
categories:
 - 编码笔记
---

## shlink 部署

```yml
services:
  shlink:
    image: shlinkio/shlink:latest
    ports:
      - "28881:8080"
    environment:
      - SHLINK_SHORT_CODES_LENGTH=5
      - INITIAL_API_KEY=cda4282f-27a5-4a93-bb8a-47234309628f
      - DB_DRIVER=mysql
      - DB_HOST=mysql_host
      - DB_PORT=3306
      - DB_NAME=shlink
      - DB_USER=shlink
      - DB_PASSWORD=662caa92-1f0e-40f5-9656-2147c76a4f73
```

## openfeign

```java
@FeignClient(name = CloudName.SHLINK, path = "/rest/v3",
        fallbackFactory = ShlinkClientFallbackFactory.class,
        configuration = ShlinkHeaderConfig.class)
public interface ShlinkClient {
    @PostMapping("/short-urls")
    ShortUrlRes shortUrls(@RequestBody ShortUrlParam param);
}
```

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ShortUrlParam {
    private String longUrl;
}
```

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ShortUrlRes {
    private String shortUrl;
    private String shortCode;
    private String longUrl;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private Date dateCreated;
    private String domain;
    private String title;
    private Boolean crawlable;
    private Boolean forwardQuery;
    private Boolean hasRedirectRules;
}
```

```java
@RequiredArgsConstructor
public class ShlinkHeaderConfig {
    private final ShlinkConfig shlinkConfig;
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> requestTemplate.header("X-Api-Key", shlinkConfig.getApiKey());
    }
}
```

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "app.shlink")
public class ShlinkConfig {
    private String apiKey;
}
```

```yml
app:
  shlink:
    api-key: cda4282f-27a5-4a93-bb8a-47234309628f
```
