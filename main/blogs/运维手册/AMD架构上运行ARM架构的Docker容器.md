---
title: AMD 架构上运行 ARM 架构的 Docker 容器
date: 2025/05/06
tags:
 - Docker
categories:
 - 运维手册
---

安装 QEMU binfmt 支持：
```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

测试：
```bash
docker run --rm --platform linux/arm64/v8 arm64v8/alpine uname -m
```

:::tip
- QEMU 是一个开源的硬件虚拟化工具，可以在 x86_64 主机上模拟 ARM64（aarch64）环境，从而让 Docker 能“假装”自己是 ARM 机器，运行 ARM 容器镜像。
- QEMU 虚拟化会大大降低运行速度（比真实 ARM 机子慢很多），只适合测试和编译。
- 某些复杂场景（如需内核特性、特殊指令集等）可能不完全兼容。
:::
