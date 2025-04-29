---
title: SpringBoot2 实现 SpringCache 集成多个 CacheManager
date: 2025/04/29
tags:
 - SpringBoot
categories:
 - 编码笔记
---

:::info
- 通过 `CachingConfigurerSupport` 指定全局默认的主 `CacheManager`
- `@Cacheable` 等 SpringCache 注解可以通过 `cacheManager` 属性指定自定义的 `CacheManager`
:::

```java
@Configuration
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {
    private final CacheManager cacheManager;

    public CacheConfig(@Qualifier(RedisCacheConfig.REDIS_CACHE_NAME) CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Override
    public CacheManager cacheManager() {
        return cacheManager;
    }

}
```

```java
@Data
@Configuration
@ConditionalOnClass(name = "com.github.benmanes.caffeine.cache.Caffeine")
public class LocalCacheConfig {
    public static final String LOCAL_CACHE_MANAGER = "caffeineCacheManager";
    @Value("${app.cache.ttl-seconds:3600}")
    private Long ttlSeconds;
    @Value("${app.cache.maximum:5000}")
    private Integer maximum;

    @Bean(LOCAL_CACHE_MANAGER)
    public CaffeineCacheManager caffeineCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(ttlSeconds, TimeUnit.SECONDS)
                .maximumSize(maximum));
        return cacheManager;
    }

}
```

```java
@Data
@Configuration
@ConditionalOnClass(name = "org.springframework.data.redis.cache.RedisCacheManager")
public class RedisCacheConfig {
    public static final String REDIS_CACHE_NAME = "cacheManager";
    @Value("${app.cache.ttl-seconds:3600}")
    private Long ttlSeconds;

    @Bean
    @ConditionalOnMissingBean(RedisCacheConfiguration.class)
    public RedisCacheConfiguration redisCacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(ttlSeconds))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }

    @Primary
    @Bean(REDIS_CACHE_NAME)
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory, RedisCacheConfiguration config) {
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }

}
```

```yml
app:
  cache:
    ttl-seconds: 3600
    maximum: 5000
```
