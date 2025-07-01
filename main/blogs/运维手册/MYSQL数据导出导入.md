---
title: MYSQL 数据导出导入
date: 2025/03/05
tags:
 - MYSQL
categories:
 - 运维手册
---

::: tip
1. 安装 mysqlsh
2. 导出数据
3. 导入数据（需要开启性能模式）
:::

## 安装 mysqlsh

```shell
winget install Oracle.MySQLShell
mysqlsh
```

## 导出

```js
\connect username@host
\js
util.dumpTables("asktrue_exam", ["project_exam_student_result"], "E:\\DB\\asktrue")
util.dumpSchemas(["staffcloud_crm", "staffcloud_oa"], "E:\\DB\\staffcloud");

// 移除 definer，比如创建该库的用户名
util.dumpSchemas(["staffcloud_crm", "staffcloud_oa"], "E:\\DB\\staffcloud", {compatibility:["strip_definers"]});
```

## 导入

```js
\connect username@host
\js
util.loadDump("E:\\DB\\asktrue\\project_exam_student_result", {threads: 4});

// 指定导入另一个 schema
util.loadDump("E:\\DB-BACK\\matcheasy_new_gray_20250630_0100_2", {schema: "matcheasy_new"})
```

::: info 需要开启性能模式
开启性能模式：`performance_schema=ON`
:::

