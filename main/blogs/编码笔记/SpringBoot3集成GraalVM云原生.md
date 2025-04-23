---
title: SpringBoot3 集成 GraalVM 云原生
date: 2025/04/18
tags:
 - GraalVM
 - SpringBoot
categories:
 - 编码笔记
---

## 依赖

:::info
SpringBoot 版本必须在 3.4.4 之上
:::

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.4</version>
    </parent>
```

```xml
    <build>
        <finalName>image-name</finalName>
        <plugins>
            <plugin>
                <groupId>org.graalvm.buildtools</groupId>
                <artifactId>native-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>3.4.4</version>
            </plugin>
        </plugins>
    </build>
```

## 构建发布

```shell
mvn clean -Pnative spring-boot:build-image -f pom.xml
docker tag image-name:{version} jxch/image-name:latest
docker push jxch/image-name:latest
```

## 兼容性

### 反射声明配置

需要声明哪些类被反射过（尤其是被JSON序列化的类）

```java
@Configuration
@RegisterReflectionForBinding({
        CPunchCardNormal.class, CPunchCardState.class, UserConfig.class, User.class
})
public class NativeReflectionConfig {
}
```

### 静态资源声明配置

声明用到了哪些 resources 目录下的静态资源文件

```java
@Configuration
@ImportRuntimeHints(NativeRuntimeHints.class)
public class NativeRuntimeHints implements RuntimeHintsRegistrar {
    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        hints.resources().registerPattern("xxx.json");
    }
}
```

