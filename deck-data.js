/* Default deck — fusion layouts (jam × shop × travel) */
window.DEFAULT_DECK = {
  version: 2,
  slides: [
    {
      id: "s01",
      title: "开场 · 登机口",
      navSmall: "Travel · Archaeology",
      navOn: "Home",
      duty: "(Girls) Duty Free",
      seals: "✅ Visual Archaeology|🏅 Design Share 2026|✈ Ever2Late",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "各位设计中心的同事下午好。今天聊女团 KiiiKiii 的视觉：为什么总能把过时/土/被遗忘的审美重新变得时髦。约 30 分钟。主题：视觉考古——KiiiKiii 如何复活被遗忘的审美。",
      imgGuide: "封面融合模板：天空 + Guides 大卡 + 果酱商品卡 + 2000s 点缀。",
      elements: [
        { id: "a1", type: "tag", x: 7, y: 18, w: 14, h: 4, text: "Design Share" },
        { id: "a2", type: "headline", x: 7, y: 24, w: 38, h: 22, text: "视觉考古\n登机口", size: 52, font: "Instrument Serif, serif", color: "#161616" },
        { id: "a3", type: "sub", x: 7, y: 50, w: 32, h: 12, text: "KiiiKiii 如何复活被遗忘的审美。\n不聊舞台唱功，聊视觉如何重新变得时髦。", size: 13 },
        { id: "a4", type: "guide", x: 46, y: 18, w: 38, h: 42, src: "assets/ref/ever2late.png", title: "Ever2Late! ✿", caption: "GUIDE BY LEESOL · KiiiKiii Travel", badge: "04:00 - 08:00" },
        { id: "a5", type: "jar", x: 7, y: 64, w: 15, h: 26, src: "assets/xhs/jam_06.webp", title: "Jam · Groundwork", price: "Unlock soon", locked: true },
        { id: "a6", type: "jar", x: 24, y: 66, w: 15, h: 24, src: "assets/xhs/jam_02.webp", title: "Jam · Debut", price: "12.00" },
        { id: "a7", type: "pin", x: 88, y: 20, w: 7, h: 12, text: "🐬" },
        { id: "a8", type: "plate", x: 86, y: 40, w: 11, h: 10, text: "WHYKIIIKIII\nSTATE BEACH" },
        { id: "a9", type: "cam", x: 78, y: 66, w: 9, h: 10, text: "📷" },
        { id: "a10", type: "note-sticker", x: 40, y: 68, w: 9, h: 12, text: "boarding\npass inside →" }
      ]
    },
    {
      id: "s02",
      title: "今日地图",
      navSmall: "Shop · Map",
      navOn: "Shop",
      duty: "Bag · Agenda",
      seals: "🗺 Today's Route",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "快速过结构：坐标 → 五维横切 → 拆解 → 幕后 → 回响 → 互动。",
      imgGuide: "商店货架页：章节标 + 果酱卡当议程 SKU。",
      elements: [
        { id: "b1", type: "section", x: 7, y: 14, w: 40, h: 8, text: "Today <span class=\"accent\">Map</span>", size: 28 },
        { id: "b2", type: "sub", x: 7, y: 24, w: 36, h: 8, text: "不按时间线，按设计主题横切。" },
        { id: "b3", type: "jar", x: 7, y: 36, w: 15, h: 28, src: "assets/xhs/jam_01.webp", title: "01 坐标", price: "考古 ≠ 复古" },
        { id: "b4", type: "jar", x: 24, y: 36, w: 15, h: 28, src: "assets/xhs/jam_03.webp", title: "02 五维", price: "Web→Merch" },
        { id: "b5", type: "jar", x: 41, y: 36, w: 15, h: 28, src: "assets/xhs/style_05.webp", title: "03 拆解", price: "主菜" },
        { id: "b6", type: "jar", x: 58, y: 36, w: 15, h: 28, src: "assets/xhs/team_01.webp", title: "04 幕后", price: "铁三角" },
        { id: "b7", type: "jar", x: 75, y: 36, w: 15, h: 28, src: "assets/ref/ever2late.png", title: "05–06", price: "回响 · 互动" },
        { id: "b8", type: "pixel", x: 78, y: 78, w: 16, h: 4, text: "No Skip" }
      ]
    },
    {
      id: "s03",
      title: "视觉考古坐标",
      navSmall: "Guides · Frame",
      navOn: "Guides",
      duty: "(Girls) Duty Free",
      seals: "📁 Frame|✈ Dig & Reinvent",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "复古＝赶上旧流行。视觉考古＝主动挖切面、当代重组、甚至定义下一波。KiiiKiii 做后者。",
      imgGuide: "Tour Guides 气氛：左文案，右对比 Guides/果酱卡。",
      elements: [
        { id: "c1", type: "section", x: 7, y: 16, w: 50, h: 8, text: "Not Retro · <span class=\"accent\">Archaeology</span>", size: 26 },
        { id: "c2", type: "jar", x: 7, y: 34, w: 28, h: 36, src: "assets/xhs/style_02.webp", title: "复古", price: "旧的又流行了 · 赶上这波" },
        { id: "c3", type: "guide", x: 40, y: 28, w: 52, h: 42, src: "assets/xhs/concept_cover.webp", title: "视觉考古", caption: "主动挖切面 · 当代重组 · 定义下一波", badge: "DIG" },
        { id: "c4", type: "tag", x: 7, y: 78, w: 20, h: 4, text: "考古 ≠ 复刻" }
      ]
    },
    {
      id: "s04",
      title: "四次回归",
      navSmall: "Travel · Releases",
      navOn: "Guides",
      duty: "4 Destinations",
      seals: "UNCUT GEM|404|Delulu|WhyKiiiKiii",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "四次：UNCUT GEM → 404 → Delulu → WhyKiiiKiii。后面按主题横切。",
      imgGuide: "四张 Guides / 果酱卡横排。",
      elements: [
        { id: "d1", type: "section", x: 7, y: 14, w: 50, h: 8, text: "Four <span class=\"accent\">Cuts</span>", size: 28 },
        { id: "d2", type: "guide", x: 6, y: 28, w: 21, h: 42, src: "assets/xhs/jam_02.webp", title: "UNCUT GEM", caption: "果酱农场", badge: "01" },
        { id: "d3", type: "guide", x: 29, y: 28, w: 21, h: 42, src: "assets/xhs/style_01.webp", title: "404", caption: "名媛解构", badge: "02" },
        { id: "d4", type: "guide", x: 52, y: 28, w: 21, h: 42, src: "assets/xhs/style_03.webp", title: "Delulu", caption: "轻幻想", badge: "03" },
        { id: "d5", type: "guide", x: 75, y: 28, w: 21, h: 42, src: "assets/ref/ever2late.png", title: "WhyKiiiKiii", caption: "Ever2Late", badge: "04" }
      ]
    },
    {
      id: "s05",
      title: "五维框架",
      navSmall: "Shop · Framework",
      navOn: "Shop",
      duty: "5 Aisles",
      seals: "无 VI · 五维横切",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "五维：网站、造型、社媒、影像、联名周边。（已去掉 VI）",
      imgGuide: "货架五卡。",
      elements: [
        { id: "e1", type: "section", x: 7, y: 14, w: 50, h: 8, text: "Five <span class=\"accent\">Aisles</span>", size: 28 },
        { id: "e2", type: "jar", x: 6, y: 36, w: 16, h: 34, src: "assets/xhs/jam_04.webp", title: "网站", price: "概念即交互" },
        { id: "e3", type: "jar", x: 24, y: 36, w: 16, h: 34, src: "assets/xhs/style_04.webp", title: "造型", price: "日常×符号" },
        { id: "e4", type: "jar", x: 42, y: 36, w: 16, h: 34, src: "assets/xhs/jam_08.webp", title: "社媒", price: "反套路预热" },
        { id: "e5", type: "jar", x: 60, y: 36, w: 16, h: 34, src: "assets/xhs/concept_cover.webp", title: "影像", price: "气氛说明书" },
        { id: "e6", type: "jar", x: 78, y: 36, w: 16, h: 34, src: "assets/xhs/style_06.webp", title: "周边", price: "可玩实体" }
      ]
    },
    {
      id: "s06",
      title: "3.1 网站共性",
      navSmall: "Jams · Web",
      navOn: "Jams",
      duty: "Concept = UX",
      seals: "独立主题站|游戏化|概念实体",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "三共性：独立主题站；游戏化；官网本身就是概念实体。概念即交互，交互即体验。",
      imgGuide: "三张果酱卡 + 一句收束。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 14, w: 55, h: 8, text: "Web · <span class=\"accent\">Concept as UX</span>", size: 26 },
        { id: "f2", type: "jar", x: 7, y: 32, w: 26, h: 40, src: "assets/xhs/jam_01.webp", title: "① 独立主题站", price: "架构视觉交互为概念定制" },
        { id: "f3", type: "jar", x: 37, y: 32, w: 26, h: 40, src: "assets/xhs/jam_05.webp", title: "② 游戏化", price: "解谜 · 解锁 · 探索" },
        { id: "f4", type: "jar", x: 67, y: 32, w: 26, h: 40, src: "assets/ref/ever2late.png", title: "③ 概念实体", price: "官网＝世界观" }
      ]
    },
    {
      id: "s07",
      title: "3.1 四站快览",
      navSmall: "Travel · Sites",
      navOn: "Guides",
      duty: "4 Sites",
      seals: "Jam Farm|404|Delulu|Ever2Late",
      sky: "1",
      bgColor: "#fffaf3",
      bgImage: "",
      notes: "果酱解锁/地图；404故障；Delulu场景饼干；登机牌导览。可现场点官网。",
      imgGuide: "四 Guides。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 12, w: 40, h: 7, text: "Four <span class=\"accent\">Sites</span>", size: 26 },
        { id: "g2", type: "guide", x: 5, y: 24, w: 22, h: 48, src: "assets/xhs/jam_03.webp", title: "果酱农场", caption: "解锁 / 地图 / 换装", badge: "GEM" },
        { id: "g3", type: "guide", x: 28, y: 24, w: 22, h: 48, src: "assets/xhs/jam_04.webp", title: "404", caption: "故障美学 / 隐藏入口", badge: "ERR" },
        { id: "g4", type: "guide", x: 51, y: 24, w: 22, h: 48, src: "assets/xhs/jam_05.webp", title: "Delulu", caption: "场景 / 幸运饼干", badge: "DLU" },
        { id: "g5", type: "guide", x: 74, y: 24, w: 22, h: 48, src: "assets/ref/ever2late.png", title: "Ever2Late", caption: "登机牌 / 导览", badge: "E2L" }
      ]
    },
    {
      id: "s08",
      title: "3.2 造型公式",
      navSmall: "Shop · Style",
      navOn: "Shop",
      duty: "Daily × Symbol",
      seals: "haanasah|日常感×符号化",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "造型师 haanasah。公式：日常感 × 符号化 + 刻意的不和谐。古早味≈千禧女星街拍×CCD。",
      imgGuide: "三货架卡：日常 / 符号 / 不和谐。",
      elements: [
        { id: "h1", type: "section", x: 7, y: 14, w: 60, h: 8, text: "Style · <span class=\"accent\">Daily × Symbol</span>", size: 26 },
        { id: "h2", type: "sub", x: 7, y: 24, w: 50, h: 5, text: "造型师 haanasah · 把复古主题拆成可穿的零件" },
        { id: "h3", type: "jar", x: 7, y: 34, w: 26, h: 40, src: "assets/xhs/style_02.webp", title: "日常感", price: "针织牛仔球鞋 · 街拍原图" },
        { id: "h4", type: "jar", x: 37, y: 34, w: 26, h: 40, src: "assets/xhs/style_04.webp", title: "符号化", price: "翻盖壳发夹 · 丝绒货车帽" },
        { id: "h5", type: "jar", x: 67, y: 34, w: 26, h: 40, src: "assets/xhs/style_05.webp", title: "不和谐", price: "蕾丝×球鞋 · 公主×健身房" },
        { id: "h6", type: "plate", x: 78, y: 14, w: 14, h: 10, text: "古早劲儿\nCCD READY" }
      ]
    },
    {
      id: "s09",
      title: "3.2 穿搭①②",
      navSmall: "Guides · Looks",
      navOn: "Guides",
      duty: "Outfit 01–02",
      seals: "出道系|404 名媛解构",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "①邻家底盘+不对劲道具。②用名媛符号玩游戏，不是复刻。",
      imgGuide: "两大 Guides + 文案卡。",
      elements: [
        { id: "i1", type: "section", x: 7, y: 12, w: 55, h: 7, text: "Looks · <span class=\"accent\">Debut / 404</span>", size: 24 },
        { id: "i2", type: "guide", x: 6, y: 24, w: 40, h: 50, src: "assets/xhs/style_01.webp", title: "① 出道系", caption: "邻家底盘 + 不对劲道具", badge: "FOREST" },
        { id: "i3", type: "guide", x: 50, y: 24, w: 40, h: 50, src: "assets/xhs/style_03.webp", title: "② 404", caption: "Juicy / Von Dutch · 玩游戏非复刻", badge: "IT GIRL" }
      ]
    },
    {
      id: "s10",
      title: "3.2 穿搭③④",
      navSmall: "Travel · Looks",
      navOn: "Guides",
      duty: "Outfit 03–04",
      seals: "Delulu 错位|Ever2Late 氧气感",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "③符号在衣服，日常在场景。④氧气感×旧互联网。收束：日常可复刻+符号锚点+错位。记忆点能被模仿吗？",
      imgGuide: "三图 + 底部收束便签。",
      elements: [
        { id: "j1", type: "section", x: 7, y: 12, w: 60, h: 7, text: "Delulu · <span class=\"accent\">Ever2Late</span>", size: 24 },
        { id: "j2", type: "guide", x: 6, y: 22, w: 28, h: 42, src: "assets/xhs/style_06.webp", title: "③ 错位公主", caption: "符号在衣服 · 日常在场景", badge: "DELULU" },
        { id: "j3", type: "guide", x: 36, y: 22, w: 28, h: 42, src: "assets/xhs/style_07.webp", title: "④ 氧气感", caption: "吊带 · 果冻包 · 蝴蝶瓢虫", badge: "E2L" },
        { id: "j4", type: "guide", x: 66, y: 22, w: 28, h: 42, src: "assets/xhs/style_08.webp", title: "风格是外套", caption: "不是身份证", badge: "SWAP" },
        { id: "j5", type: "note-sticker", x: 7, y: 70, w: 40, h: 14, text: "收束：日常可复刻 → 1–3 符号锚点 → 错位记忆点\n记忆点零件是什么？普通人能模仿吗？" }
      ]
    },
    {
      id: "s11",
      title: "3.3 社媒",
      navSmall: "Shop · Social",
      navOn: "Shop",
      duty: "UGC Aisle",
      seals: "反套路|互动|可模仿",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "反套路预热；登机牌/幸运饼干 UGC；风格可模仿。预热做成内容，粉丝变成传播者。",
      imgGuide: "三果酱卡。",
      elements: [
        { id: "k1", type: "section", x: 7, y: 14, w: 50, h: 8, text: "Social · <span class=\"accent\">Anti-formula</span>", size: 26 },
        { id: "k2", type: "jar", x: 7, y: 34, w: 26, h: 38, src: "assets/xhs/jam_07.webp", title: "反套路", price: "空降 · 故障 · 博客风" },
        { id: "k3", type: "jar", x: 37, y: 34, w: 26, h: 38, src: "assets/xhs/jam_08.webp", title: "互动 UGC", price: "登机牌 · 幸运饼干" },
        { id: "k4", type: "jar", x: 67, y: 34, w: 26, h: 38, src: "assets/xhs/style_05.webp", title: "可模仿", price: "手机日常也能七八分" },
        { id: "k5", type: "pixel", x: 7, y: 80, w: 30, h: 4, text: "Fans = Media" }
      ]
    },
    {
      id: "s12",
      title: "3.4 影像风格",
      navSmall: "Guides · Image",
      navOn: "Guides",
      duty: "Shot Grammar",
      seals: "hiozoik|byheyone|生命力",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "影像视觉分析。三点：生活化构图；CCD质感；动态生命力。审美和技术比型号重要。",
      imgGuide: "三卡 + 牧场点缀。",
      elements: [
        { id: "l1", type: "section", x: 7, y: 14, w: 55, h: 8, text: "Image · <span class=\"accent\">Visual Analysis</span>", size: 24 },
        { id: "l2", type: "sub", x: 7, y: 24, w: 55, h: 5, text: "风格 · 传达 · 跟风　　hiozoik / byheyone" },
        { id: "l3", type: "jar", x: 7, y: 34, w: 26, h: 38, src: "assets/xhs/style_01.webp", title: "生活化构图", price: "歪斜留白虚焦 · 随手感是设计" },
        { id: "l4", type: "jar", x: 37, y: 34, w: 26, h: 38, src: "assets/xhs/concept_cover.webp", title: "CCD 质感", price: "颗粒过曝偏色 · 修向直出" },
        { id: "l5", type: "jar", x: 67, y: 34, w: 26, h: 38, src: "assets/xhs/style_07.webp", title: "生命力动态", price: "奔跑打闹 · 旅拍模板" },
        { id: "l6", type: "cam", x: 88, y: 14, w: 8, h: 10, text: "📷" }
      ]
    },
    {
      id: "s13",
      title: "3.4 宣传照传达",
      navSmall: "Travel · Message",
      navOn: "Guides",
      duty: "Mood Spec",
      seals: "生命力|视觉系统|氧气感",
      sky: "1",
      bgColor: "#f7fbff",
      bgImage: "",
      notes: "①自由野生亲近。②概念照＝拼贴界面感系统。③Ever2Late氧气感。卖的是想住进那张图里。",
      imgGuide: "大 Guides + 信息卡。",
      elements: [
        { id: "m1", type: "section", x: 7, y: 12, w: 50, h: 7, text: "What Photos <span class=\"accent\">Say</span>", size: 24 },
        { id: "m2", type: "guide", x: 6, y: 24, w: 42, h: 50, src: "assets/xhs/concept_cover.webp", title: "想住进那张图里", caption: "气氛说明书 · 不是精修册", badge: "MOOD" },
        { id: "m3", type: "card", x: 52, y: 28, w: 40, h: 42, text: "① 生命力活人感\n　自由 / 野生 / 亲近\n\n② 概念照＝视觉系统\n　拼贴 · 大号数字 · 界面感\n\n③ Ever2Late\n　氧气感 × 旧互联网\n\n审美积累＝可阅读的气氛", size: 14, font: "Inter, sans-serif", color: "#161616" }
      ]
    },
    {
      id: "s14",
      title: "3.4 跟风影响",
      navSmall: "Shop · Echo",
      navOn: "Shop",
      duty: "Copycat SKUs",
      seals: "色调|穿搭|设备|氛围",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "跟风：色调、穿搭、设备（C143点到）、氛围。可模仿>只可仰望；降清晰度升情绪。",
      imgGuide: "四货架卡 + 像素印。",
      elements: [
        { id: "n1", type: "section", x: 7, y: 14, w: 50, h: 8, text: "Copycat <span class=\"accent\">Wave</span>", size: 26 },
        { id: "n2", type: "jar", x: 6, y: 32, w: 20, h: 36, src: "assets/xhs/style_02.webp", title: "色调", price: "暖黄软糊 · CCD滤镜" },
        { id: "n3", type: "jar", x: 28, y: 32, w: 20, h: 36, src: "assets/xhs/style_04.webp", title: "穿搭", price: "日常+符号 · 旅拍" },
        { id: "n4", type: "jar", x: 50, y: 32, w: 20, h: 36, src: "assets/xhs/style_05.webp", title: "设备", price: "C143 · CCD回潮" },
        { id: "n5", type: "jar", x: 72, y: 32, w: 20, h: 36, src: "assets/xhs/style_01.webp", title: "氛围", price: "牧场跑跳 · 错位场景" },
        { id: "n6", type: "note-sticker", x: 7, y: 74, w: 50, h: 10, text: "可模仿 > 只可仰望 · 降清晰度升情绪 · 宣传照＝气氛说明书" }
      ]
    },
    {
      id: "s15",
      title: "3.5 联名周边",
      navSmall: "Shop · Merch",
      navOn: "Shop",
      duty: "Playable SKUs",
      seals: "New Era|PANDORA|Snapshot Cam",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "可玩可互动可参与：New Era、PANDORA、专辑玩具相机等。",
      imgGuide: "货架三卡。",
      elements: [
        { id: "o1", type: "section", x: 7, y: 14, w: 55, h: 8, text: "Merch · <span class=\"accent\">Playable</span>", size: 26 },
        { id: "o2", type: "jar", x: 7, y: 34, w: 26, h: 38, src: "assets/xhs/jam_01.webp", title: "New Era × 404", price: "文字游戏 · 定制帽" },
        { id: "o3", type: "jar", x: 37, y: 34, w: 26, h: 38, src: "assets/xhs/style_06.webp", title: "PANDORA", price: "钥匙打开新宇宙" },
        { id: "o4", type: "jar", x: 67, y: 34, w: 26, h: 38, src: "assets/xhs/style_05.webp", title: "专辑版本", price: "拼图 · 水晶球 · 玩具相机" },
        { id: "o5", type: "cam", x: 88, y: 16, w: 8, h: 10, text: "🎞" }
      ]
    },
    {
      id: "s16",
      title: "幕后铁三角",
      navSmall: "Guides · Crew",
      navOn: "Guides",
      duty: "Crew Pass",
      seals: "byheyone|hiozoik|haanasah",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "视觉 byheyone / 摄影 hiozoik / 造型 haanasah。固定班底→审美同频。",
      imgGuide: "团队图 + 三卡。",
      elements: [
        { id: "p1", type: "section", x: 7, y: 14, w: 45, h: 8, text: "Crew · <span class=\"accent\">Triangle</span>", size: 26 },
        { id: "p2", type: "guide", x: 55, y: 16, w: 38, h: 36, src: "assets/xhs/team_01.webp", title: "Visual Team", caption: "审美同频的固定班底", badge: "CREW" },
        { id: "p3", type: "jar", x: 7, y: 34, w: 22, h: 32, src: "assets/xhs/team_02.webp", title: "byheyone", price: "视觉指导" },
        { id: "p4", type: "jar", x: 31, y: 34, w: 22, h: 32, src: "assets/xhs/team_03.webp", title: "hiozoik", price: "摄影" },
        { id: "p5", type: "jar", x: 7, y: 70, w: 46, h: 14, src: "assets/xhs/team_04.webp", title: "haanasah · 造型", price: "每次不同，但都是她们" }
      ]
    },
    {
      id: "s17",
      title: "三底层逻辑",
      navSmall: "Jams · Logic",
      navOn: "Jams",
      duty: "3 Logics",
      seals: "考古|游戏|拼贴",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "挖被遗忘审美；风格是游戏；拼贴式表达。",
      imgGuide: "三果酱卡。",
      elements: [
        { id: "q1", type: "section", x: 7, y: 14, w: 50, h: 8, text: "Three <span class=\"accent\">Logics</span>", size: 28 },
        { id: "q2", type: "jar", x: 7, y: 34, w: 26, h: 40, src: "assets/xhs/jam_02.webp", title: "① 挖掘被遗忘", price: "考古 ≠ 复古" },
        { id: "q3", type: "jar", x: 37, y: 34, w: 26, h: 40, src: "assets/xhs/jam_06.webp", title: "② 风格是游戏", price: "可切换 · 不贴死标签" },
        { id: "q4", type: "jar", x: 67, y: 34, w: 26, h: 40, src: "assets/xhs/jam_03.webp", title: "③ 拼贴表达", price: "多风格并置 = Gen Z" }
      ]
    },
    {
      id: "s18",
      title: "设计回响",
      navSmall: "Shop · Echo",
      navOn: "Shop",
      duty: "CCD Aisle",
      seals: "C143|符号|穿搭回潮",
      sky: "0",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "C143 CCD 暖黄软糊；带火的是成像审美。小面积高记忆点、可复刻才易传播。",
      imgGuide: "两大货架卡 + 相机贴纸。",
      elements: [
        { id: "r1", type: "section", x: 7, y: 14, w: 55, h: 8, text: "Echo · <span class=\"accent\">What Caught On</span>", size: 24 },
        { id: "r2", type: "jar", x: 7, y: 30, w: 40, h: 48, src: "assets/xhs/style_02.webp", title: "机型回潮 · C143", price: "CCD 暖黄软糊 · 成像审美" },
        { id: "r3", type: "jar", x: 52, y: 30, w: 40, h: 48, src: "assets/xhs/style_04.webp", title: "元素与穿搭", price: "翻盖壳蝴蝶 · 可复刻符号" },
        { id: "r4", type: "cam", x: 88, y: 14, w: 8, h: 10, text: "📷" }
      ]
    },
    {
      id: "s19",
      title: "带走启发",
      navSmall: "Travel · Takeaway",
      navOn: "Home",
      duty: "Boarding Out",
      seals: "可模仿的核心|可传播的文化",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "好的视觉＝可被模仿的核心＝可传播的文化。旧物在等重新发现它们的人。",
      imgGuide: "封面式大标题 + Guides。",
      elements: [
        { id: "s1", type: "tag", x: 7, y: 20, w: 16, h: 4, text: "Takeaway" },
        { id: "s2", type: "headline", x: 7, y: 28, w: 48, h: 28, text: "好的视觉\n＝可模仿的核心\n＝可传播的文化", size: 36, font: "Instrument Serif, serif", color: "#161616" },
        { id: "s3", type: "guide", x: 55, y: 22, w: 38, h: 48, src: "assets/ref/ever2late.png", title: "旧物不会消失", caption: "它们只是在等重新发现它们的人", badge: "WAIT" },
        { id: "s4", type: "pin", x: 48, y: 70, w: 7, h: 12, text: "🌴" }
      ]
    },
    {
      id: "s20",
      title: "现场考古",
      navSmall: "Shop · Live",
      navOn: "FAQ",
      duty: "Live Dig",
      seals: "翻盖机|4399|MP3|大头贴|QQ秀",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "提问互动。短提灵感清单，勿拖成第二场。",
      imgGuide: "问题大字 + 徽章点缀。",
      elements: [
        { id: "t1", type: "section", x: 7, y: 16, w: 50, h: 8, text: "Live <span class=\"accent\">Archaeology</span>", size: 28 },
        { id: "t2", type: "headline", x: 7, y: 32, w: 70, h: 20, text: "你有什么被遗忘\n但很怀念的旧审美 / 旧物件？", size: 28, font: "Instrument Serif, serif", color: "#161616" },
        { id: "t3", type: "pin", x: 8, y: 64, w: 7, h: 12, text: "📱" },
        { id: "t4", type: "pin", x: 18, y: 66, w: 7, h: 12, text: "🕹" },
        { id: "t5", type: "pin", x: 28, y: 64, w: 7, h: 12, text: "🎧" },
        { id: "t6", type: "plate", x: 40, y: 64, w: 14, h: 12, text: "大头贴\nQQ 秀" },
        { id: "t7", type: "note-sticker", x: 60, y: 62, w: 22, h: 14, text: "@byheyone\n@hiozoik\n@haanasah" }
      ]
    },
    {
      id: "s21",
      title: "感谢",
      navSmall: "Travel · Thanks",
      navOn: "Home",
      duty: "See you ✈",
      seals: "Thanks to KiiiKiii & TiiiKiii",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "Thanks to KiiiKiii & TiiiKiii。谢谢大家。",
      imgGuide: "封面收束。",
      elements: [
        { id: "u1", type: "headline", x: 7, y: 28, w: 40, h: 16, text: "Thanks", size: 64, font: "Instrument Serif, serif", color: "#161616" },
        { id: "u2", type: "sub", x: 7, y: 48, w: 40, h: 8, text: "to KiiiKiii & TiiiKiii\n欢迎继续交流" },
        { id: "u3", type: "guide", x: 48, y: 22, w: 44, h: 48, src: "assets/ref/ever2late.png", title: "Ever2Late! ✿", caption: "boarding complete", badge: "END" },
        { id: "u4", type: "link", x: 7, y: 68, w: 20, h: 6, text: "kiiikiii.kr", href: "https://www.kiiikiii.kr/" },
        { id: "u5", type: "note-sticker", x: 30, y: 66, w: 10, h: 12, text: "safe\nflights →" }
      ]
    }
  ]
};
