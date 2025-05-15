---
title: SpringBoot 集成 SpringBootAdmin
date: 2025/05/15
tags:
 - SpringBoot
 - SpringBootAdmin
categories:
 - 运维手册
---

:::tip
1. 部署 SpringBootAdminServer
2. 集成 SpringBootAdminClient
3. 按不同环境修改 SpringBootAdminClient 注册的实例名称
:::

## 部署 SpringBootAdminServer

```java
@EnableAdminServer
@SpringBootApplication
public class AdminServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminServerApplication.class, args);
    }
}
```

:::info
- 开启 `httpBasic` 来允许 `curl` 使用用户名密码的方式访问 `/actuator`
:::

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .and()
                .httpBasic()
                .and()
                .logout()
                .and()
                .csrf().disable();
    }
}
```

:::info
- 可以集成注册中心（如 Nacos）实现服务的自动发现
- SpringBootAdmin2 可以通过 `ignored-services` 属性忽略注册中心的某些服务
- SpringBootAdmin3 可以通过 `metadata-filter` 属性通过元数据来选择注册中心中的某些服务
:::

```yml
server:
  port: 8111

spring:
  application:
    name: SPRING-BOOT-ADMIN-SERVER
  security:
    user:
      name: admin
      password: password
  cloud:
    nacos:
      server-addr: nacos-server-addr
      discovery:
        username: nacos
        password: password
        group: DEFAULT_GROUP
        namespace: public
  boot:
    admin:
      discovery:
        ignored-services: shlink,snowflake
      client:
        url: http://localhost:${server.port}
        username: ${spring.security.user.name}
        password: ${spring.security.user.password}
        instance:
          prefer-ip: true
          metadata:
            environment: ${spring.profiles.active}
            user:
              name: ${spring.security.user.name}
              password: ${spring.security.user.password}

management:
  endpoints:
    web:
      exposure:
        include: '*'
      base-path: /actuator
  endpoint:
    health:
      show-details: always
    shutdown:
      enabled: true
```

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.9</version>
        <relativePath/>
    </parent>

   <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-server</artifactId>
            <version>${spring-boot-admin.version}</version>
        </dependency>
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-server-ui</artifactId>
            <version>${spring-boot-admin.version}</version>
        </dependency>
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-client</artifactId>
            <version>${spring-boot-admin.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
    </dependencies>
```

## 集成 SpringBootAdminClient

:::info
- 通过 `spring.boot.admin.client.instance.metadata` 来自定义要注册的元数据
- 通过 `spring.boot.admin.client.instance.metadata.user` 来定义访问 `/actuator` 所需的用户名密码
- 通过 `spring.boot.admin.client.username` 来定义 SpringBootAdminServer 所需的用户名
- 通过 `spring.boot.admin.client.password` 来定义 SpringBootAdminServer 所需的密码
:::

```yml
spring:
  boot:
    admin:
      client:
        url: http://asktrue.cn:8111
        username: admin
        password: password
        instance:
          prefer-ip: true
          metadata:
            application: ${spring.application.name}
            environment: ${spring.profiles.active}
            ip: ${spring.cloud.client.ip-address}
            port: ${server.port}
            user:
              name: ${spring.security.user.name}
              password: ${spring.security.user.password}
```

```xml
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-client</artifactId>
            <version>${spring-boot-admin.version}</version>
        </dependency>
```

## 按不同环境修改 SpringBootAdminClient 注册的实例名称

:::info
- 只能通过代码修改 `spring.boot.admin.client.instance.name` 属性来修改实例名称
:::error
- 直接在 `application.yml` 中修改 `spring.boot.admin.client.instance.name` 属性是无效的
:::
:::

```java
@Configuration
public class SBANameConfig implements ApplicationListener<ApplicationReadyEvent> {
    @Value("${spring.application.name}")
    private String appName;
    @Value("${spring.profiles.active:default}")
    private String active;

    @PostConstruct
    public void setAdminClientNameProperty() {
        // 设置 System Property 让 SBA client 用自定义 name
        System.setProperty("spring.boot.admin.client.instance.name", appName + "-[" + active + "]");
    }
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // 这里也可以设置，保证启动后仍然有效
        System.setProperty("spring.boot.admin.client.instance.name", appName + "-[" + active + "]");
    }
}
```
