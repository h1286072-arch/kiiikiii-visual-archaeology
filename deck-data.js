/* Default deck — 讲稿对齐 · 台上少字多图 · 三次回归相册排版 */
window.DEFAULT_DECK = {
  version: 5,
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
      notes: "大家好〜\n最近是不是发现，身边又开始流行 2000 年那会儿的东西了？Y2K、千禧风、蝴蝶机、透明塑料、金属色……这股回潮背后：2000 年前后是经济上行期，大家对未来乐观兴奋，科技刚要改变生活。\n韩国女团 KiiiKiii，把那个年代的气质切得特别细——每次回归挑一个千禧年视觉切面，又加进很先锋的「未来感」。复古打底 + 未来感先锋，是她们美学的核心。\n今天来拆一拆，她们是怎么把 2000 年那批审美重新做得好看的。",
      imgGuide: "封面原版排版保留。",
      elements: [
        { id: "a1", type: "tag", x: 7, y: 18, w: 14, h: 4, text: "Design Share" },
        { id: "a2", type: "headline", x: 7, y: 24, w: 38, h: 22, text: "打开 KiiiKiii\n的美学密码", size: 44, font: "Instrument Serif, serif", color: "#161616" },
        { id: "a3", type: "sub", x: 7, y: 50, w: 36, h: 12, text: "复古打底 + 未来感先锋\n把被遗忘的千禧审美，重新做得好看。", size: 13 },
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
      navSmall: "Tour Map",
      navOn: "Shop",
      duty: "4 Stops",
      seals: "三次回归|官网|幕后|互动",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "好，路线很清晰〜今天走四站：三次回归 → 官网设计 → 幕后团队 → 互动。\n按出道到现在的顺序过视觉爆点；最出圈的展开细讲。然后官网、铁三角、互动。我们出发〜",
      imgGuide: "四张大图横排，少字。",
      elements: [
        { id: "b1", type: "section", x: 7, y: 12, w: 40, h: 7, text: "Today <span class=\"accent\">Map</span>", size: 26 },
        { id: "b2", type: "guide", x: 5, y: 26, w: 21, h: 52, src: "assets/albums/uncut-gem/07_星船新女团出道专概念照公开____.jpg", title: "01 三次回归", caption: "", badge: "01" },
        { id: "b3", type: "guide", x: 28, y: 26, w: 21, h: 52, src: "assets/albums/why-kiiikiii/24_kk官网更新会不会太潮了_.jpg", title: "02 官网", caption: "", badge: "02" },
        { id: "b4", type: "guide", x: 51, y: 26, w: 21, h: 52, src: "assets/xhs/team_01.webp", title: "03 幕后", caption: "", badge: "03" },
        { id: "b5", type: "guide", x: 74, y: 26, w: 21, h: 52, src: "assets/xhs/style_05.webp", title: "04 互动", caption: "", badge: "04" }
      ]
    },
    {
      id: "s03",
      title: "美学密码",
      navSmall: "Password",
      navOn: "Guides",
      duty: "Dig & Remake",
      seals: "野生少女|名媛解构|旧互联网",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "KiiiKiii 每次回归都变样，气质始终认得出。表面上是 Y2K，其实更主动——用当代语言挖旧审美再创作。这就是美学密码。\n三次角度：野生少女感 / 名媛符号解构 / 旧互联网氧气感。",
      imgGuide: "三大图，关键词只留标题。",
      elements: [
        { id: "c1", type: "section", x: 7, y: 12, w: 50, h: 7, text: "Aesthetic <span class=\"accent\">Password</span>", size: 26 },
        { id: "c2", type: "guide", x: 5, y: 26, w: 28, h: 52, src: "assets/albums/uncut-gem/01_kiiikiii_I_DO_ME_I_DO_me_right_.jpg", title: "野生少女", caption: "UNCUT GEM", badge: "01" },
        { id: "c3", type: "guide", x: 36, y: 26, w: 28, h: 52, src: "assets/albums/404/14_404-造型.jpg", title: "名媛解构", caption: "404", badge: "02" },
        { id: "c4", type: "guide", x: 67, y: 26, w: 28, h: 52, src: "assets/albums/why-kiiikiii/07_Ever2late概念美学分析.jpg", title: "旧互联网", caption: "Ever2Late", badge: "03" }
      ]
    },
    {
      id: "s04",
      title: "三次回归总览",
      navSmall: "3 Comebacks",
      navOn: "Guides",
      duty: "Visual Blasts",
      seals: "UNCUT GEM|404|Ever2Late",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "三张迷你专辑，视觉主题完全不同，但一眼认出是她们。按时间顺序看；最出圈的 Ever2Late 展开细讲。",
      imgGuide: "三张大 Guides。",
      elements: [
        { id: "d1", type: "section", x: 7, y: 12, w: 50, h: 7, text: "Three <span class=\"accent\">Comebacks</span>", size: 26 },
        { id: "d2", type: "guide", x: 5, y: 26, w: 28, h: 52, src: "assets/albums/uncut-gem/07_星船新女团出道专概念照公开____.jpg", title: "UNCUT GEM", caption: "", badge: "01" },
        { id: "d3", type: "guide", x: 36, y: 26, w: 28, h: 52, src: "assets/albums/404/17____KiiiKiii_404_New_Girl_.jpg", title: "404 (New Era)", caption: "", badge: "02" },
        { id: "d4", type: "guide", x: 67, y: 26, w: 28, h: 52, src: "assets/albums/why-kiiikiii/08_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "Ever2Late ★", caption: "", badge: "03" }
      ]
    },
    {
      id: "s05",
      title: "UNCUT GEM",
      navSmall: "Comeback 01",
      navOn: "Jams",
      duty: "Raw Gem",
      seals: "野生少女|概念照",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "主题：未雕琢的宝石，野生少女感。先看官方概念群像——自然光、山脉、白衣，奠定出道气质。",
      imgGuide: "大图概念照。",
      elements: [
        { id: "e1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "01 · <span class=\"accent\">UNCUT GEM</span>", size: 22 },
        { id: "e2", type: "guide", x: 8, y: 20, w: 84, h: 58, src: "assets/albums/uncut-gem/07_星船新女团出道专概念照公开____.jpg", title: "概念群像", caption: "", badge: "CONCEPT" }
      ]
    },
    {
      id: "s06",
      title: "UNCUT GEM · 出道预告",
      navSmall: "Comeback 01",
      navOn: "Jams",
      duty: "Teaser",
      seals: "果酱|水果|厨房",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "出道预告视觉：果酱 / 水果厨房概念——高饱和、道具戏、邻家底盘 + 不对劲细节。",
      imgGuide: "四宫格同系列。",
      elements: [
        { id: "e1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "UNCUT GEM · <span class=\"accent\">出道预告</span>", size: 22 },
        { id: "e2", type: "guide", x: 3, y: 20, w: 22, h: 58, src: "assets/albums/uncut-gem/03_kiiikiii出道预告视觉分析_.jpg", title: "", caption: "", badge: "01" },
        { id: "e3", type: "guide", x: 27, y: 20, w: 22, h: 58, src: "assets/albums/uncut-gem/04_kiiikiii出道预告视觉分析_.jpg", title: "", caption: "", badge: "02" },
        { id: "e4", type: "guide", x: 51, y: 20, w: 22, h: 58, src: "assets/albums/uncut-gem/05_kiiikiii出道预告视觉分析_.jpg", title: "", caption: "", badge: "03" },
        { id: "e5", type: "guide", x: 75, y: 20, w: 22, h: 58, src: "assets/albums/uncut-gem/06_kiiikiii出道预告视觉分析_.jpg", title: "", caption: "", badge: "04" }
      ]
    },
    {
      id: "s07",
      title: "UNCUT GEM · I DO ME",
      navSmall: "Comeback 01",
      navOn: "Shop",
      duty: "I DO ME",
      seals: "造型|户外",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "I DO ME 造型切面：田园公路、拼贴外套、玩闹姿势——野生少女的生活感。",
      imgGuide: "两大竖图。",
      elements: [
        { id: "e1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "UNCUT GEM · <span class=\"accent\">I DO ME</span>", size: 22 },
        { id: "e2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/uncut-gem/01_kiiikiii_I_DO_ME_I_DO_me_right_.jpg", title: "LOOK", caption: "", badge: "A" },
        { id: "e3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/uncut-gem/02_kiiikiii_I_DO_ME_I_DO_me_right_.jpg", title: "LOOK", caption: "", badge: "B" }
      ]
    },
    {
      id: "s08",
      title: "UNCUT GEM · 旅拍",
      navSmall: "Comeback 01",
      navOn: "Guides",
      duty: "Travel Shot",
      seals: "CCD|生活感",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "群像旅拍：便利店零食、公园甜筒、闪光灯——hiozoik 生活感影像，歪斜留白虚焦。\n收束：不完美才真实，真实才好记。",
      imgGuide: "两大竖图。",
      elements: [
        { id: "e1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "UNCUT GEM · <span class=\"accent\">旅拍</span>", size: 22 },
        { id: "e2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/uncut-gem/08_群像旅拍赛道被你闯进来了_kiiikiii.jpg", title: "CCD", caption: "", badge: "01" },
        { id: "e3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/uncut-gem/09_群像旅拍赛道被你闯进来了_kiiikiii.jpg", title: "Street", caption: "", badge: "02" }
      ]
    },
    {
      id: "s09",
      title: "404 New Era",
      navSmall: "Comeback 02",
      navOn: "Shop",
      duty: "404",
      seals: "名媛解构|Y2K",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "概念：404 = 新时代入口；New Era 双关。先看同系列视觉 1–4。",
      imgGuide: "四宫格同风格。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "02 · <span class=\"accent\">404 (New Era)</span>", size: 22 },
        { id: "f2", type: "guide", x: 3, y: 20, w: 22, h: 58, src: "assets/albums/404/01_404-1.jpg", title: "", caption: "", badge: "1" },
        { id: "f3", type: "guide", x: 27, y: 20, w: 22, h: 58, src: "assets/albums/404/05_404-2.jpg", title: "", caption: "", badge: "2" },
        { id: "f4", type: "guide", x: 51, y: 20, w: 22, h: 58, src: "assets/albums/404/06_404-3.jpg", title: "", caption: "", badge: "3" },
        { id: "f5", type: "guide", x: 75, y: 20, w: 22, h: 58, src: "assets/albums/404/07_404-4.jpg", title: "", caption: "", badge: "4" }
      ]
    },
    {
      id: "s10",
      title: "404 · 系列 2",
      navSmall: "Comeback 02",
      navOn: "Shop",
      duty: "404",
      seals: "造型|道具",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "404 系列续：道具与姿态继续堆叠 Y2K / 名媛符号，玩而不复刻。",
      imgGuide: "四宫格。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "404 · <span class=\"accent\">系列</span>", size: 22 },
        { id: "f2", type: "guide", x: 3, y: 20, w: 22, h: 58, src: "assets/albums/404/08_404-5.jpg", title: "", caption: "", badge: "5" },
        { id: "f3", type: "guide", x: 27, y: 20, w: 22, h: 58, src: "assets/albums/404/09_404-6.jpg", title: "", caption: "", badge: "6" },
        { id: "f4", type: "guide", x: 51, y: 20, w: 22, h: 58, src: "assets/albums/404/10_404-7.jpg", title: "", caption: "", badge: "7" },
        { id: "f5", type: "guide", x: 75, y: 20, w: 22, h: 58, src: "assets/albums/404/11_404-8.jpg", title: "", caption: "", badge: "8" }
      ]
    },
    {
      id: "s11",
      title: "404 · 系列 3",
      navSmall: "Comeback 02",
      navOn: "Shop",
      duty: "404",
      seals: "系列收束",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "404 系列收束帧。造型：Juicy / Von Dutch 拿来玩；法式少女亮色印花。",
      imgGuide: "四宫格。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "404 · <span class=\"accent\">系列</span>", size: 22 },
        { id: "f2", type: "guide", x: 3, y: 20, w: 22, h: 58, src: "assets/albums/404/12_404-9.jpg", title: "", caption: "", badge: "9" },
        { id: "f3", type: "guide", x: 27, y: 20, w: 22, h: 58, src: "assets/albums/404/02_404-10.jpg", title: "", caption: "", badge: "10" },
        { id: "f4", type: "guide", x: 51, y: 20, w: 22, h: 58, src: "assets/albums/404/03_404-11.jpg", title: "", caption: "", badge: "11" },
        { id: "f5", type: "guide", x: 75, y: 20, w: 22, h: 58, src: "assets/albums/404/04_404-12.jpg", title: "", caption: "", badge: "12" }
      ]
    },
    {
      id: "s12",
      title: "404 · 生活感 / 造型",
      navSmall: "Comeback 02",
      navOn: "Guides",
      duty: "Life",
      seals: "卧室|街头闪光",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "生活感室内（Game Boy / 粉包）对照街头闪光夜拍——同一宇宙的两种温度。",
      imgGuide: "两大竖图。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "404 · <span class=\"accent\">生活感 · 造型</span>", size: 22 },
        { id: "f2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/404/13_404-生活感.jpg", title: "生活感", caption: "", badge: "LIFE" },
        { id: "f3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/404/14_404-造型.jpg", title: "造型", caption: "", badge: "STREET" }
      ]
    },
    {
      id: "s13",
      title: "404 · New Era",
      navSmall: "Comeback 02",
      navOn: "Shop",
      duty: "New Era",
      seals: "联名|补丁",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "联名：New Era 深度绑定 + 定制补丁；New Girl 主视觉。\n收束：品牌吸收进概念宇宙。",
      imgGuide: "三图。",
      elements: [
        { id: "f1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "404 · <span class=\"accent\">New Era</span>", size: 22 },
        { id: "f2", type: "guide", x: 4, y: 20, w: 28, h: 58, src: "assets/albums/404/15_newera头围尺寸.jpg", title: "Merch", caption: "", badge: "NE" },
        { id: "f3", type: "guide", x: 36, y: 20, w: 28, h: 58, src: "assets/albums/404/16_newera头围尺寸.jpg", title: "Fit", caption: "", badge: "NE" },
        { id: "f4", type: "guide", x: 68, y: 20, w: 28, h: 58, src: "assets/albums/404/17____KiiiKiii_404_New_Girl_.jpg", title: "New Girl", caption: "", badge: "KV" }
      ]
    },
    {
      id: "s14",
      title: "Ever2Late · Blue hour",
      navSmall: "Comeback 03 ★",
      navOn: "Guides",
      duty: "Blue hour",
      seals: "预告|蓝调",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "最出圈的一次从这里开始。Blue hour 预告照：薄暮蓝、氧气感，旧互联网氛围的入口。",
      imgGuide: "四宫格同系列。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "03 · <span class=\"accent\">Ever2Late</span> · Blue hour", size: 22 },
        { id: "g2", type: "guide", x: 3, y: 20, w: 22, h: 58, src: "assets/albums/why-kiiikiii/01_Blue_hour预告照美学分析.jpg", title: "", caption: "", badge: "01" },
        { id: "g3", type: "guide", x: 27, y: 20, w: 22, h: 58, src: "assets/albums/why-kiiikiii/02_Blue_hour预告照美学分析.jpg", title: "", caption: "", badge: "02" },
        { id: "g4", type: "guide", x: 51, y: 20, w: 22, h: 58, src: "assets/albums/why-kiiikiii/03_Blue_hour预告照美学分析.jpg", title: "", caption: "", badge: "03" },
        { id: "g5", type: "guide", x: 75, y: 20, w: 22, h: 58, src: "assets/albums/why-kiiikiii/04_Blue_hour预告照美学分析.jpg", title: "", caption: "", badge: "04" }
      ]
    },
    {
      id: "s15",
      title: "Ever2Late 概念",
      navSmall: "Comeback 03 ★",
      navOn: "Guides",
      duty: "Ever2Late",
      seals: "永远晚点|旧互联网",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "主题：Ever2Late 航空公司——永远不晚。切面：旧互联网氧气感（Tumblr / Frutiger Aero / 博客评论区）。",
      imgGuide: "左侧标题，右侧主视觉。",
      elements: [
        { id: "g1", type: "tag", x: 7, y: 16, w: 14, h: 4, text: "Most viral" },
        { id: "g2", type: "section", x: 7, y: 24, w: 36, h: 7, text: "03 · <span class=\"accent\">Ever2Late</span>", size: 24 },
        { id: "g3", type: "headline", x: 7, y: 36, w: 34, h: 14, text: "航空公司 ×\n旧互联网", size: 30, font: "Instrument Serif, serif", color: "#161616" },
        { id: "g4", type: "guide", x: 44, y: 14, w: 50, h: 64, src: "assets/albums/why-kiiikiii/07_Ever2late概念美学分析.jpg", title: "Ever2Late! ✿", caption: "", badge: "04:00–08:00" }
      ]
    },
    {
      id: "s16",
      title: "Ever2Late · 回归预告",
      navSmall: "Comeback 03",
      navOn: "Shop",
      duty: "Teaser",
      seals: "六代独一份",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "回归预告照公开：造型锐度拉高，符号更密——六代里辨识度极强的一套。",
      imgGuide: "三图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">回归预告</span>", size: 22 },
        { id: "g2", type: "guide", x: 4, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/08_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "", caption: "", badge: "01" },
        { id: "g3", type: "guide", x: 36, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/09_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "", caption: "", badge: "02" },
        { id: "g4", type: "guide", x: 68, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/10_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "", caption: "", badge: "03" }
      ]
    },
    {
      id: "s17",
      title: "Ever2Late · 回归预告 2",
      navSmall: "Comeback 03",
      navOn: "Shop",
      duty: "Teaser",
      seals: "预告续",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "回归预告续帧 + 部分预告横图。",
      imgGuide: "两竖 + 两横会挤；本页两大竖，下页横构图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">回归预告</span>", size: 22 },
        { id: "g2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/11_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "", caption: "", badge: "04" },
        { id: "g3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/12_KiiiKiii回归预告照公开_六代独一份的风格.jpg", title: "", caption: "", badge: "05" }
      ]
    },
    {
      id: "s18",
      title: "Ever2Late · 矿泉水",
      navSmall: "Comeback 03",
      navOn: "Jams",
      duty: "Props",
      seals: "矿泉水|化妆水",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "回归照灵感：矿泉水 or 化妆水——道具把「氧气感」做成可摸的物件。",
      imgGuide: "两张主图（略方 / 横）。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">矿泉水灵感</span>", size: 22 },
        { id: "g2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/13_kiiikiii回归照灵感_矿泉水or化妆水_.jpg", title: "Still", caption: "", badge: "PROP" },
        { id: "g3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/14_kiiikiii回归照灵感_矿泉水or化妆水_.jpg", title: "Detail", caption: "", badge: "PROP" }
      ]
    },
    {
      id: "s19",
      title: "Ever2Late · 部分预告",
      navSmall: "Comeback 03",
      navOn: "Guides",
      duty: "Teaser",
      seals: "横构图",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "部分预告横构图——景别拉开，世界观开始成立。",
      imgGuide: "两大横图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">部分预告</span>", size: 22 },
        { id: "g2", type: "guide", x: 5, y: 22, w: 44, h: 56, src: "assets/albums/why-kiiikiii/17_kiiikiii回归部分预告.jpg", title: "", caption: "", badge: "01" },
        { id: "g3", type: "guide", x: 51, y: 22, w: 44, h: 56, src: "assets/albums/why-kiiikiii/18_kiiikiii回归部分预告.jpg", title: "", caption: "", badge: "02" }
      ]
    },
    {
      id: "s20",
      title: "Ever2Late · EP 概念",
      navSmall: "Comeback 03",
      navOn: "Guides",
      duty: "EP",
      seals: "概念图",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "EP 最新概念图：同一套语言下的不同景别。一张专辑四种风格会在造型页展开。",
      imgGuide: "三张横/竖混排。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">EP 概念</span>", size: 22 },
        { id: "g2", type: "guide", x: 4, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/19_kiiikiii_EP最新概念图_.jpg", title: "", caption: "", badge: "01" },
        { id: "g3", type: "guide", x: 36, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/20_kiiikiii_EP最新概念图_.jpg", title: "", caption: "", badge: "02" },
        { id: "g4", type: "guide", x: 68, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/21_kiiikiii_EP最新概念图_.jpg", title: "", caption: "", badge: "03" }
      ]
    },
    {
      id: "s21",
      title: "Ever2Late · EP 概念 2",
      navSmall: "Comeback 03",
      navOn: "Guides",
      duty: "EP",
      seals: "概念图",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "EP 概念续。细节：复古软 × Y2K 锐。",
      imgGuide: "两大图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">EP 概念</span>", size: 22 },
        { id: "g2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/22_kiiikiii_EP最新概念图_.jpg", title: "", caption: "", badge: "04" },
        { id: "g3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/23_kiiikiii_EP最新概念图_.jpg", title: "", caption: "", badge: "05" }
      ]
    },
    {
      id: "s22",
      title: "Ever2Late · 官网",
      navSmall: "Comeback 03",
      navOn: "Jams",
      duty: "Web",
      seals: "whykiiikiii",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "官网更新本身也是造型的一部分——概念即站点。后面官网章节会再展开。",
      imgGuide: "超大竖图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">官网</span>", size: 22 },
        { id: "g2", type: "guide", x: 18, y: 18, w: 64, h: 62, src: "assets/albums/why-kiiikiii/24_kk官网更新会不会太潮了_.jpg", title: "whykiiikiii", caption: "", badge: "WEB" }
      ]
    },
    {
      id: "s23",
      title: "Ever2Late · 美学自证",
      navSmall: "Comeback 03",
      navOn: "Shop",
      duty: "Self",
      seals: "最懂美学",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "最懂 KiiiKiii 美学的，一直是她们自己——造型页四切面的现场证据。",
      imgGuide: "三图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">美学</span>", size: 22 },
        { id: "g2", type: "guide", x: 4, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/25_最懂KiiiKiii美学的_一直是她们自己.jpg", title: "", caption: "", badge: "1" },
        { id: "g3", type: "guide", x: 36, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/26_最懂KiiiKiii美学的_一直是她们自己.jpg", title: "", caption: "", badge: "2" },
        { id: "g4", type: "guide", x: 68, y: 20, w: 28, h: 58, src: "assets/albums/why-kiiikiii/27_最懂KiiiKiii美学的_一直是她们自己.jpg", title: "", caption: "", badge: "3" }
      ]
    },
    {
      id: "s24",
      title: "Ever2Late · 美学自证 2",
      navSmall: "Comeback 03",
      navOn: "Shop",
      duty: "Self",
      seals: "四种风格",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "一张专辑四种风格：Tumblr / 千禧矢量 / 日系甜点 / 海边度假。\n小技巧：眼镜配饰；拍鞋加场景道具。",
      imgGuide: "两大图。",
      elements: [
        { id: "g1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "Ever2Late · <span class=\"accent\">美学</span>", size: 22 },
        { id: "g2", type: "guide", x: 5, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/28_最懂KiiiKiii美学的_一直是她们自己.jpg", title: "Look", caption: "", badge: "4" },
        { id: "g3", type: "guide", x: 51, y: 20, w: 44, h: 58, src: "assets/albums/why-kiiikiii/29_最懂KiiiKiii美学的_一直是她们自己.jpg", title: "Look", caption: "", badge: "5" }
      ]
    },
    {
      id: "s25",
      title: "Ever2Late MV",
      navSmall: "MV Clip",
      navOn: "Guides",
      duty: "▶ Video 1",
      seals: "Sims|Web|Frutiger",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【播视频 1】MV 网页设计片段约 1′30″，播时不讲话。\n结束后：影像在构建完整视觉世界，不只是拍人好看。",
      imgGuide: "大图位留给视频；可换成 video 元素。",
      elements: [
        { id: "i1", type: "section", x: 7, y: 10, w: 50, h: 6, text: "MV · <span class=\"accent\">Video 1</span>", size: 22 },
        { id: "i2", type: "guide", x: 5, y: 20, w: 58, h: 58, src: "assets/xhs/concept_cover.webp", title: "▶ 嵌入 MV 片段", caption: "约 1′30″", badge: "PLAY" },
        { id: "i3", type: "guide", x: 66, y: 20, w: 29, h: 58, src: "assets/albums/why-kiiikiii/21_kiiikiii_EP最新概念图_.jpg", title: "静帧", caption: "", badge: "" }
      ]
    },
    {
      id: "s26",
      title: "宣传物料",
      navSmall: "Promo",
      navOn: "Shop",
      duty: "UGC",
      seals: "登机牌|Tumblr|C143",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "物料：Tumblr 预告、博客评论藏图、登机牌 UGC、幸运饼干、评论解锁。\n收束：预热做成内容，粉丝变成传播者。\n影响：Kodak C143 二手价翻倍。",
      imgGuide: "四图横排。",
      elements: [
        { id: "j1", type: "section", x: 7, y: 10, w: 40, h: 6, text: "Promo · <span class=\"accent\">物料</span>", size: 22 },
        { id: "j2", type: "guide", x: 4, y: 22, w: 22, h: 56, src: "assets/xhs/jam_07.webp", title: "Tumblr", caption: "", badge: "" },
        { id: "j3", type: "guide", x: 28, y: 22, w: 22, h: 56, src: "assets/ref/ever2late.png", title: "登机牌", caption: "", badge: "UGC" },
        { id: "j4", type: "guide", x: 52, y: 22, w: 22, h: 56, src: "assets/xhs/jam_08.webp", title: "互动", caption: "", badge: "" },
        { id: "j5", type: "guide", x: 76, y: 22, w: 20, h: 56, src: "assets/xhs/style_05.webp", title: "C143", caption: "", badge: "📷" }
      ]
    },
    {
      id: "s27",
      title: "官网设计",
      navSmall: "Web",
      navOn: "Jams",
      duty: "Concept = UX",
      seals: "独立站|游戏化|概念实体",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "三特点：独立主题站；游戏化；官网本身就是概念。\n一句话：概念即交互，交互即体验。接着播视频 2。",
      imgGuide: "三站大图。",
      elements: [
        { id: "k1", type: "section", x: 7, y: 10, w: 45, h: 6, text: "Web · <span class=\"accent\">官网</span>", size: 22 },
        { id: "k2", type: "guide", x: 5, y: 22, w: 28, h: 56, src: "assets/albums/why-kiiikiii/24_kk官网更新会不会太潮了_.jpg", title: "独立主题站", caption: "", badge: "1" },
        { id: "k3", type: "guide", x: 36, y: 22, w: 28, h: 56, src: "assets/xhs/jam_04.webp", title: "游戏化", caption: "", badge: "2" },
        { id: "k4", type: "guide", x: 67, y: 22, w: 28, h: 56, src: "assets/ref/ever2late.png", title: "概念实体", caption: "", badge: "3" }
      ]
    },
    {
      id: "s28",
      title: "官网视频",
      navSmall: "Web Reel",
      navOn: "Jams",
      duty: "▶ Video 2",
      seals: "果酱|404|Ever2Late",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【播视频 2】三站录屏约 2′30″，播时不讲话。\n结束后：三种世界观，核心是把概念做成可玩体验。",
      imgGuide: "大主视觉留给录屏；旁侧两张静帧。",
      elements: [
        { id: "l1", type: "section", x: 7, y: 10, w: 45, h: 6, text: "Web · <span class=\"accent\">Video 2</span>", size: 22 },
        { id: "l2", type: "guide", x: 5, y: 20, w: 52, h: 58, src: "assets/xhs/jam_03.webp", title: "▶ 三站录屏合集", caption: "约 2′30″", badge: "PLAY" },
        { id: "l3", type: "guide", x: 60, y: 20, w: 17, h: 28, src: "assets/albums/404/01_404-1.jpg", title: "404", caption: "", badge: "" },
        { id: "l4", type: "guide", x: 79, y: 20, w: 17, h: 28, src: "assets/ref/ever2late.png", title: "E2L", caption: "", badge: "" },
        { id: "l5", type: "guide", x: 60, y: 52, w: 36, h: 26, src: "assets/xhs/jam_05.webp", title: "Jam", caption: "", badge: "" }
      ]
    },
    {
      id: "s29",
      title: "铁三角",
      navSmall: "Crew",
      navOn: "Guides",
      duty: "Triangle",
      seals: "@byheyone|@hiozoik|@haanasah",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "byheyone 视觉指导；hiozoik 摄影；haanasah 造型。\n固定班底审美同频——每次不一样，但每次都是她们。IG 可关注。",
      imgGuide: "三人三大图。",
      elements: [
        { id: "m1", type: "section", x: 7, y: 10, w: 40, h: 6, text: "Crew · <span class=\"accent\">铁三角</span>", size: 22 },
        { id: "m2", type: "guide", x: 5, y: 22, w: 28, h: 56, src: "assets/xhs/team_02.webp", title: "byheyone", caption: "视觉指导", badge: "IG" },
        { id: "m3", type: "guide", x: 36, y: 22, w: 28, h: 56, src: "assets/xhs/team_03.webp", title: "hiozoik", caption: "摄影", badge: "IG" },
        { id: "m4", type: "guide", x: 67, y: 22, w: 28, h: 56, src: "assets/xhs/team_01.webp", title: "haanasah", caption: "造型", badge: "IG" }
      ]
    },
    {
      id: "s30",
      title: "互动 · 回忆杀",
      navSmall: "Live Quiz",
      navOn: "FAQ",
      duty: "回忆杀",
      seals: "弹幕|5 题",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "最后 3–5 分钟回忆杀。看到图可在弹幕评论。答案在后续页备注。",
      imgGuide: "扉页少字，右侧大图氛围。",
      elements: [
        { id: "n1", type: "headline", x: 7, y: 28, w: 40, h: 18, text: "回忆杀", size: 52, font: "Instrument Serif, serif", color: "#161616" },
        { id: "n2", type: "tag", x: 7, y: 52, w: 16, h: 4, text: "5 张图" },
        { id: "n3", type: "guide", x: 48, y: 16, w: 46, h: 62, src: "assets/xhs/style_05.webp", title: "时代的眼泪", caption: "", badge: "LIVE" }
      ]
    },
    {
      id: "s31",
      title: "回忆杀 1",
      navSmall: "Q1",
      navOn: "FAQ",
      duty: "?",
      seals: "答案见备注",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【答案】小霸王学习机。",
      imgGuide: "整页大图位，请替换。",
      elements: [
        { id: "o1", type: "section", x: 7, y: 10, w: 30, h: 6, text: "Q1", size: 22 },
        { id: "o2", type: "guide", x: 12, y: 20, w: 76, h: 58, src: "assets/xhs/jam_06.webp", title: "📷 替换图片", caption: "", badge: "?" }
      ]
    },
    {
      id: "s32",
      title: "回忆杀 2",
      navSmall: "Q2",
      navOn: "FAQ",
      duty: "?",
      seals: "答案见备注",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【答案】诺基亚经典翻盖机。",
      imgGuide: "整页大图位，请替换。",
      elements: [
        { id: "p1", type: "section", x: 7, y: 10, w: 30, h: 6, text: "Q2", size: 22 },
        { id: "p2", type: "guide", x: 12, y: 20, w: 76, h: 58, src: "assets/xhs/jam_01.webp", title: "📷 替换图片", caption: "", badge: "?" }
      ]
    },
    {
      id: "s33",
      title: "回忆杀 3",
      navSmall: "Q3",
      navOn: "FAQ",
      duty: "?",
      seals: "答案见备注",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【答案】黑白猪。",
      imgGuide: "整页大图位，请替换。",
      elements: [
        { id: "q1", type: "section", x: 7, y: 10, w: 30, h: 6, text: "Q3", size: 22 },
        { id: "q2", type: "guide", x: 12, y: 20, w: 76, h: 58, src: "assets/xhs/jam_03.webp", title: "📷 替换图片", caption: "", badge: "?" }
      ]
    },
    {
      id: "s34",
      title: "回忆杀 4",
      navSmall: "Q4",
      navOn: "FAQ",
      duty: "?",
      seals: "答案见备注",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【答案】流氓兔 / Mashimaro。",
      imgGuide: "整页大图位，请替换。",
      elements: [
        { id: "r1", type: "section", x: 7, y: 10, w: 30, h: 6, text: "Q4", size: 22 },
        { id: "r2", type: "guide", x: 12, y: 20, w: 76, h: 58, src: "assets/xhs/jam_05.webp", title: "📷 替换图片", caption: "", badge: "?" }
      ]
    },
    {
      id: "s35",
      title: "回忆杀 5",
      navSmall: "Q5",
      navOn: "FAQ",
      duty: "?",
      seals: "答案见备注",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "【答案】摩丝女孩 / 摩丝娃娃。\n收束：灵感或许藏在旧物件里。",
      imgGuide: "整页大图位，请替换。",
      elements: [
        { id: "s1", type: "section", x: 7, y: 10, w: 30, h: 6, text: "Q5", size: 22 },
        { id: "s2", type: "guide", x: 12, y: 20, w: 76, h: 58, src: "assets/xhs/style_08.webp", title: "📷 替换图片", caption: "", badge: "?" }
      ]
    },
    {
      id: "s36",
      title: "感谢",
      navSmall: "Thanks",
      navOn: "Home",
      duty: "See you ✈",
      seals: "Thanks to KiiiKiii & TiiiKiii",
      sky: "tall",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "Thanks to KiiiKiii & TiiiKiii。谢谢大家。@byheyone @hiozoik @haanasah",
      imgGuide: "少字 + 大视觉。",
      elements: [
        { id: "t1", type: "headline", x: 7, y: 28, w: 36, h: 12, text: "Thanks", size: 56, font: "Instrument Serif, serif", color: "#161616" },
        { id: "t2", type: "link", x: 7, y: 52, w: 26, h: 6, text: "kiiikiii.kr", href: "https://www.kiiikiii.kr/" },
        { id: "t3", type: "guide", x: 48, y: 16, w: 46, h: 62, src: "assets/ref/ever2late.png", title: "Ever2Late! ✿", caption: "", badge: "END" }
      ]
    }
  ]
};
