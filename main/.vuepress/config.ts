import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import fs from 'fs';
import path from 'path';

export default defineUserConfig({
  lang: 'zh-CN',
  title: "姜希成的个人博客",
  description: "Just playing around",
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  theme: recoTheme({
    logo: "/logo.png",
    author: "姜希成",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/jxch/blog-vuepress",
    docsBranch: "main",
    docsDir: "main",
    colorMode: 'dark',
    lastUpdatedText: "",
    // series 为原 sidebar
    series: {
      "/docs/architect/": [
        {
          text: "并发编程",
          children: ["concurrent/JAVA并发-设计模式"],
        }, {
          text: "JVM",
          children: ["jvm/JVM-常量池", "jvm/JVM-内存模型"],
        }, {
          text: "Redis",
          children: ["redis/Redis-持久化"],
        }, {
          text: "Zookeeper",
          children: ["zookeeper/Zookeeper-特性"],
        }, {
          text: "MongoDB",
          children: [
            "mongodb/MongoDB-1.基础操作",
            "mongodb/MongoDB-2.聚合操作",
            "mongodb/MongoDB-3.数据模型",
            "mongodb/MongoDB-4.索引",
            "mongodb/MongoDB-5.复制集",
            "mongodb/MongoDB-6.分片集",
            "mongodb/MongoDB-7.高级集群架构",
            "mongodb/MongoDB-8.事务",
            "mongodb/MongoDB-9.调优",
            "mongodb/MongoDB-10.ChangeStream",
            "mongodb/MongoDB-11.开发规范",
            "mongodb/MongoDB-12.SpringBoot集成",
          ],
        }, {
          text: "RocketMQ",
          children: [
            "rocketmq/RocketMQ-1.基础",
            "rocketmq/RocketMQ-2.消息类型&ACL",
            "rocketmq/RocketMQ-3.代码示例",
            "rocketmq/RocketMQ-4.核心原理",
            "rocketmq/RocketMQ-5.整体架构",
            "rocketmq/RocketMQ-6.常见问题",
          ],
        }, {
          text: "Kafka",
          children: [
            "kafka/Kafka-1.基础",
            "kafka/Kafka-2.代码模板",
            "kafka/Kafka-3.设计原理",
            "kafka/Kafka-4.优化",
          ],
        }, {
          text: "Hadoop",
          children: [
            "hadoop/Hadoop-1.生态",
            "hadoop/Hadoop-2.节点",
            "hadoop/Hadoop-3.HDFS读写文件流程",
            "hadoop/Hadoop-4.元数据管理-edits+fsimage",
            "hadoop/Hadoop-5.mapreduce工作机制",
            "hadoop/Hadoop-6.提交任务流程与Shuffle流程",
            "hadoop/Hadoop-7-切片逻辑",
            "hadoop/Hadoop-8-YARN流程",
            "hadoop/Hadoop-9-mapreduce-YARN流程",
            "hadoop/Hadoop-10-YARN资源调度器",
            "hadoop/Hadoop-11-优化",
            "hadoop/Hadoop-11.1.数据压缩",
            "hadoop/Hadoop-12-Hive-特点",
            "hadoop/Hadoop-12.1.Hive窗口函数",
            "hadoop/Hadoop-12.2.Hive常用命令dd与dmll",
            "hadoop/Hadoop-12.3.Hive分桶",
            "hadoop/Hadoop-12.4.HiveDemo大小写转换UDF自定义函数",
            "hadoop/Hadoop-12.5.1.Hive不支援10验证类型",
            "hadoop/Hadoop-12.5.2.HiveWstxParsingException",
            "hadoop/Hadoop-13-HBase-特点",
            "hadoop/Hadoop-13.1.HBase常用命令",
            "hadoop/Hadoop-13.2.HBase优化",
            "hadoop/Hadoop-13.3.HBase设计优化rowkey",
            "hadoop/Hadoop-13.4.HBase预分区",
            "hadoop/Hadoop-13.5.1.HBaseDemoJavaAPI常用操作",
            "hadoop/Hadoop-13.6.1.HBaseServerNotRunningYetException",
            "hadoop/Hadoop-13.6.2.HBaseNoHbaseMasterFound",
            "hadoop/Hadoop-14-Sqoop-特点",
            "hadoop/Hadoop-14.1.Sqoop导入数据到HBase",
            "hadoop/Hadoop-14.2.SqoopHive与Mysql互导",
            "hadoop/Hadoop-14.3.SqoopMysql导入HDFS",
            "hadoop/Hadoop-15.1.Demo单词统计",
            "hadoop/Hadoop-15.2.Demo单词分组排序统计",
            "hadoop/Hadoop-15.3.Demo倒排索引-文章单词统计",
            "hadoop/Hadoop-15.4.Demo共同好友",
            "hadoop/Hadoop-15.5.Demo自定义InputFileFormat",
            "hadoop/Hadoop-15.6.Demo自定义OutputFileFormat",
            "hadoop/Hadoop-15.7.Demo文件操作FileSystem",
            "hadoop/Hadoop-16.1.启动时没有启动datanode",
            "hadoop/Hadoop-16.2.ClassNotFoundException",
            "hadoop/Hadoop-17.1.常用命令fs",
          ],
        },
      ],
      "/docs/trader/": [
        {
          text: "期权",
          children: ["options/期权交易策略", "options/期权交易策略收益图表"],
        },
      ],
      "/docs/it/": [
        {
          text: "计算机图形学",
          children: ["计算机图形学/边缘填充算法"],
        },
      ],
      "/docs/diary/": [
        {
          text: "2025",
          children: ["2025/2025-03"],
        },
      ],
      "/docs/trading_journal/": [
        {
          text: "实盘日记",
          children: ["diary/2025"],
        },
      ],
    },
    navbar: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/categories/bianmabiji/1.html" },
      { text: "标签", link: "/tags/Java/1.html" },
      {
        text: "文档",
        children: [
          { text: "架构师", link: "/docs/architect/architect" },
          { text: "操盘手", link: "/docs/trader/trader" },
          { text: "交易笔记", link: "/docs/trading_journal/trading_journal" },
          { text: "读书笔记", link: "/docs/book/book" },
          { text: "计算机", link: "/docs/it/it" },
          { text: "诗集", link: "/docs/poetry/poetry" },
          { text: "日记", link: "/docs/diary/diary" },
        ],
      },
      { text: "博客", link: "/posts" },
      { text: "归档", link: "/timeline" },
      { text: "链接", link: "/friendship-link" },
      { text: "打赏", link: "/docs/others/donate" },
    ],
    friendshipLinks: [
      {
        title: 'Capitals',
        logo: 'https://avatars.githubusercontent.com/u/54167020?s=200&v=4',
        link: 'https://jiangxicheng.online/capitals/'
      }, {
        title: '博客园',
        logo: 'https://avatars.githubusercontent.com/u/54167020?s=200&v=4',
        link: 'https://www.cnblogs.com/xch-jiang'
      }, {
        title: 'CSDN',
        logo: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
        link: 'https://blog.csdn.net/jxch____'
      }, {
        title: 'Github',
        logo: 'https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg',
        link: 'https://github.com/jxch'
      }, {
        title: 'Github-Capitals',
        logo: 'https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg',
        link: 'https://github.com/jxch-capital'
      }, {
        title: 'QQ群-架构师-961215331',
        logo: 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png',
        link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=_8OK2fsmwKYXliSoqszUCHZ_RnMmcZsm&authKey=KEju9D76HcqTr3vuFLbdkamaqpGVYcvfo%2F%2BlLd04GucOwH0XnMZjeg0a0WUJ7OwQ&noverify=0&group_code=961215331'
      }, {
        title: 'QQ群-操盘手-966469984',
        logo: 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png',
        link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=1CRaLYPuesGlWXEPQmqwmi2UsTgXebSz&authKey=EReo0mUHRG9%2FGdYsRLClzizP%2BcRIzQCVIIHjfMLUmX%2FpoV4RIoAnQBktkimpKqdD&noverify=0&group_code=966469984'
      },
    ],
    bulletin: {
      body: [
        {
          type: "text",
          content: `如有错误的地方，欢迎指正！<br/>如有技术问题，欢迎交流！`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "QQ 群",
        },
        {
          type: "text",
          content: `
          <ul>
            <li><a target="_blank" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=_8OK2fsmwKYXliSoqszUCHZ_RnMmcZsm&authKey=KEju9D76HcqTr3vuFLbdkamaqpGVYcvfo%2F%2BlLd04GucOwH0XnMZjeg0a0WUJ7OwQ&noverify=0&group_code=961215331">架构师：961215331</a></li>
            <li><a target="_blank" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=1CRaLYPuesGlWXEPQmqwmi2UsTgXebSz&authKey=EReo0mUHRG9%2FGdYsRLClzizP%2BcRIzQCVIIHjfMLUmX%2FpoV4RIoAnQBktkimpKqdD&noverify=0&group_code=966469984">操盘手：966469984</a></li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "GitHub",
        },
        {
          type: "text",
          content: `
          <ul>
            <li><a target="_blank" href="https://github.com/jxch">GitHub 主页<a/></li>
            <li><a target="_blank" href="https://github.com/jxch-study">Study 项目<a/></li>
            <li><a target="_blank" href="https://github.com/jxch-capital">Capitals 项目<a/></li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "buttongroup",
          children: [
            {
              text: "打赏",
              link: "/docs/others/donate.html",
            },
          ],
        },
      ],
    },
    algolia: {
      appId: 'MNIVPZZIJ2',
      apiKey: 'b0d8bdcebbf20469cd0beadde0ab831a',
      indexName: 'jxch.github.io',
      // inputSelector: '#docsearch-input',
      debug: false,
    },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
  onInitialized(app) {
    const pages = app.pages.filter((page) => page.title && page.title.trim() !== '').map((page) => {
      // 动态生成层级结构（hierarchy）
      const hierarchy = {
        lvl0: page.title || '' // 一级标题，使用页面标题
      };

      // 根据 headers 动态生成 lvl1 到 lvlN
      if (page.headers && page.headers.length > 0) {
        page.headers.forEach((header, index) => {
          hierarchy[`lvl${index + 1}`] = header.title || ''; // 动态生成 lvl1, lvl2, ..., lvlN
        });
      }

      // 返回符合 Algolia 要求的格式
      return {
        title: page.title, // 页面标题
        path: page.path, // 页面路径
        url: page.path, // 页面 URL
        content: page.content, // 页面内容
        lang: page.lang || 'zh-CN', // 语言，默认为 'zh-CN'
        hierarchy: hierarchy, // 文档层级结构
        frontmatter: page.frontmatter, // 页面元信息
        type: "content"
      };
    });

    function splitByByte(str: string, byteLimit: number): string[] {
      const result: string[] = [];
      let current = '';
      let currentBytes = 0;
      for (const char of str) {
        const charBytes = Buffer.byteLength(char, 'utf8');
        if (currentBytes + charBytes > byteLimit) {
          result.push(current);
          current = char;
          currentBytes = charBytes;
        } else {
          current += char;
          currentBytes += charBytes;
        }
      }
      if (current) result.push(current);
      return result;
    }

    interface PageData {
      title: string;
      path: string;
      url: string;
      content: string;
      lang: string;
      hierarchy: Record<string, string>;
      frontmatter: any;
      type: string;
      contentPart?: number;
      contentParts?: number;
    }

    const finalPages: PageData[] = [];
    pages.forEach((page) => {
      const content = page.content || "";
      const contentBytes = Buffer.byteLength(content, 'utf8');
      if (contentBytes > 10 * 1024) {
        const parts = splitByByte(content, 6 * 1024);
        parts.forEach((part, idx) => {
          finalPages.push({
            ...page,
            content: part,
            contentPart: idx + 1,
            contentParts: parts.length
          });
        });
      } else {
        finalPages.push(page);
      }
    });

    // 输出到 .vuepress/public/search.json 
    const outputPath = app.dir.source('./.vuepress/public/search.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalPages, null, 2), 'utf8');

    // // 输出到 .vuepress/public/search.json
    // const outputPath = app.dir.source('./.vuepress/public/search.json');
    // fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));

    // // 创建目录
    // const outputDir = app.dir.source('./.vuepress/public/sreach');
    // if (!fs.existsSync(outputDir)) {
    //   fs.mkdirSync(outputDir, { recursive: true });
    // }

    // let fileIndex = 1;
    // let currentBatch: string[] = [];
    // let currentSize = 2; // JSON 数组开头和结尾 []
    // const MAX_FILE_SIZE = 10 * 1024; // 10KB

    // for (const page of pages) {
    //   const str = (currentBatch.length ? ',' : '') + JSON.stringify(page, null, 2);
    //   const strSize = Buffer.byteLength(str, 'utf8');

    //   // 如果加上这个 page 会超出 10KB，则先写入当前 batch
    //   if (currentSize + strSize > MAX_FILE_SIZE) {
    //     // 写入文件
    //     const filePath = path.join(outputDir, `search_${fileIndex}.json`);
    //     fs.writeFileSync(filePath, `[${currentBatch.join(',')}]`);
    //     fileIndex++;
    //     currentBatch = [];
    //     currentSize = 2; // 重置 size（[]）
    //   }

    //   currentBatch.push(JSON.stringify(page, null, 2));
    //   currentSize += strSize;
    // }

    // // 写入最后一批
    // if (currentBatch.length) {
    //   const filePath = path.join(outputDir, `search_${fileIndex}.json`);
    //   fs.writeFileSync(filePath, `[${currentBatch.join(',')}]`);
    // }
  },
});
