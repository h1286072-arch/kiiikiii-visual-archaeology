# 视觉考古 · KiiiKiii Deck

融合母版演讲稿：**果酱农场极简 × 简约商店货架 × Ever2Late 旅行社**。

## 本地预览（临时）

```bash
cd /Users/1z/Projects/kiiikiii-visual-archaeology
python3 -m http.server 8765
```

打开 http://127.0.0.1:8765/ —— **仅本机可用**，关电脑或停服务就访问不了。

## 永久网址（推荐）

纯静态站（`index.html` + 资源），上传到托管即可 24/7 访问。

### 方式 A · Netlify Drop（最快，约 2 分钟）

1. 打开 https://app.netlify.com/drop
2. 把整个文件夹 `kiiikiii-visual-archaeology` **拖进浏览器**
3. 得到类似 `https://随机名.netlify.app` 的永久链接
4. 可在 Netlify 后台改子域名

已含 `netlify.toml`，无需额外配置。

### 方式 B · GitHub Pages

1. GitHub 新建仓库 `kiiikiii-visual-archaeology`
2. 推送：

```bash
git remote add origin git@github.com:你的用户名/kiiikiii-visual-archaeology.git
git push -u origin main
```

3. **Settings → Pages → Branch: main / (root)** → Save
4. 访问：`https://你的用户名.github.io/kiiikiii-visual-archaeology/`

### 方式 C · Cursor 在线备份（不是公开网站）

保存到 Cursor 私有仓库，方便备份协作，**不会**自动生成对外浏览链接。

## 使用说明

| 操作 | 作用 |
|------|------|
| 演讲 / 编辑 | 投屏 vs 改内容 |
| `←` `→` 空格 | 翻页 |
| `N` | 讲者备注 |
| 双击果酱卡/Guides/图片 | 换本地图 |
| 选中后 ⌘V / Ctrl+V | 粘贴换图 |

## 素材与版权

见 `sources.md`。对外公开部署前请确认版权/肖像权。
