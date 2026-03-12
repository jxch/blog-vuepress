---
title: SpringBoot 集成 JOOQ 
date: 2026/02/14
tags:
 - SpringBoot
categories:
 - 编码笔记
---

## 依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jooq</artifactId>
        </dependency>
```

## JOOQ 自动生成

:::info
- 让 `mvn compiler` 自动生成
- 生成到 `target/generated-sources/jooq` 目录中
:::

```xml

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <release>${java.version}</release>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.jooq</groupId>
                <artifactId>jooq-codegen-maven</artifactId>
                <version>${jooq.codegen.maven.version}</version>
                <executions>
                    <execution>
                        <id>generate-jooq</id>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                        <configuration>
                            <generator>
                                <database>
                                    <name>org.jooq.meta.extensions.ddl.DDLDatabase</name>
                                    <properties>
                                        <property>
                                            <key>scripts</key>
                                            <value>src/main/resources/schema.sql</value>
                                        </property>
                                        <property>
                                            <key>sort</key>
                                            <value>semantic</value>
                                        </property>
                                    </properties>
                                </database>

                                <generate>
                                    <daos>true</daos>
                                    <pojos>true</pojos>
                                    <fluentSetters>true</fluentSetters>
                                    <springAnnotations>true</springAnnotations>
                                </generate>

                                <target>
                                    <packageName>demo.jooq.generated</packageName>
                                    <directory>target/generated-sources/jooq</directory>
                                </target>
                            </generator>
                        </configuration>
                    </execution>
                </executions>

                <dependencies>
                    <dependency>
                        <groupId>org.jooq</groupId>
                        <artifactId>jooq-meta-extensions</artifactId>
                        <version>${jooq.meta.extensions.version}</version>
                    </dependency>
                </dependencies>
            </plugin>

            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>build-helper-maven-plugin</artifactId>
                <version>${build.helper.maven.plugin.version}</version>
                <executions>
                    <execution>
                        <id>add-generated</id>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>add-source</goal>
                        </goals>
                        <configuration>
                            <sources>
                                <source>target/generated-sources/jooq</source>
                            </sources>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

## `application.yml`

```yml
spring:
  datasource:
    url: jdbc:sqlite:G:\data\ktools\ktools.sqlite
    driver-class-name: org.sqlite.JDBC
  jooq:
    sql-dialect: sqlite
```
