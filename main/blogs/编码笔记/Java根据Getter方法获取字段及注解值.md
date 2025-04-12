---
title: Java 根据 Getter 方法获取字段及注解值
date: 2025/04/12
tags:
 - Java
categories:
 - 编码笔记
---

```java
@FunctionalInterface
public interface SIFunction<T, R> extends Function<T, R>, Serializable {}
```

```java
public class FieldUtil {

    public static <T, R> String getFieldNameByGetter(SIFunction<T, R> func) {
        try {
            SerializedLambda serializedLambda = getSerializedLambda(func);
            String getterMethodName = serializedLambda.getImplMethodName();
            return methodToFieldName(getterMethodName);
        } catch (Exception e) {
            throw new RuntimeException("获取字段名失败", e);
        }
    }

    private static SerializedLambda getSerializedLambda(Serializable lambda) throws Exception {
        // 通过反射调用writeReplace方法获取SerializedLambda
        Method writeReplace = lambda.getClass().getDeclaredMethod("writeReplace");
        writeReplace.setAccessible(true);
        return (SerializedLambda) writeReplace.invoke(lambda);
    }

    private static String methodToFieldName(String getterMethodName) {
        String fieldName;
        if (getterMethodName.startsWith("get")) {
            fieldName = getterMethodName.substring(3);
        } else if (getterMethodName.startsWith("is")) {
            fieldName = getterMethodName.substring(2);
        } else {
            throw new IllegalArgumentException("无效的getter方法名称: " + getterMethodName);
        }
        // 将首字母转小写
        return fieldName.substring(0, 1).toLowerCase(Locale.ROOT) + fieldName.substring(1);
    }

    public static <T, R> Field getFieldByGetter(SIFunction<T, R> getter, Class<T> clazz) {
        try {
            return clazz.getDeclaredField(getFieldNameByGetter(getter));
        } catch (NoSuchFieldException e) {
            throw new RuntimeException("字段不存在", e);
        }
    }

    public static <T, R, A extends Annotation> String getAnnotationValueByGetter(SIFunction<T, R> getter, Class<T> clazz, Class<A> annotationClass) {
        try {
            // 获取字段名
            String fieldName = getFieldNameByGetter(getter);

            // 获取字段对象
            Field field = clazz.getDeclaredField(fieldName);

            // 获取字段上的注解
            A annotation = field.getAnnotation(annotationClass);

            // 如果注解存在，返回其 value 属性值
            if (annotation != null) {
                // 使用反射获取注解的 value 属性值
                Method valueMethod = annotationClass.getMethod("value");
                return (String) valueMethod.invoke(annotation);
            } else {
                throw new RuntimeException("字段没有指定的注解: " + fieldName);
            }
        } catch (Exception e) {
            throw new RuntimeException("获取注解值失败", e);
        }
    }

}
```
