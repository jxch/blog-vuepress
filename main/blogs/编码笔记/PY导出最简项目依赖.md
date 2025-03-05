---
title: Python 导出最简项目依赖
date: 2025/03/05
tags:
 - Python
categories:
 - 编码笔记
---

::: tip
使用 `pipreqs` 导出项目依赖
:::

## 导出依赖

```shell
# 安装 pipreqs
pip install pipreqs

# 导出项目依赖到 requirements.txt
pipreqs ./ --encoding=utf-8

# 覆盖 requirements.txt
pipreqs ./ --encoding=utf-8 --force
```

