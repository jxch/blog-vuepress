---
title: JAVA并发-设计模式
date: 2025/04/22
---

- 终止线程的设计模式
	- Two-phase Termination（两阶段终止）模式：终止标志位
- 避免共享的设计模式
	- Immutability模式：只读
	- Copy-on-Write模式：写时复制
	- Thread-Specific Storage 模式：线程本地存储 ThreadLocal
- 多线程版本的 if 模式
	- Guarded Suspension 模式（Guarded Wait 模式、Spin Lock 模式）：一个线程需要等待另外的线程完成后继续下一步操作
	- Balking 模式：一个线程发现另一个线程已经做了某一件相同的事，那么本线程就无需再做了，直接结束返回
- 多线程分工模式
	- Thread-Per-Message 模式：为每个任务分配一个独立的线程
	- Worker Thread 模式：线程池
	- 生产者-消费者模式：核心是一个任务队列
		- 过饱问题：生产者生产的速度大于消费者消费的速度
			- 消费者每天能处理的量比生产者生产的少：消费者加机器
			- 消费者每天能处理的量比生产者生产的多：适当的加大队列
			- 系统高峰期生产者速度太快：生产者限流
