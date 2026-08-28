# 视觉考古 · KiiiKiii Deck

融合母版演讲稿：**果酱农场极简 × 简约商店货架 × Ever2Late 旅行社**（视觉对齐 `fusion-preview.html`）。

## 打开

```bash
cd /Users/1z/Projects/kiiikiii-visual-archaeology
python3 -m http.server 8765
```

- 演讲稿：http://127.0.0.1:8765/
- 设计确认稿：http://127.0.0.1:8765/fusion-preview.html

若曾打开过旧版编辑器，点顶栏 **「恢复默认」** 以加载 fusion 新讲稿（存储键已换为 `kiiikiii-deck-v2-fusion`）。

## 舞台语言（与 fusion 一致）

- 白底细线导航 + Duty Free 胶囊
- 旅行天空条 / 全幅淡天空
- 果酱罐商品卡、Tour Guides 大卡
- 页脚印章 + 圆点页码
- 2000s 点缀：徽章、车牌、相机、便签、像素印

## 编辑 / 演讲

| 操作 | 作用 |
|------|------|
| 顶栏「编辑 / 演讲」 | 切换模式 |
| 右侧「添加元素」 | 大标题、果酱卡、Guides 卡、贴纸等 |
| 拖拽 / 右下角 | 移动与缩放 |
| 双击文字 | 改文案 |
| `←` `→` 空格 | 翻页 |
| `N` | 讲者备注条 |
| `F` | 全屏 |
| 备注小窗 | 投屏时另开提词 |

## 文件

- `index.html` — 壳与 fusion CSS
- `deck-data.js` — 默认 21 页讲稿
- `deck-app.js` — 编辑器逻辑
