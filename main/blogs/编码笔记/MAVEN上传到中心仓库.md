---
title: MAVEN 上传到中心仓库
date: 2025/03/05
tags:
 - MAVEN
categories:
 - 编码笔记
---

::: tip
1. 注册中心仓库账户：[central.sonatype.com](https://central.sonatype.com)
2. 使用 GPG 生成密钥并上传到公钥服务器
3. 配置 Maven 的 Setting.xml 文件
4. pom.xml 文件模板
5. 发布到中心仓库
:::

## 注册中心仓库账户 

1. 注册中心仓库的账户：[central.sonatype.com](https://central.sonatype.com)
2. 使用 Github 登录，可以自动获得命名空间 -> 有效的 groupId
3. Generate User Token  ->  自动生成 maven setting.xml 的 server 配置项（修改 id 为 central）

## GPG

```powershell
# 安装GPG
winget install GnuPG.Gpg4win

# 生成密钥
gpg --full-generate-key

# 上传公钥到GPG公钥服务器
gpg --keyserver pgp.mit.edu --send-keys <KEY_ID>
gpg --keyserver keyserver.ubuntu.com --send-keys <KEY_ID>

# 导出公钥
gpg --armor --export <KEY_ID> > public_key_1.asc
# 导出私钥
gpg --armor --export-secret-keys <KEY_ID> > private_key_2.asc
```

## Maven Setting.xml

```xml
	<servers>
		<server>
			<id>central</id>
			<username>${username}</username>
			<password>${token}</password>
		</server>
    </servers>

	<profiles>
		<profile>
			<id>gpg-profile</id>
			<properties>
				<gpg.keyname> ${KEY_ID} </gpg.keyname>
				<gpg.passphrase><![CDATA[password]]></gpg.passphrase>
			</properties>
		</profile>
	</profiles>
	<activeProfiles>
		<activeProfile>gpg-profile</activeProfile>
	</activeProfiles>
```

## pom.xml

```xml
    <groupId>io.github.jxch</groupId>
    <artifactId>capital-py4j-spring-boot-starter</artifactId>
    <version>3.2.5-alpha.1</version>
    <name>capital-py4j-spring-boot-starter</name>
    <description>py4j本地执行引擎与springboot的无缝集成</description>
    <url>https://github.com/jxch-capital/capital-py4j-spring-boot-starter</url>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <lombok.version>1.18.32</lombok.version>
        <hutool.version>5.8.27</hutool.version>
        <maven-source-plugin.version>3.3.1</maven-source-plugin.version>
        <maven-javadoc-plugin.version>3.6.3</maven-javadoc-plugin.version>
        <maven-gpg-plugin.version>3.2.4</maven-gpg-plugin.version>
        <maven-release-plugin.version>3.0.1</maven-release-plugin.version>
        <central-publishing-maven-plugin.version>0.4.0</central-publishing-maven-plugin.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>${maven-source-plugin.version}</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>${maven-javadoc-plugin.version}</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.sonatype.central</groupId>
                <artifactId>central-publishing-maven-plugin</artifactId>
                <version>${central-publishing-maven-plugin.version}</version>
                <extensions>true</extensions>
                <configuration>
                    <publishingServerId>central</publishingServerId>
                    <tokenAuth>true</tokenAuth>
                    <autoPublish>true</autoPublish>
                    <waitUntil>published</waitUntil>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-release-plugin</artifactId>
                <version>${maven-release-plugin.version}</version>
                <configuration>
                    <goals>deploy nexus-staging:release</goals>
                    <autoVersionSubmodules>true</autoVersionSubmodules>
                    <useReleaseProfile>false</useReleaseProfile>
                    <releaseProfiles>release</releaseProfiles>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>${maven-gpg-plugin.version}</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <licenses>
        <license>
            <name>The Apache Software License, Version 2.0</name>
            <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo</distribution>
        </license>
    </licenses>

    <scm>
        <connection>scm:git:git://github.com/jxch-capital/capital-py4j-spring-boot-starter.git</connection>
        <developerConnection>scm:git:ssh://github.com:jxch-capital/capital-py4j-spring-boot-starter.git</developerConnection>
        <url>${developer_github_project_url}</url>
    </scm>

    <developers>
        <developer>
            <id>${developer_id}</id>
            <name>${developer_name}</name>
            <email>${developer_email}</email>
            <url>${developer_github_url}</url>
        </developer>
    </developers>

    <distributionManagement>
        <snapshotRepository>
            <id>central</id>
            <url>https://s01.oss.sonatype.org/content/repositories/snapshots</url>
        </snapshotRepository>
        <repository>
            <id>central</id>
            <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
    </distributionManagement>
```

## 发布

```shell
mvn deploy -f pom.xml
```

