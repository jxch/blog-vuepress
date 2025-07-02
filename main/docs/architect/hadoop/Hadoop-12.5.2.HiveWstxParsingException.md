---
title: 12.5.2. Hive WstxParsingException
date: 2025/07/02
---

:::danger
- Hive-WstxParsingException: Illegal character entity: expansion character
:::

`hive-site.xml` 文件第 3215 行左右有一个特殊字符 (`&#8;`)，删掉它:

```xml
214      <description>
3215       Ensures commands with OVERWRITE (such as INSERT OVERWRITE) acquire Exclusive      locks for&#8;transactional tables.  This ensures that inserts (w/o overwrite) runni     ng concurrently
3216       are not hidden by the INSERT OVERWRITE.
3217     </description>
```

