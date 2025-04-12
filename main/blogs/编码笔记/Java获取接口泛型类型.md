---
title: Java 获取接口泛型类型
date: 2025/04/12
tags:
 - Java
categories:
 - 编码笔记
---

```java
    @SuppressWarnings("unchecked")
    public Class<S> getTypeClass() {
        Class<?> clazz = this.getClass();
        Type result = InterfaceUtils.findParameterizedType(clazz, ProjectTypeServiceGetter.class);
        if (result != null) {
            ParameterizedType pt = (ParameterizedType) result;
            // 获取第一个泛型参数，它对应 S
            Type sType = pt.getActualTypeArguments()[0];
            if (sType instanceof Class) {
                return (Class<S>) sType;
            } else if (sType instanceof ParameterizedType) {
                // 处理嵌套泛型情况
                return (Class<S>) ((ParameterizedType) sType).getRawType();
            }
        }
        throw new IllegalStateException("无法获取泛型类型 S 的 Class 对象");
    }
```


```java
public class InterfaceUtils {

    /**
     * 获取指定类实现的所有接口，包括父类实现的接口以及接口之间的继承关系。
     *
     * @param clazz 要查找接口的类
     * @return 包含所有接口的集合
     */
    public static Set<Class<?>> getAllInterfaces(Class<?> clazz) {
        Set<Class<?>> interfaces = new HashSet<>();
        // 遍历类的继承层次结构
        while (clazz != null) {
            // 获取当前类直接实现的接口
            Class<?>[] directInterfaces = clazz.getInterfaces();
            for (Class<?> intf : directInterfaces) {
                collectInterfaces(intf, interfaces);
            }
            clazz = clazz.getSuperclass();
        }
        return interfaces;
    }

    /**
     * 递归地将接口及其扩展的接口加入到集合中。
     *
     * @param intf       当前的接口
     * @param interfaces 用来保存所有接口的集合
     */
    private static void collectInterfaces(Class<?> intf, Set<Class<?>> interfaces) {
        if (interfaces.add(intf)) {
            // 获取接口可能扩展的其他接口
            for (Class<?> superInterface : intf.getInterfaces()) {
                collectInterfaces(superInterface, interfaces);
            }
        }
    }

    public static Type findParameterizedType(Type clazz, Class<?> targetType) {
        if (clazz instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) clazz;
            // 如果直接匹配目标接口
            if (targetType.equals(pt.getRawType())) {
                return pt;
            }
            // 检查该参数化类型的原始类型的接口
            return findParameterizedType(pt.getRawType(), targetType);
        } else if (clazz instanceof Class) {
            Class<?> currentClass = (Class<?>) clazz;

            // 检查当前类所有直接实现的接口
            for (Type intf : currentClass.getGenericInterfaces()) {
                Type result = findParameterizedType(intf, targetType);
                if (result != null) {
                    return result;
                }
            }
            // 检查父类
            Type superClass = currentClass.getGenericSuperclass();
            if (superClass != null) {
                return findParameterizedType(superClass, targetType);
            }
        }
        return null;
    }

}
```

