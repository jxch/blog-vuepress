import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import fs from 'fs';

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
          text: "JVM",
          children: ["jvm/JVM-常量池", "jvm/JVM-内存模型"],
        }, {
          text: "Redis",
          children: ["redis/Redis-持久化"],
        },
      ]
    },
    navbar: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/categories/bianmabiji/1.html" },
      { text: "标签", link: "/tags/PowerShell/1.html" },
      {
        text: "文档",
        children: [
          { text: "架构师", link: "/docs/architect/architect" },
          { text: "操盘手", link: "/docs/trader/trader" },
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
      inputSelector: '#docsearch-input',
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

    // 输出到 .vuepress/public/search.json
    const outputPath = app.dir.source('./.vuepress/public/search.json');
    fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
  },
});
