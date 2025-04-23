---
title: SpringBoot2 Starter 自定义环境变量
date: 2025/04/12
tags:
 - SpringBoot
categories:
 - 编码笔记
---

```
META-INF
  - application-referenced.yml
  - spring.factories
```

spring.factories
```prop
org.springframework.boot.env.EnvironmentPostProcessor=package.path.CommonEnvironmentPostProcessor
```

```java
public class CommonEnvironmentPostProcessor implements EnvironmentPostProcessor {
    private static final String PROPERTY_SOURCE_NAME = CommonEnvironmentPostProcessor.class.getSimpleName();

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
        Resource resource = new ClassPathResource("META-INF/application-referenced.yml");

        if (resource.exists()) {
            try {
                PropertySource<?> yamlProps = loader.load(PROPERTY_SOURCE_NAME, resource).get(0);
                environment.getPropertySources().addLast(yamlProps);  // 注意：使用 `.addLast()`，确保主项目配置优先
            } catch (IOException e) {
                throw new IllegalStateException("Failed to load YAML file: " + resource.getFilename(), e);
            }
        }
    }

}
```
