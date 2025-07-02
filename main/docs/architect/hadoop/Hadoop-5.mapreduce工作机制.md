---
title: 5. mapreduce 工作机制
date: 2025/07/02
---

一个完整的 mapreduce 程序在分布式运行时有三类实例进程：
1. MRAppMaster：负责整个程序的过程调度及状态协调
2. MapTask：负责 map 阶段的整个数据处理流程
3. ReduceTask：负责 reduce 阶段的整个数据处理流程

---
流程:
1. 一个 mr 程序启动的时候，最先启动的是 MRAppMaster，MRAppMaster 启动后根据本次 job 的描述信息，计算出需要的 maptask 实例数量，然后向集群申请机器启动相应数量的 maptask 进程（这里先理解成一个文件一个 maptask）
2. maptask 进程启动之后，根据给定的数据切片范围进行数据处理，主体流程为：
    1. 利用客户指定的 inputformat 来获取数据，形成输入 K，V 对
    2. 将输入 KV 对传递给客户定义的 `map()` 方法，做逻辑运算，并将 `map()` 方法输出的 KV 对收集到缓存
    3. 将缓存中的 KV 对按照 K 分区排序后不断溢写到磁盘文件
3. MRAppMaster 监控到所有 maptask 进程任务完成之后，会根据客户指定的参数启动相应数量的 reducetask 进程，并告知 reducetask 进程要处理的数据范围（数据分区）
4. Reducetask 进程启动之后，根据 MRAppMaster 告知的待处理数据所在位置，从若干台 maptask 运行所在机器上获取到若干个 maptask 输出结果文件，并在本地进行重新归并排序，然后按照相同 key 的 KV 为一个组，调用客户定义的 `reduce()` 方法进行逻辑运算，并收集运算输出的结果 KV，然后调用客户指定的 outputformat 将结果数据输出到外部存储

---

{% mermaid %}
graph TD
    M -.->|开启两个MapTask| C1
    M -.->|所有maptask进程完成后<br>开启两个ReduceTask<br>告知数据所在位置| R1
    M(MRAppMaster) --> A(input dir)
    A --> B1([1.txt])
    A --> B2([2.txt])
    B1 --InputFormat<br>TextInputFormat--> C1([MapTask1])
    B2 --InputFormat<br>TextInputFormat--> C2([MapTask2])
    M -.->|开启两个MapTask| C2
    C1 --Mapper.map-->D1([context.write])
    C2 --Mapper.map-->D2([context.write])
    D1 --> E1(内存缓存-环形缓冲区)
    D2 --> E2(内存缓存-环形缓冲区)
    E1 --按照KEY分区排序<br>写入磁盘--> F1(溢出文件1) 
    E1 --按照KEY分区排序<br>写入磁盘--> F2(溢出文件2) 
    E2 --按照KEY分区排序<br>写入磁盘--> F3(溢出文件3) 
    E2 --按照KEY分区排序<br>写入磁盘--> F4(溢出文件4)
    F1 --> H1([Shuffle流程])
    F2 --> H1([Shuffle流程])
    F3 --> H2([Shuffle流程])
    F4 --> H2([Shuffle流程])
    H1 -.-> F5(所有客户机的数据)
    H2 -.-> F5
    F5 --从客户机获取溢出文件<br>key.hashcode%2=0--> R1([ReduceTask1])
    F5 --从客户机获取溢出文件<br>key.hashcode%2=1--> R2([ReduceTask2])
    M -.->|所有maptask进程完成后<br>开启两个ReduceTask<br>告知数据所在位置| R2
    R1 --归并排序分组<br>Reducer.reduce--> G1([context.write])
    R2 --归并排序分组<br>Reducer.reduce--> G2([context.write])
    G1 --OutputFormat<br>TextOutputFormat--> P1(part-r-00000)
    G2 --OutputFormat<br>TextOutputFormat--> P2(part-r-00001)
{% endmermaid %}

---

关于Shuffle流程: [6.提交任务流程与Shuffle流程](./Hadoop-6.提交任务流程与Shuffle流程.md)

