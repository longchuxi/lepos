# LEPOS 官网

纯静态站点，无需构建、无需数据库。所有可变内容集中在一个文件里，**日常更新只改 `data/site.js`**。

## 目录

```
lepos-site/
├── index.html          # 页面骨架（一般不用改）
├── assets/
│   ├── style.css       # 样式，配色改顶部 :root 变量
│   └── app.js          # 渲染逻辑（一般不用改）
├── data/
│   └── site.js         # ★ 所有内容都在这里，只改这个文件
└── netlify.toml        # 部署配置（可选）
```

## 日常怎么更新

打开 `data/site.js`：

| 想做的事 | 改哪里 |
| --- | --- |
| 发新版本 | `download.version` / `filename` / `releasedAt` |
| 换下载链接 | `download.url`（页面所有下载入口自动同步） |
| 改风险提示小字 | `download.riskNote` |
| 改首屏文案 | `hero.badge` / `title` / `subtitle` / `buttonText` |
| 改关于卡片 | `about.cards` 数组（增删改都行） |
| 改常见问题 | `faq` 数组 |
| 改页脚免责声明 | `footer.disclaimer` |
| 填域名 | `brand.domain`（如 `lepos.app`，显示在导航栏 Logo 旁） |

改完保存，刷新页面即生效。本地直接双击 `index.html` 也能看（数据用 `site.js`，不走 fetch，没有跨域问题）。

## 部署上线

任选一种，把整个 `lepos-site` 文件夹传上去即可：

- **Netlify**：拖文件夹进 Netlify Drop → 绑定域名（仓库里已带 `netlify.toml`）
- **Cloudflare Pages / Vercel**：导入目录，构建命令留空，输出目录填 `/`
- **自己的服务器**：整个目录丢进 Nginx/Apache 站点根目录

## 域名

**正式域名：`lepos.dev`**（2026-09-15 查询 RDAP 确认可注册）

查询记录（同一天）：

| 域名 | 状态 |
| --- | --- |
| lepos.app | 已被他人注册 ❌ |
| lepos.xyz | 已被注册 ❌ |
| lepos.dev | **可注册 ✅ ← 选用** |
| lepos.cc / lepos.top / lepos.online / lepos.studio | 可注册 |
| getlepos.com / leposapp.com / lepos-soft.com / leposs.app | 可注册 |

注册（Google Domains / Cloudflare / Namesilo 等均可）后：

1. 在域名 DNS 里添加记录指向托管平台（Netlify/Vercel/CF Pages 会给 CNAME 或 A 记录）；
2. 在托管平台后台添加自定义域名 `lepos.dev`；
3. 平台会自动签发 HTTPS 证书（.dev 强制 HTTPS，必须开启）。

> 域名需自行注册，本站只负责页面内容。注册商不同，解析生效时间从几分钟到 24 小时不等。

## 已移除的模块

**更新日志区块**（2026-09-15 按要求移除）：`index.html` 的 `<section id="changelog">`、导航里的「更新日志」链接、`assets/app.js` 的渲染代码、`data/site.js` 的 `changelog` 数据都已删除；`assets/style.css` 里的 `.log` / `.log-item` 样式保留备用。

要恢复，三步：

1. `index.html` 导航里加回 `<a href="#changelog">更新日志</a>`；
2. 在「常见问题」区块前插入：

```html
<!-- 更新日志 -->
<section class="block wrap" id="changelog">
  <h2 class="block-title">更新日志</h2>
  <p class="block-desc">每次发版后在这里补一条记录，新内容放在数组最前面。</p>
  <div class="log" id="logList"></div>
</section>
```

3. `data/site.js` 加回数据、`assets/app.js` 加回渲染：

```js
changelog: [
  { version: "V1.0.37", date: "2026-09-15", tag: "当前版本", items: ["官网与下载通道上线。"] }
],
```

```js
$("logList").innerHTML = d.changelog.map(function (item, i) {
  return '<div class="log-item"><div class="log-head"><span class="log-ver">' + item.version + '</span>' +
    '<span class="log-date">' + item.date + '</span>' +
    (item.tag ? '<span class="log-tag">' + item.tag + '</span>' : (i === 0 ? '<span class="log-tag">当前版本</span>' : '')) +
    '</div><ul>' + item.items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>';
}).join('');
```

## 注意事项

- 下载链接里带时间戳参数（`t=`）时可能过期，失效后替换 `download.url` 即可。
- `.exe` 无签名容易被浏览器/杀软拦截，这是正常现象，可在页面中提示用户手动保留。
