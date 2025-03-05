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
util.dumpSchemas(["staffcloud_crm", "staffcloud_oa", "staffcloud_perf", "staffcloud_salary", "staffcloud_staff", "staffcloud_study", "user_system"], "E:\\DB\\staffcloud");
```

## 导入

```js
\connect username@host
\js
util.loadDump("E:\\DB\\asktrue\\project_exam_student_result", {threads: 4});
```

::: info 需要开启性能模式
开启性能模式：`performance_schema=ON`
:::

