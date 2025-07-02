---
title: 7.切片逻辑
date: 2025/07/02
---

默认切片的大小与 hdfs 的 block 的 size 相等
切片大小: `Math.max(minSize, Math.min(maxSize, blockSize))`
* `mapreduce.input.fileinputformat.split.minsize` 默认值 `1`
* `mapreduce.input.fileinputformat.split.maxsize` 默认值 `Long.MAX_VALUE`

切片规则: `剩余长度 / splitsize < 1.1`

---

流程:

{% mermaid %}
graph TD
    A(input.txt) --> F([FileInputFormat])
    F --> J([Jobsubmit])
    J -.->|剩余/splitsize<1.1| S1([切片1])
    J -.->|剩余/splitsize<1.1| S2([切片2])
    S1 --写入文件--> JS(job.split)
    S2 --写入文件--> JS(job.split)
    JS --MrAppMaster--> M1([MapTask1])
    JS --MrAppMaster--> M2([MapTask2])
{% endmermaid %}

