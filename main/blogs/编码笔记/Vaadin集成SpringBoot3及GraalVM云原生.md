---
title: Vaadin 集成 SpringBoot3 及 GraalVM 云原生
date: 2025/04/18
tags:
 - GraalVM
 - SpringBoot3
 - Vaadin
categories:
 - 编码笔记
---

## 依赖

:::info
- SpringBoot 版本必须在 3.4.4 之上
- Vaadin 版本必须在 24.7.2 之上
:::

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.4</version>
    </parent>
```

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.vaadin</groupId>
            <artifactId>vaadin-spring-boot-starter</artifactId>
            <version>24.7.2</version>
        </dependency>
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
            <plugin>
                <groupId>com.vaadin</groupId>
                <artifactId>vaadin-maven-plugin</artifactId>
                <version>24.7.2</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-frontend</goal>
                            <goal>build-frontend</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

## 兼容性

:::info
Vaadin 组件中用到过的所有类都必须声明反射

其他兼容性（静态资源、反射等）参见 [SpringBoot3集成GraalVM云原生](./SpringBoot3集成GraalVM云原生.md)
:::

## view

```java
@Route("clock")
public class ClockView extends VerticalLayout {
    public ClockView(){
        // todo 在构造方法中编写这个页面（可以通过构造方法参数直接注入 SpringBean）
    }
}
```
