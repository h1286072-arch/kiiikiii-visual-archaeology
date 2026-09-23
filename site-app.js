/* Interactive site — Home / Jams / 404 / Guides / Talk */
(() => {
  const STORAGE_KEY = "kiiikiii-site-v44-nostalgia-ip";
  const PREV_STORAGE_KEYS = [
    "kiiikiii-site-v43-drop-gear-intro",
    "kiiikiii-site-v42-qr-resize",
    "kiiikiii-site-v41-nostalgia-pic-only",
    "kiiikiii-site-v40-0921-duty-gif",
    "kiiikiii-site-v39-crew-match",
    "kiiikiii-site-v38-device-unstretch",
    "kiiikiii-site-v37-device-align",
    "kiiikiii-site-v36-device-faces",
    "kiiikiii-site-v35-device-crop",
    "kiiikiii-site-v34-talk-duty",
    "kiiikiii-site-v33-candy-pink",
    "kiiikiii-site-v32-strip-hints",
    "kiiikiii-site-v31-jams-0920-imgs",
    "kiiikiii-site-v30-jams-three",
    "kiiikiii-site-v29-0920-merge",
    "kiiikiii-site-v27-presenter",
    "kiiikiii-site-v26-jams-three"
  ];
  const MAX_HISTORY = 60;
  const PIN_DOTS = ["#f9a8d4", "#c4b5fd", "#86efac", "#d6d3d1", "#67e8f9", "#f87171", "#fde047", "#fda4af"];
  const NAV = [
    { id: "home", label: "Home" },
    { id: "jams", label: "Jams" },
    { id: "404", label: "404" },
    { id: "guides", label: "Guides" },
    { id: "talk", label: "Talk" }
  ];

  const state = {
    site: null,
    page: "home",
    edit: false,
    replaceTarget: null,
    dragFrom: null,
    ig: null, // { postId, slide }
    placingText: false,
    placingBookText: false,
    heroTimer: null,
    tourTimer: null,
    productId: null,
    selectedMedia: null,
    clip: null, // { src, type }
    floatHost: null, // page or product object that owns floats
    lightbox: null // { items:[{src,type}], index }
  };

  let history = [];
  let historyIndex = -1;
  let applyingHistory = false;

  const $ = (sel, root = document) => root.querySelector(sel);
  const views = $("#views");
  const navLinks = $("#navLinks");
  const igModal = $("#igModal");
  const lightbox = $("#lightbox");
  const lightboxBody = $("#lightboxBody");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");
  const lightboxCount = $("#lightboxCount");
  const fileVideo = $("#fileVideo");

  function detectFileMediaType(file) {
    if (!file) return "image";
    if (file.type && file.type.startsWith("video/")) return "video";
    if (/\.(mp4|webm|mov)$/i.test(file.name || "")) return "video";
    return "image";
  }

  function isVideoMedia(itemOrSrc, typeHint) {
    const type = typeHint || (itemOrSrc && typeof itemOrSrc === "object" ? itemOrSrc.type : "") || "";
    if (type === "video") return true;
    const src = typeof itemOrSrc === "string" ? itemOrSrc : (itemOrSrc?.src || "");
    if (!src) return false;
    if (/^data:video\//i.test(src)) return true;
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(src)) return true;
    return false;
  }

  function isGifSrc(src) {
    if (!src) return false;
    if (/^data:image\/gif/i.test(src)) return true;
    return /\.gif(\?|#|$)/i.test(src);
  }

  function stripReplayQuery(src) {
    return String(src || "")
      .replace(/([?&])_replay=\d+/g, "$1")
      .replace(/[?&]$/, "")
      .replace(/\?$/, "");
  }

  function replayMediaEl(el) {
    if (!el) return;
    if (el.tagName === "VIDEO") {
      try {
        el.pause();
        el.currentTime = 0;
        const p = el.play?.();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch (_) {}
      return;
    }
    if (el.tagName === "IMG") {
      const base = stripReplayQuery(el.dataset.replaySrc || el.getAttribute("src") || "");
      if (!base) return;
      el.dataset.replaySrc = base;
      el.src = `${base}${base.includes("?") ? "&" : "?"}_replay=${Date.now()}`;
    }
  }

  function attachReplayChrome(parent, mediaEl, opts = {}) {
    if (!mediaEl) return null;
    if (opts.cover || opts.replay === false) {
      parent.appendChild(mediaEl);
      return mediaEl;
    }
    const src = mediaEl.getAttribute("src") || mediaEl.src || "";
    const animated = mediaEl.tagName === "VIDEO" || isGifSrc(src);
    if (!animated) {
      parent.appendChild(mediaEl);
      return mediaEl;
    }
    if (mediaEl.tagName === "IMG") {
      mediaEl.dataset.replaySrc = stripReplayQuery(src);
    }
    const wrap = document.createElement("div");
    wrap.className = "media-replay-wrap";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "media-replay-btn";
    btn.title = "重新播放";
    btn.setAttribute("aria-label", "重新播放");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      replayMediaEl(mediaEl);
    });
    wrap.append(mediaEl, btn);
    parent.appendChild(wrap);
    return mediaEl;
  }

  function appendMediaNode(parent, item, opts = {}) {
    const src = typeof item === "string" ? item : item?.src;
    if (!src) return null;
    if (isVideoMedia(item, opts.type)) {
      const poster = (typeof item === "object" && item?.poster) || opts.poster || "";
      // Thumbnail / pin wall: show cover frame instead of playing video
      if (opts.cover && poster) {
        const img = document.createElement("img");
        img.src = poster;
        img.alt = opts.alt || item?.text || item?.title || "";
        if (opts.lazy !== false) img.loading = "lazy";
        parent.appendChild(img);
        return img;
      }
      const v = document.createElement("video");
      v.src = src;
      if (poster) v.poster = poster;
      v.muted = opts.muted !== false;
      if (v.muted) v.setAttribute("muted", "");
      v.loop = opts.loop !== false;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.autoplay = opts.autoplay !== false;
      if (opts.controls) v.controls = true;
      // still try to freeze on first frame if no poster yet
      if (!poster && opts.cover) {
        v.autoplay = false;
        v.preload = "metadata";
        const snap = () => {
          try {
            if (!v.videoWidth) return;
            v.pause();
            v.currentTime = Math.min(0.05, (v.duration || 1) * 0.02 || 0);
          } catch (_) {}
        };
        v.addEventListener("loadeddata", snap, { once: true });
        parent.appendChild(v);
        return v;
      }
      return attachReplayChrome(parent, v, opts);
    }
    const img = document.createElement("img");
    img.src = src;
    img.alt = opts.alt || item?.text || item?.title || "";
    if (opts.lazy !== false) img.loading = "lazy";
    return attachReplayChrome(parent, img, opts);
  }

  function captureVideoPoster(src, atSec = 0.08) {
    return new Promise((resolve) => {
      if (!src) {
        resolve("");
        return;
      }
      const v = document.createElement("video");
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      v.crossOrigin = "anonymous";
      let done = false;
      const finish = (url) => {
        if (done) return;
        done = true;
        try { v.removeAttribute("src"); v.load(); } catch (_) {}
        resolve(url || "");
      };
      const timer = setTimeout(() => finish(""), 8000);
      const draw = () => {
        try {
          const w = v.videoWidth;
          const h = v.videoHeight;
          if (!w || !h) {
            clearTimeout(timer);
            finish("");
            return;
          }
          const maxW = 720;
          const scale = Math.min(1, maxW / w);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(w * scale));
          canvas.height = Math.max(1, Math.round(h * scale));
          canvas.getContext("2d").drawImage(v, 0, 0, canvas.width, canvas.height);
          clearTimeout(timer);
          finish(canvas.toDataURL("image/jpeg", 0.84));
        } catch (_) {
          clearTimeout(timer);
          finish("");
        }
      };
      v.addEventListener("error", () => {
        clearTimeout(timer);
        finish("");
      });
      v.addEventListener("loadeddata", () => {
        const target = Math.min(Math.max(atSec, 0.01), Number.isFinite(v.duration) && v.duration > 0 ? v.duration * 0.15 : atSec);
        const onSeeked = () => {
          v.removeEventListener("seeked", onSeeked);
          draw();
        };
        v.addEventListener("seeked", onSeeked);
        try {
          v.currentTime = target;
        } catch (_) {
          draw();
        }
      }, { once: true });
      v.src = src;
    });
  }

  async function withVideoPoster(dataUrl, type) {
    if (type !== "video") return { src: dataUrl, type, poster: "" };
    const poster = await captureVideoPoster(dataUrl);
    return { src: dataUrl, type, poster };
  }
  const toastEl = $("#toast");
  const fileImage = $("#fileImage");

  const ICON_CAROUSEL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h11a2 2 0 0 1 2 2v11h-2V6H8V4zm-3 3h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v11h11V9H5z"/></svg>`;
  const ICON_VIDEO = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm15.5 2.5 3.5-2v11l-3.5-2v-7z"/></svg>`;

  function ensure404Posts(page) {
    // magazine + scrapbook pins under hero
    if (!page.heroSlides || !page.heroSlides.length) {
      const fromPosts = (page.posts || []).flatMap((p) => p.slides || []);
      const fromItems = page.items || [];
      const pool = fromPosts.length ? fromPosts : fromItems;
      page.heroSlides = pool.slice(0, 6).map((it) => ({
        id: it.id || uid("hero"),
        type: isVideoMedia(it) ? "video" : (it.type || "image"),
        src: it.src || ""
      }));
    }
    if (!page.heroInterval) page.heroInterval = 3200;
    if (page.scrapCaption == null) page.scrapCaption = "[living my soft life <<3]";
    if (!page.tiles || !page.tiles.length) {
      const pool = (page.items || []).length
        ? page.items
        : (page.heroSlides || []);
      const labels = ["", "", "", "", "", "", "", "", ""];
      page.tiles = pool.slice(0, 7).map((it, i) => ({
        id: it.id || uid("tile"),
        src: it.src || "",
        type: isVideoMedia(it) ? "video" : (it.type || "image"),
        text: labels[i] || "",
        dot: PIN_DOTS[i % PIN_DOTS.length]
      }));
    }
    if (!page.floats) page.floats = [];
    page.tiles.forEach((t, i) => {
      if (t.text == null) t.text = "";
      if (!t.dot) t.dot = PIN_DOTS[i % PIN_DOTS.length];
      if (isVideoMedia(t)) t.type = "video";
    });
    page.floats.forEach((f) => {
      if (typeof f.x !== "number") f.x = 10;
      if (typeof f.y !== "number") f.y = 40;
      if (typeof f.w !== "number") f.w = 20;
      if (f.text == null) f.text = "新文字";
    });

    if (!page.gifRow) page.gifRow = { title: "404 · Loop Clips", intro: "", items: [] };
    if (!page.gifRow.items) page.gifRow.items = [];
    if (page.gifRow.title == null) page.gifRow.title = "404 · Loop Clips";
    page.gifRow.intro = "";
    if (!page.gifRow.frame) page.gifRow.frame = { w: 42 };
    if (typeof page.gifRow.frame.w !== "number") page.gifRow.frame.w = 42;
    if (typeof page.gifRow.activePage !== "number") page.gifRow.activePage = 0;
    page.gifRow.items.forEach((it) => {
      if (!it.type) it.type = isVideoMedia(it) ? "video" : "image";
    });
    const gifLen = page.gifRow.items.length || 0;
    if (gifLen === 0) page.gifRow.activePage = 0;
    else if (page.gifRow.activePage < 0 || page.gifRow.activePage >= gifLen) page.gifRow.activePage = 0;

    if (!page.book) page.book = { title: "404 Photo Book", credit: "*Designed By KiiiKiii", active: 0, pages: [] };
    if (!page.book.pages) page.book.pages = [];
    if (page.book.title == null) page.book.title = "404 Photo Book";
    if (page.book.credit == null) page.book.credit = "*Designed By KiiiKiii";
    if (typeof page.book.active !== "number") page.book.active = 0;
    // active = spread index (0-based); each spread shows 2 pages
    page.book.pages.forEach((pg) => {
      ensureFrame(pg);
      if (typeof pg.frame.w !== "number") pg.frame.w = 72;
      ensureFloats(pg);
      if (!pg.type) pg.type = isVideoMedia(pg) ? "video" : "image";
    });
    const spreadCount = Math.max(1, Math.ceil((page.book.pages.length || 0) / 2) || 1);
    if (page.book.active < 0 || page.book.active >= spreadCount) page.book.active = 0;
    if (!page.book.frame) page.book.frame = { w: 100 };
    if (typeof page.book.frame.w !== "number") page.book.frame.w = 100;

    if (!page.splitRail) {
      page.splitRail = {
        title: "404 · Cinema Strip",
        intro: "",
        features: [
          { id: "split-f1", type: "image", src: "assets/albums/404/split/02_delulu.gif", poster: "", aspect: "656/400" },
          { id: "split-f2", type: "image", src: "assets/albums/404/split/03_loading.gif", poster: "", aspect: "400/712" },
          { id: "split-f3", type: "image", src: "assets/albums/404/split/04_garage_sale.gif", poster: "", aspect: "540/720" }
        ],
        frame: { w: 100 },
        items: [
          { id: "split-01", type: "image", src: "assets/albums/404/01_404-1.jpg", poster: "" },
          { id: "split-02", type: "image", src: "assets/albums/404/08_404-5.jpg", poster: "" },
          { id: "split-03", type: "image", src: "assets/albums/404/10_404-7.jpg", poster: "" },
          { id: "split-04", type: "image", src: "assets/albums/404/11_404-8.jpg", poster: "" },
          { id: "split-05", type: "image", src: "assets/albums/404/14_404-造型.jpg", poster: "" },
          { id: "split-06", type: "image", src: "assets/albums/404/17_KiiiKiii_404_New_Girl_2_十二点十八分.jpg", poster: "" }
        ]
      };
    }
    if (!page.splitRail.items) page.splitRail.items = [];
    if (page.splitRail.title == null) page.splitRail.title = "404 · Cinema Strip";
    page.splitRail.intro = "";
    const pinLabelKill = new Set(["造型", "道具", "Y2K", "直闪", "生活感", "街头", "New Era", "Haum", "Sui", "Leesol", "Kya", "Jiyu", "New Girl"]);
    (page.tiles || []).forEach((t) => {
      if (pinLabelKill.has(t.text)) t.text = "";
    });
    if (!page.splitRail.frame) page.splitRail.frame = { w: 100 };
    if (typeof page.splitRail.frame.w !== "number") page.splitRail.frame.w = 100;
    if (!page.splitRail.features || !page.splitRail.features.length) {
      if (page.splitRail.feature?.src) {
        page.splitRail.features = [page.splitRail.feature];
      } else {
        page.splitRail.features = [
          { id: "split-f1", type: "image", src: "assets/albums/404/split/02_delulu.gif", poster: "", aspect: "656/400" },
          { id: "split-f2", type: "image", src: "assets/albums/404/split/03_loading.gif", poster: "", aspect: "400/712" },
          { id: "split-f3", type: "image", src: "assets/albums/404/split/04_garage_sale.gif", poster: "", aspect: "540/720" }
        ];
      }
    }
    page.splitRail.features.forEach((it) => {
      if (!it.type) it.type = isVideoMedia(it) ? "video" : "image";
    });
    // keep legacy single feature pointer in sync with first tile
    page.splitRail.feature = page.splitRail.features[0] || page.splitRail.feature || { id: uid("split"), type: "image", src: "", poster: "" };
    page.splitRail.items.forEach((it) => {
      if (!it.type) it.type = isVideoMedia(it) ? "video" : "image";
    });

    // keep posts for IG modal compatibility
    if (page.posts && page.posts.length) {
      page.posts.forEach((p) => {
        if (!p.slides) p.slides = [];
        if (!p.comments) p.comments = [];
        if (typeof p.likes !== "number") p.likes = 0;
        if (!p.username) p.username = "kiiikiii";
        if (!p.blurb) p.blurb = "";
        if (!p.caption) p.caption = "";
        if (!p.time) p.time = "just now";
      });
    }
    return page;
  }

  function clearHeroTimer() {
    if (state.heroTimer) {
      clearInterval(state.heroTimer);
      state.heroTimer = null;
    }
  }

  function clearTourTimer() {
    if (state.tourTimer) {
      clearInterval(state.tourTimer);
      state.tourTimer = null;
    }
  }

  function ensureFrame(item) {
    if (!item.frame) item.frame = { w: 100, fit: "contain" };
    if (typeof item.frame.w !== "number") item.frame.w = 100;
    if (!item.frame.fit) item.frame.fit = "contain";
    return item.frame;
  }

  function ensureFloats(host) {
    if (!host.floats) host.floats = [];
    host.floats.forEach((f) => {
      if (typeof f.x !== "number") f.x = 10;
      if (typeof f.y !== "number") f.y = 40;
      if (typeof f.w !== "number") f.w = 20;
      if (f.text == null) f.text = "新文字";
    });
    return host.floats;
  }

  function consolidateJamsToThree(page) {
    const prods = page.products || [];
    const byId = Object.fromEntries(prods.map((p) => [p.id, p]));
    const conceptA = byId["jam-concept-hq-a"];
    const ido = byId["jam-ido-me"];
    const conceptB = byId["jam-concept-hq-b"];
    const travel = byId["jam-travel-1"];
    const jacket = byId["jam-jacket-behind"];
    const needsConcept = !!(conceptA || ido || conceptB);
    const needsTravel = !!(travel || jacket);
    if (!needsConcept && !needsTravel) return page;

    const debut = byId["jam-debut-study"] || prods[0] || null;
    const keepIds = new Set(["jam-debut-study", "jam-concept-pack", "jam-travel-jacket"]);
    const others = prods.filter((p) => !keepIds.has(p.id) && ![
      "jam-concept-hq-a", "jam-ido-me", "jam-concept-hq-b", "jam-travel-1", "jam-jacket-behind"
    ].includes(p.id));

    const next = [];
    if (debut) next.push(debut);

    if (needsConcept) {
      const existing = byId["jam-concept-pack"];
      const details = [
        ...(existing?.details || []),
        ...(conceptA?.details || []),
        ...(ido?.details || []),
        ...(conceptB?.details || [])
      ];
      const seen = new Set();
      const mergedDetails = details.filter((d) => {
        const key = d.id || d.src;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      next.push({
        id: "jam-concept-pack",
        title: existing?.title || "UNCUT GEM Concepts",
        seller: existing?.seller || conceptA?.seller || "starship",
        price: existing?.price || conceptA?.price || "1 Soft Landing",
        locked: false,
        cover: existing?.cover || conceptA?.cover || mergedDetails[0]?.src || "",
        details: mergedDetails,
        floats: existing?.floats || []
      });
    } else if (byId["jam-concept-pack"]) {
      next.push(byId["jam-concept-pack"]);
    }

    if (needsTravel) {
      const existing = byId["jam-travel-jacket"];
      const details = [
        ...(existing?.details || []),
        ...(travel?.details || []),
        ...(jacket?.details || [])
      ];
      const seen = new Set();
      const mergedDetails = details.filter((d) => {
        const key = d.id || d.src;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      next.push({
        id: "jam-travel-jacket",
        title: existing?.title || "Travel & Jacket Behind",
        seller: existing?.seller || travel?.seller || "搬了个",
        price: existing?.price || travel?.price || "1 Soft Landing",
        locked: false,
        cover: existing?.cover || travel?.cover || mergedDetails[0]?.src || "",
        details: mergedDetails,
        floats: existing?.floats || []
      });
    } else if (byId["jam-travel-jacket"]) {
      next.push(byId["jam-travel-jacket"]);
    }

    page.products = next.concat(others);
    return page;
  }

  function ensureJamsShop(page) {
    if (!page.protection) {
      page.protection = "All purchase through KiiiKiii Airlines are covered by TiiKiii Protection.";
    }
    if (!page.shopName) page.shopName = "KiiiKiii Garage Sale";
    ensureFloats(page);
    if (!page.products || !page.products.length) {
      const items = page.items || [];
      page.products = items.map((it, i) => ({
        id: it.id || uid("prod"),
        title: it.title || `Item ${i + 1}`,
        seller: it.caption || "kiiikiii",
        price: it.price || "1 Soft Landing",
        locked: !!it.locked,
        cover: it.src || "",
        details: [{
          id: uid("detail"),
          type: it.type || "image",
          src: it.src || "",
          frame: { w: 100, fit: "contain" }
        }],
        floats: []
      }));
    }
    consolidateJamsToThree(page);
    page.products.forEach((p) => {
      if (!p.details) p.details = [];
      if (!p.details.length && p.cover) {
        p.details.push({ id: uid("detail"), type: "image", src: p.cover, frame: { w: 100, fit: "contain" } });
      }
      if (!p.cover && p.details[0]) p.cover = p.details[0].src;
      if (p.title == null) p.title = "Untitled";
      if (p.seller == null) p.seller = "kiiikiii";
      if (p.price == null) p.price = "1 Soft Landing";
      ensureFloats(p);
      p.details.forEach((d) => ensureFrame(d));
    });
    return page;
  }

  function findJamsProduct(id) {
    const page = state.site?.pages?.jams;
    if (!page) return null;
    ensureJamsShop(page);
    return page.products.find((p) => p.id === id) || null;
  }

  function currentFloatHost() {
    if (state.page === "jams" && state.productId) {
      const p = findJamsProduct(state.productId);
      if (p) return p;
    }
    if (state.page === "404") return state.site.pages["404"];
    if (state.page === "jams") return state.site.pages.jams;
    if (state.site.pages[state.page]) return state.site.pages[state.page];
    return null;
  }

  function selectMedia(item) {
    state.selectedMedia = item || null;
    document.querySelectorAll(".free-frame.selected").forEach((el) => el.classList.remove("selected"));
  }

  function applyMediaSrc(target, src, type) {
    if (!target) return;
    target.src = src;
    if (type) target.type = type;
    if ("cover" in target && !target.details) target.cover = src;
    if ("poster" in target) target.poster = src;
  }

  function ingestImageDataUrl(dataUrl, type = "image") {
    if (state.selectedMedia) {
      applyMediaSrc(state.selectedMedia, dataUrl, type);
      if (state.page === "jams" && state.productId && state.selectedMedia === findJamsProduct(state.productId)?.details?.[0]) {
        const prod = findJamsProduct(state.productId);
        if (prod) prod.cover = dataUrl;
      }
      saveQuiet();
      render();
      toast("已粘贴替换选中图片");
      return;
    }
    if (state.replaceTarget && !state.replaceTarget.__new && !state.replaceTarget.__404NewTile
      && !state.replaceTarget.__talkAdd && !state.replaceTarget.__talkQr
      && !state.replaceTarget.__guidesThemeItem && !state.replaceTarget.__guidesTourSlide) {
      applyMediaSrc(state.replaceTarget, dataUrl, type);
      state.replaceTarget = null;
      saveQuiet();
      render();
      toast("已粘贴替换");
      return;
    }
    if (state.page === "jams" && state.productId) {
      const prod = findJamsProduct(state.productId);
      if (prod) {
        prod.details.push({ id: uid("detail"), type, src: dataUrl, frame: { w: 100, fit: "contain" } });
        if (!prod.cover) prod.cover = dataUrl;
        saveQuiet();
        render();
        toast("已添加概念照");
        return;
      }
    }
    if (state.page === "jams") {
      const page = ensureJamsShop(state.site.pages.jams);
      page.products.push({
        id: uid("prod"),
        title: "New Item",
        seller: "kiiikiii",
        price: "1 Soft Landing",
        cover: dataUrl,
        details: [{ id: uid("detail"), type, src: dataUrl, frame: { w: 100, fit: "contain" } }],
        floats: []
      });
      saveQuiet();
      render();
      toast("已添加商品");
      return;
    }
    if (state.page === "404") {
      state.replaceTarget = { __404NewTile: true };
      // reuse onFile path via fake
      ensure404Posts(state.site.pages["404"]);
      const tiles = state.site.pages["404"].tiles;
      tiles.push({
        id: uid("tile"),
        src: dataUrl,
        type,
        text: "新图"
      });
      saveQuiet();
      render();
      toast("已添加图片块");
      return;
    }
    const page = state.site.pages[state.page];
    if (page?.items) {
      page.items.push({
        id: uid("media"),
        type,
        src: dataUrl,
        title: "",
        caption: "",
        layout: { size: "m", frame: "auto" }
      });
      saveQuiet();
      render();
      toast("已添加图片");
      return;
    }
    toast("当前页无法添加图片");
  }

  function attachFloats(wrap, host) {
    ensureFloats(host);
    state.floatHost = host;
    wrap.classList.toggle("placing-text", !!(state.placingText && state.edit));

    host.floats.forEach((f, fi) => {
      const el = document.createElement("div");
      el.className = "mag-float";
      el.style.left = `${f.x}%`;
      el.style.top = `${f.y}%`;
      el.style.width = `${f.w || 20}%`;
      const body = document.createElement("div");
      body.className = "mag-float-body";
      editable(body, f.text || "", (v) => { f.text = v; saveQuiet(); });
      el.appendChild(body);
      if (state.edit) {
        const grip = document.createElement("span");
        grip.className = "float-grip";
        grip.textContent = "⋮⋮";
        grip.title = "拖动位置";
        const del = document.createElement("button");
        del.type = "button"; del.className = "float-del"; del.textContent = "×";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          host.floats.splice(fi, 1);
          saveQuiet();
          render();
        });
        el.append(grip, del);
        grip.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          el.classList.add("dragging");
          const rect = wrap.getBoundingClientRect();
          const onMove = (ev) => {
            f.x = clamp(((ev.clientX - rect.left) / rect.width) * 100 - 2, 0, 90);
            f.y = clamp(((ev.clientY - rect.top) / rect.height) * 100 - 2, 0, 92);
            el.style.left = `${f.x}%`;
            el.style.top = `${f.y}%`;
          };
          const onUp = () => {
            el.classList.remove("dragging");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });
      }
      wrap.appendChild(el);
    });

    wrap.addEventListener("click", (e) => {
      if (!state.edit || !state.placingText) return;
      if (e.target.closest(".mag-float, .product-card, .free-frame, .mag-cell, .mag-hero-stage, .mag-head, .shop-top, .pd-toolbar, .guides-tour-stage, .guides-tour-thumb, .guides-tour-arrow, button, [contenteditable=true], .shot, .guides-shot")) return;
      const rect = wrap.getBoundingClientRect();
      const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 2, 85);
      const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 2, 90);
      host.floats.push({ id: uid("float"), text: "新文字", x, y, w: 20 });
      state.placingText = false;
      saveQuiet();
      render();
      toast("已添加文字，点文字编辑；拖 ⋮⋮ 移动");
    });
  }

  function freeFrameEl(item, list, idx, opts = {}) {
    ensureFrame(item);
    const frame = item.frame;
    const wrap = document.createElement("div");
    wrap.className = "free-frame" + (state.selectedMedia === item ? " selected" : "");
    wrap.style.width = `${clamp(frame.w, 20, 100)}%`;

    const media = document.createElement("div");
    media.className = "free-media";
    const src = mediaSrc(item);

    if (state.edit && src) {
      const ghost = document.createElement("img");
      ghost.className = "free-ghost";
      ghost.src = src;
      ghost.alt = "";
      media.appendChild(ghost);
    }

    if (item.type === "video" && src && /\.(mp4|webm|mov)$/i.test(src)) {
      const v = document.createElement("video");
      v.src = src; v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
      v.style.objectFit = frame.fit || "contain";
      attachReplayChrome(media, v, {});
    } else if (src) {
      const img = document.createElement("img");
      img.src = src; img.alt = ""; img.loading = "lazy";
      img.style.objectFit = frame.fit || "contain";
      attachReplayChrome(media, img, {});
    } else {
      const ph = document.createElement("div");
      ph.style.cssText = "aspect-ratio:4/5;display:grid;place-items:center;color:#9aa;font-size:13px;";
      ph.textContent = "粘贴或双击添加图片";
      media.appendChild(ph);
    }
    wrap.appendChild(media);

    if (state.edit) {
      const tools = document.createElement("div");
      tools.className = "free-tools";
      const repl = document.createElement("button");
      repl.type = "button"; repl.textContent = "换图";
      repl.addEventListener("click", (e) => {
        e.stopPropagation();
        state.replaceTarget = item;
        state.selectedMedia = item;
        fileImage.click();
      });
      if (list) {
        const up = document.createElement("button");
        up.type = "button"; up.textContent = "↑";
        up.addEventListener("click", (e) => {
          e.stopPropagation();
          if (idx <= 0) return;
          list.splice(idx - 1, 0, list.splice(idx, 1)[0]);
          saveQuiet();
          render();
        });
        const down = document.createElement("button");
        down.type = "button"; down.textContent = "↓";
        down.addEventListener("click", (e) => {
          e.stopPropagation();
          if (idx >= list.length - 1) return;
          list.splice(idx + 1, 0, list.splice(idx, 1)[0]);
          saveQuiet();
          render();
        });
        tools.append(up, down);
      }
      const del = document.createElement("button");
      del.type = "button"; del.className = "danger"; del.textContent = "删";
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!list) return;
        list.splice(idx, 1);
        if (state.selectedMedia === item) state.selectedMedia = null;
        saveQuiet();
        render();
      });
      tools.append(repl, del);
      wrap.appendChild(tools);

      const se = document.createElement("div");
      se.className = "rh rh-se";
      const ee = document.createElement("div");
      ee.className = "rh rh-e";
      const startResize = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectMedia(item);
        wrap.classList.add("selected");
        const parent = wrap.parentElement;
        const parentW = parent?.clientWidth || wrap.parentElement?.clientWidth || 800;
        const startX = e.clientX;
        const startW = frame.w;
        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          frame.w = clamp(startW + (dx / parentW) * 100 * 2, 20, 100);
          wrap.style.width = `${frame.w}%`;
        };
        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          saveQuiet();
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      };
      se.addEventListener("pointerdown", startResize);
      ee.addEventListener("pointerdown", startResize);
      wrap.append(se, ee);

      wrap.addEventListener("click", (e) => {
        if (e.target.closest("button,.rh")) return;
        selectMedia(item);
        wrap.classList.add("selected");
        document.querySelectorAll(".free-frame.selected").forEach((el) => {
          if (el !== wrap) el.classList.remove("selected");
        });
      });
      wrap.addEventListener("dblclick", (e) => {
        if (e.target.closest("button,.rh")) return;
        state.replaceTarget = item;
        fileImage.click();
      });
    } else {
      wrap.addEventListener("click", () => {
        if (src) openLightbox(src, item.type === "video" ? "video" : "image");
      });
      wrap.style.cursor = "zoom-in";
    }

    if (opts.onCover && src) {
      // no-op hook placeholder
    }
    return wrap;
  }

  function syncHash() {
    let next = "";
    if (state.page === "home") next = "";
    else if (state.page === "jams" && state.productId) next = `jams/${state.productId}`;
    else next = state.page;
    const cur = (location.hash || "").replace(/^#/, "");
    if (cur === next) return;
    if (!next) window.history.replaceState(null, "", location.pathname + location.search);
    else location.hash = next;
  }

  function applyHash() {
    const h = (location.hash || "").replace(/^#/, "") || "home";
    const parts = h.split("/").filter(Boolean);
    const page = parts[0] || "home";
    state.page = NAV.some((n) => n.id === page) ? page : "home";
    state.productId = state.page === "jams" && parts[1] ? parts[1] : null;
  }

  function find404Post(postId) {
    return (state.site.pages["404"]?.posts || []).find((p) => p.id === postId) || null;
  }

  function postCover(post) {
    return post.slides?.[0]?.src || "";
  }

  function postBadge(post) {
    const slides = post.slides || [];
    if (slides.some((s) => s.type === "video")) return "video";
    if (slides.length > 1) return "carousel";
    return "";
  }

  function closeIgModal() {
    state.ig = null;
    igModal.classList.remove("open");
    igModal.setAttribute("aria-hidden", "true");
    igModal.innerHTML = "";
  }

  function openIgModal(postId, slide = 0) {
    const post = find404Post(postId);
    if (!post) return;
    state.ig = { postId, slide: clamp(slide, 0, Math.max(0, (post.slides?.length || 1) - 1)) };
    renderIgModal();
  }

  function renderIgModal() {
    if (!state.ig) return;
    const post = find404Post(state.ig.postId);
    if (!post) { closeIgModal(); return; }
    const slides = post.slides || [];
    if (!slides.length) {
      slides.push({ id: uid("slide"), type: "image", src: "" });
      post.slides = slides;
    }
    state.ig.slide = clamp(state.ig.slide, 0, slides.length - 1);
    const slide = slides[state.ig.slide];

    igModal.innerHTML = "";
    igModal.classList.add("open");
    igModal.setAttribute("aria-hidden", "false");

    const shell = document.createElement("div");
    shell.className = "ig-shell";
    shell.addEventListener("click", (e) => e.stopPropagation());

    // media
    const media = document.createElement("div");
    media.className = "ig-media";
    if (slide?.type === "video" && slide.src && /\.(mp4|webm|mov)$/i.test(slide.src)) {
      const v = document.createElement("video");
      v.src = slide.src; v.controls = true; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
      attachReplayChrome(media, v, {});
    } else if (slide?.src) {
      const img = document.createElement("img");
      img.src = slide.src; img.alt = "";
      attachReplayChrome(media, img, {});
    } else {
      const ph = document.createElement("div");
      ph.style.cssText = "color:#aaa;font-size:13px;";
      ph.textContent = state.edit ? "双击添加图片" : "暂无图片";
      media.appendChild(ph);
    }

    if (slides.length > 1) {
      const prev = document.createElement("button");
      prev.type = "button"; prev.className = "ig-nav prev"; prev.textContent = "‹";
      prev.addEventListener("click", () => {
        state.ig.slide = (state.ig.slide - 1 + slides.length) % slides.length;
        renderIgModal();
      });
      const next = document.createElement("button");
      next.type = "button"; next.className = "ig-nav next"; next.textContent = "›";
      next.addEventListener("click", () => {
        state.ig.slide = (state.ig.slide + 1) % slides.length;
        renderIgModal();
      });
      media.append(prev, next);
      const dots = document.createElement("div");
      dots.className = "ig-dots";
      slides.forEach((_, i) => {
        const d = document.createElement("i");
        if (i === state.ig.slide) d.classList.add("on");
        dots.appendChild(d);
      });
      media.appendChild(dots);
    }

    if (state.edit) {
      media.addEventListener("dblclick", () => {
        state.replaceTarget = { __igSlide: true, postId: post.id, slideIndex: state.ig.slide };
        fileImage.click();
      });
    }

    // side
    const side = document.createElement("div");
    side.className = "ig-side";

    const top = document.createElement("div");
    top.className = "ig-top";
    const av = document.createElement("div");
    av.className = "ig-avatar";
    av.style.backgroundImage = `url("${postCover(post) || "assets/xhs/style_03.webp"}")`;
    const userWrap = document.createElement("div");
    const user = document.createElement("span");
    user.className = "ig-user";
    editable(user, post.username || "kiiikiii", (v) => { post.username = v; saveQuiet(); });
    const follow = document.createElement("span");
    follow.className = "ig-follow";
    follow.textContent = "关注";
    userWrap.append(user, follow);
    const close = document.createElement("button");
    close.type = "button"; close.className = "ig-close"; close.textContent = "×";
    close.addEventListener("click", closeIgModal);
    top.append(av, userWrap, close);

    const body = document.createElement("div");
    body.className = "ig-body";
    const capRow = document.createElement("div");
    capRow.className = "ig-caption-row";
    const capAv = document.createElement("div");
    capAv.className = "ig-avatar";
    capAv.style.backgroundImage = av.style.backgroundImage;
    const cap = document.createElement("div");
    cap.className = "ig-caption";
    const capUser = document.createElement("b");
    capUser.textContent = post.username || "kiiikiii";
    const capText = document.createElement("span");
    editable(capText, post.caption || "", (v) => { post.caption = v; saveQuiet(); });
    const time = document.createElement("div");
    time.className = "ig-time";
    editable(time, post.time || "", (v) => { post.time = v; saveQuiet(); });
    cap.append(capUser, capText, time);
    capRow.append(capAv, cap);
    body.appendChild(capRow);

    const comments = document.createElement("div");
    comments.className = "ig-comments";
    (post.comments || []).forEach((c, ci) => {
      const row = document.createElement("div");
      row.className = "ig-comment";
      const cav = document.createElement("div");
      cav.className = "ig-avatar";
      cav.style.background = "#e8eef3";
      const t = document.createElement("div");
      t.className = "t";
      const ub = document.createElement("b");
      editable(ub, c.user || "user", (v) => { c.user = v; saveQuiet(); });
      const tx = document.createElement("span");
      editable(tx, c.text || "", (v) => { c.text = v; saveQuiet(); });
      t.append(ub, tx);
      row.append(cav, t);
      if (state.edit) {
        const del = document.createElement("button");
        del.type = "button"; del.className = "tab"; del.textContent = "删";
        del.style.alignSelf = "start";
        del.addEventListener("click", () => {
          post.comments.splice(ci, 1);
          saveQuiet();
          renderIgModal();
        });
        row.appendChild(del);
      }
      comments.appendChild(row);
    });
    body.appendChild(comments);

    const addRow = document.createElement("div");
    addRow.className = "ig-add-row";
    const addSlide = document.createElement("button");
    addSlide.type = "button"; addSlide.className = "tab"; addSlide.textContent = "+ 下一张图";
    addSlide.addEventListener("click", () => {
      state.replaceTarget = { __igNewSlide: true, postId: post.id };
      fileImage.click();
    });
    const addComment = document.createElement("button");
    addComment.type = "button"; addComment.className = "tab"; addComment.textContent = "+ 评论";
    addComment.addEventListener("click", () => {
      post.comments.push({ id: uid("c"), user: "guest", text: "新评论" });
      saveQuiet();
      renderIgModal();
    });
    const delSlide = document.createElement("button");
    delSlide.type = "button"; delSlide.className = "tab danger"; delSlide.textContent = "删当前图";
    delSlide.addEventListener("click", () => {
      if (post.slides.length <= 1) { toast("至少保留一张图"); return; }
      post.slides.splice(state.ig.slide, 1);
      state.ig.slide = Math.min(state.ig.slide, post.slides.length - 1);
      saveQuiet();
      renderIgModal();
      render();
    });
    addRow.append(addSlide, addComment, delSlide);
    body.appendChild(addRow);

    const foot = document.createElement("div");
    foot.className = "ig-foot";
    const actions = document.createElement("div");
    actions.className = "ig-actions";
    const likeBtn = document.createElement("button");
    likeBtn.type = "button";
    likeBtn.textContent = post.liked ? "♥" : "♡";
    likeBtn.style.color = post.liked ? "#ed4956" : "#111";
    likeBtn.addEventListener("click", () => {
      post.liked = !post.liked;
      post.likes = Math.max(0, (post.likes || 0) + (post.liked ? 1 : -1));
      saveQuiet();
      renderIgModal();
    });
    const cmtBtn = document.createElement("button"); cmtBtn.type = "button"; cmtBtn.textContent = "💬";
    const shareBtn = document.createElement("button"); shareBtn.type = "button"; shareBtn.textContent = "✈";
    const spacer = document.createElement("span"); spacer.className = "spacer";
    const saveBtn = document.createElement("button"); saveBtn.type = "button"; saveBtn.textContent = "🔖";
    actions.append(likeBtn, cmtBtn, shareBtn, spacer, saveBtn);

    const likes = document.createElement("div");
    likes.className = "ig-likes";
    const likesNum = document.createElement("span");
    editable(likesNum, String(post.likes ?? 0), (v) => {
      const n = parseInt(v.replace(/\D/g, ""), 10);
      post.likes = Number.isFinite(n) ? n : post.likes;
      saveQuiet();
    });
    likes.append(likesNum, document.createTextNode(" likes"));
    const footTime = document.createElement("div");
    footTime.className = "ig-foot-time";
    footTime.textContent = post.time || "";
    foot.append(actions, likes, footTime);

    side.append(top, body, foot);
    shell.append(media, side);
    igModal.appendChild(shell);
  }

  function render404GifRow(page, mk) {
    const gifRow = page.gifRow;
    if (!gifRow.frame) gifRow.frame = { w: 42 };
    if (typeof gifRow.activePage !== "number") gifRow.activePage = 0;
    const items = gifRow.items || [];
    const count = items.length;
    gifRow.activePage = count ? clamp(gifRow.activePage, 0, count - 1) : 0;
    const item = count ? items[gifRow.activePage] : null;

    const gifBlock = document.createElement("div");
    gifBlock.className = "mag-gif-block";

    const gifHead = document.createElement("div");
    gifHead.className = "mag-gif-head";
    const gifEye = document.createElement("div");
    gifEye.className = "eyebrow";
    gifEye.textContent = "404 · Motion";
    const gifTitle = document.createElement("h2");
    editable(gifTitle, gifRow.title || "Loop Clips", (v) => { gifRow.title = v; saveQuiet(); });
    gifHead.append(gifEye, gifTitle);

    const gifToolbar = document.createElement("div");
    gifToolbar.className = "mag-gif-toolbar";
    const addGif = () => {
      state.replaceTarget = { __404GifItem: true };
      fileImage.click();
    };
    gifToolbar.append(
      mk("+ 新增动图", addGif),
      mk("+ 新增视频", () => {
        state.replaceTarget = { __404GifItem: true };
        fileVideo.click();
      })
    );

    const stage = document.createElement("div");
    stage.className = "mag-gif-stage";
    stage.style.setProperty("--gif-w", `${clamp(gifRow.frame.w, 28, 100)}%`);

    const frame = document.createElement("div");
    frame.className = "mag-gif-frame";

    const cover = document.createElement("article");
    cover.className = "mag-gif-cover";
    const gallery = items.filter((it) => it.src).map((it) => ({
      src: it.src, type: isVideoMedia(it) ? "video" : "image"
    }));

    if (item?.src) {
      appendMediaNode(cover, item, {
        cover: false, muted: true, loop: true, autoplay: true, lazy: false, alt: ""
      });
      const v = cover.querySelector("video");
      if (v) {
        v.muted = true;
        v.setAttribute("muted", "");
        v.playsInline = true;
        v.play?.().catch(() => {});
      }
      cover.addEventListener("click", (e) => {
        if (e.target.closest("button, .rh")) return;
        if (state.edit) { state.selectedMedia = item; return; }
        const idx = gallery.findIndex((g) => g.src === item.src);
        openLightboxGallery(gallery, idx < 0 ? 0 : idx);
      });
      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "mag-gif-tools";
        const add = document.createElement("button");
        add.type = "button"; add.textContent = "+";
        add.title = "新增动图";
        add.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = { __404GifItem: true };
          fileImage.click();
        });
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = item;
          (isVideoMedia(item) ? fileVideo : fileImage).click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          items.splice(gifRow.activePage, 1);
          if (gifRow.activePage >= items.length) gifRow.activePage = Math.max(0, items.length - 1);
          saveQuiet();
          render();
        });
        tools.append(add, repl, del);
        cover.appendChild(tools);
      }
    } else if (state.edit) {
      cover.classList.add("empty");
      cover.textContent = "+ 添加动图";
      cover.addEventListener("click", () => {
        state.replaceTarget = { __404GifItem: true };
        fileImage.click();
      });
    } else {
      cover.classList.add("empty");
      cover.textContent = "暂无动图";
    }
    frame.appendChild(cover);

    const goTo = (next) => {
      if (!count) return;
      const n = ((next % count) + count) % count;
      if (n === gifRow.activePage) return;
      gifRow.activePage = n;
      saveQuiet();
      render();
    };

    if (count > 1) {
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "mag-gif-nav prev";
      prev.setAttribute("aria-label", "上一张");
      prev.innerHTML = "<span>&lt;</span>";
      prev.addEventListener("click", (e) => { e.stopPropagation(); goTo(gifRow.activePage - 1); });

      const next = document.createElement("button");
      next.type = "button";
      next.className = "mag-gif-nav next";
      next.setAttribute("aria-label", "下一张");
      next.innerHTML = "<span>&gt;</span>";
      next.addEventListener("click", (e) => { e.stopPropagation(); goTo(gifRow.activePage + 1); });

      frame.append(prev, next);
    }

    if (state.edit) {
      ["nw", "ne", "sw", "se"].forEach((pos) => {
        const h = document.createElement("div");
        h.className = `rh rh-${pos}`;
        h.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startW = gifRow.frame.w;
          const parentW = gifBlock.clientWidth || 800;
          const sign = (pos === "nw" || pos === "sw") ? -1 : 1;
          const onMove = (ev) => {
            gifRow.frame.w = clamp(startW + sign * ((ev.clientX - startX) / parentW) * 100 * 1.4, 28, 100);
            stage.style.setProperty("--gif-w", `${gifRow.frame.w}%`);
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });
        frame.appendChild(h);
      });
    }
    stage.appendChild(frame);

    const dots = document.createElement("div");
    dots.className = "mag-gif-dots";
    if (count > 1) {
      items.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "mag-gif-dot" + (i === gifRow.activePage ? " on" : "");
        dot.setAttribute("aria-label", `第 ${i + 1} 张`);
        dot.addEventListener("click", () => goTo(i));
        dots.appendChild(dot);
      });
    }
    if (state.edit) {
      const addDot = document.createElement("button");
      addDot.type = "button";
      addDot.className = "mag-gif-dot add";
      addDot.setAttribute("aria-label", "新增动图");
      addDot.textContent = "+";
      addDot.addEventListener("click", () => {
        state.replaceTarget = { __404GifItem: true };
        fileImage.click();
      });
      dots.appendChild(addDot);
    }

    gifBlock.append(gifHead, gifToolbar, stage, dots);
    return gifBlock;
  }

  function fillBookSheet(sheet, pg, pageIndex, pages, book, side) {
    sheet.className = `mag-book-page ${side}` + (state.placingBookText && state.edit ? " placing-book-text" : "");
    const starBox = document.createElement("div");
    starBox.className = "mag-book-stars";
    [[70, 8], [40, 28], [12, 10], [55, 48]].forEach(([l, t], i) => {
      const s = document.createElement("span");
      s.style.left = `${l}%`;
      s.style.top = `${t}%`;
      s.style.transform = `scale(${0.7 + (i % 3) * 0.35})`;
      starBox.appendChild(s);
    });
    sheet.appendChild(starBox);

    if (pg) {
      ensureFrame(pg);
      if (typeof pg.frame.w !== "number") pg.frame.w = 72;
      const mediaWrap = document.createElement("div");
      mediaWrap.className = "mag-book-media-wrap";
      mediaWrap.style.setProperty("--book-w", `${clamp(pg.frame.w, 28, 92)}%`);
      const media = document.createElement("div");
      media.className = "mag-book-media";
      appendMediaNode(media, pg, {
        cover: !!(pg.poster && isVideoMedia(pg)),
        muted: true, loop: true, autoplay: true, lazy: false
      });
      media.addEventListener("click", () => {
        if (state.edit) { state.selectedMedia = pg; return; }
        if (!pg.src) return;
        const gal = pages.filter((p) => p.src).map((p) => ({
          src: p.src, type: isVideoMedia(p) ? "video" : "image"
        }));
        const idx = gal.findIndex((g) => g.src === pg.src);
        openLightboxGallery(gal, idx < 0 ? 0 : idx);
      });
      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "mag-book-tools";
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = pg;
          fileImage.click();
        });
        const replVid = document.createElement("button");
        replVid.type = "button"; replVid.textContent = "视频";
        replVid.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = pg;
          fileVideo.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          pages.splice(pageIndex, 1);
          book.active = Math.max(0, Math.min(book.active, Math.ceil(pages.length / 2) - 1));
          saveQuiet();
          render();
        });
        tools.append(repl, replVid, del);
        media.appendChild(tools);

        const se = document.createElement("div");
        se.className = "rh rh-se";
        const ee = document.createElement("div");
        ee.className = "rh rh-e";
        const startResize = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startW = pg.frame.w;
          const sheetW = sheet.clientWidth || 400;
          const onMove = (ev) => {
            pg.frame.w = clamp(startW + ((ev.clientX - startX) / sheetW) * 100 * 1.6, 28, 92);
            mediaWrap.style.setProperty("--book-w", `${pg.frame.w}%`);
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        };
        se.addEventListener("pointerdown", startResize);
        ee.addEventListener("pointerdown", startResize);
        media.append(se, ee);
      }
      mediaWrap.appendChild(media);
      sheet.appendChild(mediaWrap);

      ensureFloats(pg);
      (pg.floats || []).forEach((f, fi) => {
        const el = document.createElement("div");
        el.className = "mag-float";
        el.style.left = `${f.x}%`;
        el.style.top = `${f.y}%`;
        el.style.width = `${f.w || 22}%`;
        const body = document.createElement("div");
        body.className = "mag-float-body";
        editable(body, f.text || "", (v) => { f.text = v; saveQuiet(); });
        el.appendChild(body);
        if (state.edit) {
          const grip = document.createElement("span");
          grip.className = "float-grip";
          grip.textContent = "⋮⋮";
          const del = document.createElement("button");
          del.type = "button"; del.className = "float-del"; del.textContent = "×";
          del.addEventListener("click", (e) => {
            e.stopPropagation();
            pg.floats.splice(fi, 1);
            saveQuiet();
            render();
          });
          el.append(grip, del);
          grip.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            el.classList.add("dragging");
            const rect = sheet.getBoundingClientRect();
            const onMove = (ev) => {
              f.x = clamp(((ev.clientX - rect.left) / rect.width) * 100 - 2, 0, 90);
              f.y = clamp(((ev.clientY - rect.top) / rect.height) * 100 - 2, 0, 92);
              el.style.left = `${f.x}%`;
              el.style.top = `${f.y}%`;
            };
            const onUp = () => {
              el.classList.remove("dragging");
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
              saveQuiet();
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
          });
        }
        sheet.appendChild(el);
      });
    } else {
      const empty = document.createElement("div");
      empty.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;color:#99a;font-size:13px;";
      empty.textContent = state.edit ? "空页 · 可再加书页" : "";
      sheet.appendChild(empty);
    }

    const num = document.createElement("div");
    num.className = "mag-book-num";
    num.textContent = pageIndex >= 0 ? `(${String(pageIndex + 1).padStart(2, "0")})` : "";
    sheet.appendChild(num);

    if (side === "left") {
      const credit = document.createElement("div");
      credit.className = "mag-book-credit";
      editable(credit, book.credit || "*Designed By KiiiKiii", (v) => { book.credit = v; saveQuiet(); });
      sheet.appendChild(credit);
    }

    sheet.addEventListener("click", (e) => {
      if (!state.edit || !state.placingBookText) return;
      if (e.target.closest(".mag-float, .mag-book-media, button, [contenteditable=true], .rh, .mag-book-curl")) return;
      if (!pg) return;
      const rect = sheet.getBoundingClientRect();
      const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 4, 80);
      const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 4, 88);
      ensureFloats(pg);
      pg.floats.push({ id: uid("float"), text: "新文字", x, y, w: 24 });
      state.placingBookText = false;
      saveQuiet();
      render();
      toast("已在书页添加文字");
    });
  }

  function render404Book(page, mk) {
    const book = page.book;
    if (!book.frame) book.frame = { w: 100 };
    const bookBlock = document.createElement("div");
    bookBlock.className = "mag-book-block";

    const bookHead = document.createElement("div");
    bookHead.className = "mag-book-head";
    const bookEye = document.createElement("div");
    bookEye.className = "eyebrow";
    bookEye.textContent = "404 · Photo Book";
    const bookTitle = document.createElement("h2");
    editable(bookTitle, book.title || "Photo Book", (v) => { book.title = v; saveQuiet(); });
    bookHead.append(bookEye, bookTitle);

    const bookToolbar = document.createElement("div");
    bookToolbar.className = "mag-book-toolbar";
    bookToolbar.append(
      mk("+ 书页", () => {
        state.replaceTarget = { __404BookPage: true, prefer: "image" };
        fileImage.click();
      }),
      mk(state.placingBookText ? "取消书页文字" : "+ 书页文字", () => {
        state.placingBookText = !state.placingBookText;
        state.placingText = false;
        render();
        if (state.placingBookText) toast("点击书页空白处放置文字");
      })
    );

    const stageBook = document.createElement("div");
    stageBook.className = "mag-book-stage";
    stageBook.style.setProperty("--book-stage-w", `${clamp(book.frame.w, 42, 100)}%`);
    const pages = book.pages || [];
    const spreadCount = Math.max(1, Math.ceil(pages.length / 2) || 1);
    let spread = clamp(book.active || 0, 0, spreadCount - 1);
    book.active = spread;

    const renderSpread = () => {
      stageBook.innerHTML = "";
      const frame = document.createElement("div");
      frame.className = "mag-book-frame";
      const spreadEl = document.createElement("div");
      spreadEl.className = "mag-book-spread";
      const leftIdx = spread * 2;
      const rightIdx = leftIdx + 1;
      const left = document.createElement("div");
      const right = document.createElement("div");
      fillBookSheet(left, pages[leftIdx], pages[leftIdx] ? leftIdx : -1, pages, book, "left");
      fillBookSheet(right, pages[rightIdx], pages[rightIdx] ? rightIdx : -1, pages, book, "right");
      spreadEl.append(left, right);

      const curlPrev = document.createElement("button");
      curlPrev.type = "button";
      curlPrev.className = "mag-book-curl prev";
      curlPrev.title = "翻到上一开";
      curlPrev.setAttribute("aria-label", "翻到上一开");
      curlPrev.disabled = spread <= 0;
      curlPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        flipSpread(spread - 1, "prev");
      });
      const curlNext = document.createElement("button");
      curlNext.type = "button";
      curlNext.className = "mag-book-curl next";
      curlNext.title = "翻到下一开";
      curlNext.setAttribute("aria-label", "翻到下一开");
      curlNext.disabled = spread >= spreadCount - 1;
      curlNext.addEventListener("click", (e) => {
        e.stopPropagation();
        flipSpread(spread + 1, "next");
      });
      spreadEl.append(curlPrev, curlNext);
      frame.appendChild(spreadEl);

      if (state.edit) {
        ["nw", "ne", "sw", "se"].forEach((pos) => {
          const h = document.createElement("div");
          h.className = `rh rh-${pos}`;
          h.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = book.frame.w;
            const parentW = bookBlock.clientWidth || 900;
            const signX = (pos === "nw" || pos === "sw") ? -1 : 1;
            const signY = (pos === "nw" || pos === "ne") ? -1 : 1;
            const onMove = (ev) => {
              const dx = signX * ((ev.clientX - startX) / parentW) * 100;
              const dy = signY * ((ev.clientY - startY) / parentW) * 100;
              // proportional: average of both axes
              book.frame.w = clamp(startW + (dx + dy) * 0.7, 42, 100);
              stageBook.style.setProperty("--book-stage-w", `${book.frame.w}%`);
            };
            const onUp = () => {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
              saveQuiet();
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
          });
          frame.appendChild(h);
        });
      }

      stageBook.appendChild(frame);
    };

    const flipSpread = (next, dir) => {
      if (next < 0 || next >= spreadCount) return;
      const el = stageBook.querySelector(".mag-book-spread");
      const go = () => {
        spread = next;
        book.active = spread;
        saveQuiet();
        renderSpread();
      };
      if (el) {
        el.classList.add(dir === "prev" ? "flip-prev" : "flip-next");
        setTimeout(go, 260);
      } else go();
    };

    // expose for keyboard handler
    bookBlock._flipBook = (delta) => {
      flipSpread(spread + delta, delta < 0 ? "prev" : "next");
    };

    renderSpread();
    bookBlock.append(bookHead, bookToolbar, stageBook);
    return bookBlock;
  }

  function render404SplitRail(page, mk) {
    const rail = page.splitRail;
    if (!rail.frame) rail.frame = { w: 100 };
    if (!rail.features) rail.features = [];
    const block = document.createElement("div");
    block.className = "mag-split-block";

    const head = document.createElement("div");
    head.className = "mag-split-head";
    const eye = document.createElement("div");
    eye.className = "eyebrow";
    eye.textContent = "404 · Cinema";
    const title = document.createElement("h2");
    editable(title, rail.title || "Cinema Strip", (v) => { rail.title = v; saveQuiet(); });
    head.append(eye, title);

    const toolbar = document.createElement("div");
    toolbar.className = "mag-split-toolbar";
    toolbar.append(
      mk("+ 上方动图", () => {
        state.replaceTarget = { __404SplitFeature: true };
        fileImage.click();
      }),
      mk("+ 上方视频", () => {
        state.replaceTarget = { __404SplitFeature: true, prefer: "video" };
        fileVideo.click();
      }),
      mk("+ 下方图片", () => {
        state.replaceTarget = { __404SplitItem: true };
        fileImage.click();
      })
    );

    const layout = document.createElement("div");
    layout.className = "mag-split-layout";

    const featRow = document.createElement("div");
    featRow.className = "mag-split-feature-row";
    featRow.style.setProperty("--split-feat-w", `${clamp(rail.frame.w, 36, 100)}%`);

    const features = rail.features;
    const featGallery = features.filter((it) => it.src).map((it) => ({
      src: it.src, type: isVideoMedia(it) ? "video" : "image"
    }));

    const mountFeatureTile = (feat, index) => {
      const tile = document.createElement("article");
      tile.className = "mag-split-feature-tile";
      if (feat?.aspect) {
        tile.style.setProperty("--tile-ar", String(feat.aspect).replace(":", " / ").replace("/", " / "));
      }
      if (feat?.src) {
        appendMediaNode(tile, feat, {
          cover: false, muted: true, loop: true, autoplay: true, lazy: false, alt: ""
        });
        const media = tile.querySelector("img, video");
        if (media) {
          media.style.objectFit = "contain";
          if (media.tagName === "IMG") {
            const applyNatural = () => {
              if (media.naturalWidth && media.naturalHeight) {
                feat.aspect = `${media.naturalWidth}/${media.naturalHeight}`;
                tile.style.setProperty("--tile-ar", `${media.naturalWidth} / ${media.naturalHeight}`);
              }
            };
            if (media.complete) applyNatural();
            else media.addEventListener("load", applyNatural, { once: true });
          }
        }
        const v = tile.querySelector("video");
        if (v) {
          v.muted = true;
          v.setAttribute("muted", "");
          v.playsInline = true;
          v.play?.().catch(() => {});
          v.addEventListener("loadedmetadata", () => {
            if (v.videoWidth && v.videoHeight) {
              feat.aspect = `${v.videoWidth}/${v.videoHeight}`;
              tile.style.setProperty("--tile-ar", `${v.videoWidth} / ${v.videoHeight}`);
            }
          }, { once: true });
        }
        tile.addEventListener("click", (e) => {
          if (e.target.closest("button, .rh")) return;
          if (state.edit) {
            state.selectedMedia = feat;
            state.replaceTarget = feat;
            toast("已选中上方动图 · 可换");
            return;
          }
          const idx = featGallery.findIndex((g) => g.src === feat.src);
          openLightboxGallery(featGallery, idx < 0 ? 0 : idx);
        });
        if (state.edit) {
          const tools = document.createElement("div");
          tools.className = "mag-split-tools";
          const repl = document.createElement("button");
          repl.type = "button"; repl.textContent = "换";
          repl.addEventListener("click", (e) => {
            e.stopPropagation();
            state.replaceTarget = feat;
            fileImage.click();
          });
          const del = document.createElement("button");
          del.type = "button"; del.className = "danger"; del.textContent = "删";
          del.addEventListener("click", (e) => {
            e.stopPropagation();
            features.splice(index, 1);
            saveQuiet();
            render();
          });
          tools.append(repl, del);
          tile.appendChild(tools);
        }
      } else if (state.edit) {
        tile.classList.add("empty");
        tile.textContent = "+";
        tile.addEventListener("click", () => {
          state.replaceTarget = { __404SplitFeature: true };
          fileImage.click();
        });
      }
      return tile;
    };

    if (features.length) {
      features.forEach((feat, i) => featRow.appendChild(mountFeatureTile(feat, i)));
    } else if (state.edit) {
      featRow.appendChild(mountFeatureTile(null, 0));
    }

    if (state.edit) {
      ["nw", "ne", "sw", "se"].forEach((pos) => {
        const h = document.createElement("div");
        h.className = `rh rh-${pos}`;
        h.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = rail.frame.w;
          const parentW = block.clientWidth || 900;
          const signX = (pos === "nw" || pos === "sw") ? -1 : 1;
          const signY = (pos === "nw" || pos === "ne") ? -1 : 1;
          const onMove = (ev) => {
            const dx = signX * ((ev.clientX - startX) / parentW) * 100;
            const dy = signY * ((ev.clientY - startY) / parentW) * 100;
            rail.frame.w = clamp(startW + (dx + dy) * 0.7, 36, 100);
            featRow.style.setProperty("--split-feat-w", `${rail.frame.w}%`);
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });
        featRow.appendChild(h);
      });
    }

    const scroller = document.createElement("div");
    scroller.className = "mag-split-scroller";
    scroller.setAttribute("tabindex", "0");
    const track = document.createElement("div");
    track.className = "mag-split-track";
    const items = rail.items || [];
    const gallery = items.filter((it) => it.src).map((it) => ({
      src: it.src, type: isVideoMedia(it) ? "video" : "image"
    }));

    items.forEach((item, i) => {
      const card = document.createElement("article");
      card.className = "mag-split-card";
      if (item.src) {
        appendMediaNode(card, item, {
          cover: true, muted: true, loop: true, autoplay: false, lazy: true, alt: ""
        });
        card.addEventListener("click", (e) => {
          if (e.target.closest("button")) return;
          if (state.edit) {
            state.selectedMedia = item;
            return;
          }
          const idx = gallery.findIndex((g) => g.src === item.src);
          openLightboxGallery(gallery, idx < 0 ? 0 : idx);
        });
        if (state.edit) {
          const tools = document.createElement("div");
          tools.className = "mag-split-tools";
          const repl = document.createElement("button");
          repl.type = "button"; repl.textContent = "换";
          repl.addEventListener("click", (e) => {
            e.stopPropagation();
            state.replaceTarget = item;
            fileImage.click();
          });
          const del = document.createElement("button");
          del.type = "button"; del.className = "danger"; del.textContent = "删";
          del.addEventListener("click", (e) => {
            e.stopPropagation();
            items.splice(i, 1);
            saveQuiet();
            render();
          });
          tools.append(repl, del);
          card.appendChild(tools);
        }
      }
      track.appendChild(card);
    });

    if (state.edit) {
      const addCard = document.createElement("button");
      addCard.type = "button";
      addCard.className = "mag-split-card add";
      addCard.textContent = "+";
      addCard.addEventListener("click", () => {
        state.replaceTarget = { __404SplitItem: true };
        fileImage.click();
      });
      track.appendChild(addCard);
    }

    scroller.appendChild(track);
    scroller.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scroller.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    layout.append(featRow, scroller);
    block.append(head, toolbar, layout);
    return block;
  }

  function render404Page() {
    clearHeroTimer();
    const page = ensure404Posts(state.site.pages["404"]);
    const view = document.createElement("section");
    view.className = "view active";

    const wrap = document.createElement("div");
    wrap.className = "mag-page" + (state.placingText && state.edit ? " placing-text" : "");

    const head = document.createElement("div");
    head.className = "mag-head";
    const eye = document.createElement("div");
    eye.className = "eyebrow";
    editable(eye, page.eyebrow || "Comeback 02 · 404", (v) => { page.eyebrow = v; saveQuiet(); });
    const h1 = document.createElement("h1");
    editable(h1, page.title || "404 (New Era)", (v) => { page.title = v; saveQuiet(); });
    const intro = document.createElement("div");
    intro.className = "intro";
    editable(intro, page.intro || "", (v) => { page.intro = v; saveQuiet(); });
    head.append(eye, h1, intro);

    const toolbar = document.createElement("div");
    toolbar.className = "mag-toolbar";
    const mk = (label, fn) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "tab"; b.textContent = label;
      b.addEventListener("click", fn);
      return b;
    };
    toolbar.append(
      mk("+ 图片", () => {
        state.replaceTarget = { __404NewTile: true, prefer: "image" };
        fileImage.click();
      }),
      mk("+ 视频", () => {
        state.replaceTarget = { __404NewTile: true, prefer: "video" };
        fileVideo.click();
      }),
      mk(state.placingText ? "取消放置文字" : "+ 空白处加文字", () => {
        state.placingText = !state.placingText;
        state.placingBookText = false;
        render();
        if (state.placingText) toast("点击页面空白处放置文字");
      }),
      mk("+ 轮播图", () => {
        state.replaceTarget = { __404HeroSlide: true };
        fileImage.click();
      }),
      mk("+ 轮播视频", () => {
        state.replaceTarget = { __404HeroSlide: true, prefer: "video" };
        fileVideo.click();
      }),
      mk("+ Loop 动图", () => {
        state.replaceTarget = { __404GifItem: true };
        fileImage.click();
      }),
      mk("+ 上方动图", () => {
        state.replaceTarget = { __404SplitFeature: true };
        fileImage.click();
      }),
      mk("+ 下方横滑图", () => {
        state.replaceTarget = { __404SplitItem: true };
        fileImage.click();
      }),
      mk("+ 书页图片", () => {
        state.replaceTarget = { __404BookPage: true, prefer: "image" };
        fileImage.click();
      }),
      mk(state.placingBookText ? "取消书页文字" : "+ 书页文字", () => {
        state.placingBookText = !state.placingBookText;
        state.placingText = false;
        render();
        if (state.placingBookText) toast("点击书页空白处放置文字");
      })
    );

    // Hero autoplay
    const stage = document.createElement("div");
    stage.className = "mag-hero-stage";
    const slides = page.heroSlides || [];
    let heroIndex = 0;
    slides.forEach((s, i) => {
      const slide = document.createElement("div");
      slide.className = "slide" + (i === 0 ? " on" : "");
      appendMediaNode(slide, s, { lazy: false, muted: true, loop: true, autoplay: true, cover: false });
      stage.appendChild(slide);
    });

    const dots = document.createElement("div");
    dots.className = "mag-hero-dots";
    const setHero = (idx) => {
      if (!slides.length) return;
      heroIndex = ((idx % slides.length) + slides.length) % slides.length;
      [...stage.querySelectorAll(".slide")].forEach((el, i) => el.classList.toggle("on", i === heroIndex));
      [...dots.querySelectorAll("button")].forEach((el, i) => el.classList.toggle("on", i === heroIndex));
    };
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      if (i === 0) d.classList.add("on");
      d.addEventListener("click", (e) => {
        e.stopPropagation();
        setHero(i);
      });
      dots.appendChild(d);
    });
    const prev = document.createElement("button");
    prev.type = "button"; prev.className = "mag-hero-nav prev"; prev.textContent = "‹";
    prev.addEventListener("click", (e) => { e.stopPropagation(); setHero(heroIndex - 1); });
    const next = document.createElement("button");
    next.type = "button"; next.className = "mag-hero-nav next"; next.textContent = "›";
    next.addEventListener("click", (e) => { e.stopPropagation(); setHero(heroIndex + 1); });
    if (slides.length > 1) {
      stage.append(prev, next, dots);
      const startAuto = () => {
        clearHeroTimer();
        state.heroTimer = setInterval(() => setHero(heroIndex + 1), page.heroInterval || 3200);
      };
      startAuto();
      stage.addEventListener("mouseenter", clearHeroTimer);
      stage.addEventListener("mouseleave", startAuto);
    }
    stage.addEventListener("click", (e) => {
      if (e.target.closest(".mag-hero-nav, .mag-hero-dots")) return;
      if (state.edit) {
        const slide = slides[heroIndex];
        if (!slide) return;
        state.replaceTarget = slide;
        fileImage.click();
        return;
      }
      const src = slides[heroIndex]?.src;
      if (src) openLightbox(src, isVideoMedia(slides[heroIndex]) ? "video" : "image");
    });

    // Scrapbook pin wall
    const scrap = document.createElement("div");
    scrap.className = "mag-scrap";

    const wave = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wave.classList.add("mag-scrap-wave");
    wave.setAttribute("viewBox", "0 0 1200 320");
    wave.setAttribute("preserveAspectRatio", "none");
    const wavePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wavePath.setAttribute(
      "d",
      "M0 180 C 80 90, 160 250, 240 160 S 400 60, 480 150 S 640 280, 720 170 S 880 40, 960 140 S 1120 260, 1200 160"
    );
    wave.appendChild(wavePath);

    const stars = document.createElement("div");
    stars.className = "mag-scrap-stars";
    [
      [8, 12], [18, 58], [28, 22], [42, 70], [55, 14], [68, 62], [78, 28], [88, 74], [94, 18], [12, 80]
    ].forEach(([l, t], i) => {
      const s = document.createElement("span");
      s.style.left = `${l}%`;
      s.style.top = `${t}%`;
      s.style.transform = `scale(${0.7 + (i % 3) * 0.25}) rotate(${i * 12}deg)`;
      stars.appendChild(s);
    });

    const pins = document.createElement("div");
    pins.className = "mag-scrap-pins";
    const galleryItems = (page.tiles || [])
      .filter((t) => t.src)
      .map((t) => ({ src: t.src, type: isVideoMedia(t) ? "video" : "image" }));

    const scrapCap = document.createElement("div");
    scrapCap.className = "mag-scrap-caption";
    editable(scrapCap, page.scrapCaption || "[living my soft life <<3]", (v) => {
      page.scrapCaption = v;
      saveQuiet();
    });

    (page.tiles || []).forEach((tile, ti) => {
      if (ti === 4) pins.appendChild(scrapCap);
      const cell = document.createElement("article");
      cell.className = "mag-pin";
      cell.dataset.index = String(ti);

      if (state.edit) {
        cell.draggable = true;
        cell.addEventListener("dragstart", (e) => {
          if (e.target.closest("button,[contenteditable]")) {
            e.preventDefault();
            return;
          }
          state.dragFrom = ti;
          cell.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(ti));
        });
        cell.addEventListener("dragend", () => {
          cell.classList.remove("dragging");
          state.dragFrom = null;
          document.querySelectorAll(".mag-pin.drag-over").forEach((el) => el.classList.remove("drag-over"));
        });
        cell.addEventListener("dragover", (e) => {
          e.preventDefault();
          cell.classList.add("drag-over");
        });
        cell.addEventListener("dragleave", () => cell.classList.remove("drag-over"));
        cell.addEventListener("drop", (e) => {
          e.preventDefault();
          cell.classList.remove("drag-over");
          const from = Number(e.dataTransfer.getData("text/plain"));
          if (Number.isNaN(from) || from === ti) return;
          const [moved] = page.tiles.splice(from, 1);
          page.tiles.splice(ti, 0, moved);
          saveQuiet();
          render();
          toast("已调整顺序");
        });
      }

      const dot = document.createElement("span");
      dot.className = "mag-pin-dot";
      dot.style.background = tile.dot || PIN_DOTS[ti % PIN_DOTS.length];

      const media = document.createElement("div");
      media.className = "mag-pin-media";
      appendMediaNode(media, tile, { alt: tile.text || "", cover: true });
      if (isVideoMedia(tile)) {
        const badge = document.createElement("span");
        badge.className = "vid-badge";
        badge.textContent = "VIDEO";
        media.appendChild(badge);
        if (!tile.poster && tile.src) {
          captureVideoPoster(tile.src).then((poster) => {
            if (!poster || tile.poster) return;
            tile.poster = poster;
            saveQuiet();
            const img = media.querySelector("img");
            if (img) {
              img.src = poster;
            } else {
              media.innerHTML = "";
              appendMediaNode(media, tile, { alt: tile.text || "", cover: true });
              media.appendChild(badge);
            }
          });
        }
      }
      media.addEventListener("click", () => {
        if (state.edit) {
          state.selectedMedia = tile;
          return;
        }
        if (!tile.src) return;
        const idx = galleryItems.findIndex((g) => g.src === tile.src);
        openLightboxGallery(galleryItems, idx < 0 ? 0 : idx);
      });
      if (state.edit) {
        media.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          state.replaceTarget = tile;
          state.selectedMedia = tile;
          (isVideoMedia(tile) ? fileVideo : fileImage).click();
        });
      }

      if (state.edit || (tile.text || "").trim()) {
        const caption = document.createElement("div");
        caption.className = "mag-pin-cap";
        editable(caption, tile.text || "", (v) => { tile.text = v; saveQuiet(); });
        cell.append(dot, media, caption);
      } else {
        cell.append(dot, media);
      }

      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "mag-pin-tools";
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = tile;
          fileImage.click();
        });
        const replVid = document.createElement("button");
        replVid.type = "button"; replVid.textContent = "视频";
        replVid.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = tile;
          fileVideo.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          page.tiles.splice(ti, 1);
          saveQuiet();
          render();
        });
        tools.append(repl, replVid, del);
        cell.appendChild(tools);
      }
      pins.appendChild(cell);
    });
    if (!scrapCap.parentNode) pins.appendChild(scrapCap);

    scrap.append(wave, stars, pins);


    // Floating texts
    (page.floats || []).forEach((f, fi) => {
      const el = document.createElement("div");
      el.className = "mag-float";
      el.style.left = `${f.x}%`;
      el.style.top = `${f.y}%`;
      el.style.width = `${f.w || 20}%`;

      const body = document.createElement("div");
      body.className = "mag-float-body";
      editable(body, f.text || "", (v) => { f.text = v; saveQuiet(); });
      el.appendChild(body);

      if (state.edit) {
        const grip = document.createElement("span");
        grip.className = "float-grip";
        grip.textContent = "⋮⋮";
        grip.title = "拖动位置";
        const del = document.createElement("button");
        del.type = "button"; del.className = "float-del"; del.textContent = "×";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          page.floats.splice(fi, 1);
          saveQuiet();
          render();
        });
        el.append(grip, del);

        const startDrag = (e) => {
          e.preventDefault();
          e.stopPropagation();
          el.classList.add("dragging");
          const rect = wrap.getBoundingClientRect();
          const onMove = (ev) => {
            f.x = clamp(((ev.clientX - rect.left) / rect.width) * 100 - 2, 0, 90);
            f.y = clamp(((ev.clientY - rect.top) / rect.height) * 100 - 2, 0, 92);
            el.style.left = `${f.x}%`;
            el.style.top = `${f.y}%`;
          };
          const onUp = () => {
            el.classList.remove("dragging");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        };
        grip.addEventListener("pointerdown", startDrag);
      }
      wrap.appendChild(el);
    });

    // click blank to place text
    wrap.addEventListener("click", (e) => {
      if (!state.edit || !state.placingText) return;
      if (e.target.closest(".mag-float, .mag-pin, .mag-hero-stage, .mag-head, .mag-toolbar, .mag-gif-block, .mag-split-block, .mag-book-block, button, [contenteditable=true]")) return;
      const rect = wrap.getBoundingClientRect();
      const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 2, 85);
      const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 2, 90);
      page.floats.push({ id: uid("float"), text: "新文字", x, y, w: 20 });
      state.placingText = false;
      saveQuiet();
      render();
      toast("已添加文字，点文字直接编辑；拖 ⋮⋮ 移动位置");
    });

    const gifBlock = render404GifRow(page, mk);
    const splitBlock = render404SplitRail(page, mk);
    const bookBlock = render404Book(page, mk);
    wrap.append(head, toolbar, stage, scrap, gifBlock, splitBlock, bookBlock);
    view.appendChild(wrap);
    return view;
  }

  function deepClone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  function scrubSite(site) {
    if (!site?.pages) return site;
    delete site.pages.web;
    ensureSiteNotes(site);
    return site;
  }

  function defaultNotesFor(key) {
    return window.DEFAULT_SITE?.pages?.[key]?.notes
      ?? (key === "home" ? window.DEFAULT_SITE?.home?.notes : "")
      ?? "";
  }

  function ensureSiteNotes(site) {
    if (!site) return;
    if (site.home && site.home.notes == null) {
      site.home.notes = defaultNotesFor("home") || window.DEFAULT_SITE?.home?.notes || "";
    }
    Object.keys(site.pages || {}).forEach((key) => {
      const page = site.pages[key];
      if (!page) return;
      if (page.notes == null) page.notes = defaultNotesFor(key) || "";
      (page.panels || []).forEach((panel, i) => {
        if (panel.notes == null) {
          const def = window.DEFAULT_SITE?.pages?.[key]?.panels?.[i]?.notes;
          panel.notes = def != null ? def : "";
        }
      });
    });
  }

  function applyDefaultJamsProducts(site) {
    const def = window.DEFAULT_SITE?.pages?.jams;
    if (!def?.products || !site?.pages?.jams) return false;
    site.pages.jams.products = deepClone(def.products);
    return true;
  }

  function jamsMissing0920Images(page) {
    const debut = (page?.products || []).find((p) => p.id === "jam-debut-study");
    if (!debut?.details?.length) return true;
    const ids = new Set(debut.details.map((d) => d.id));
    return ["detail-mu9wfvba-7s63", "detail-mu9wg47s-qyh2", "detail-mu9wgp9a-ne2q", "detail-mu9wgugv-f18f", "d-debut-gif"]
      .some((id) => !ids.has(id));
  }

  function applyDefaultCandyPinkPanel(site) {
    const defPanels = window.DEFAULT_SITE?.pages?.guides?.panels;
    const def = (defPanels || []).find((p) =>
      p.id === "panel-mtzyno11-bvgu" || /Candy Pink Magic Hole/i.test(p.button || "")
    );
    if (!def?.items?.length || !site?.pages?.guides) return false;
    if (!Array.isArray(site.pages.guides.panels)) site.pages.guides.panels = [];
    const panels = site.pages.guides.panels;
    const idx = panels.findIndex((p) =>
      p.id === def.id || /Candy Pink Magic Hole|Bluehour/i.test(p.button || "")
    );
    const next = deepClone(def);
    if (idx >= 0) panels[idx] = next;
    else panels.push(next);
    return true;
  }

  function candyPinkNeedsSync(site) {
    const panels = site?.pages?.guides?.panels || [];
    const panel = panels.find((p) =>
      p.id === "panel-mtzyno11-bvgu" || /Candy Pink Magic Hole/i.test(p.button || "")
    );
    if (!panel?.items?.length) return true;
    const def = (window.DEFAULT_SITE?.pages?.guides?.panels || []).find((p) =>
      p.id === "panel-mtzyno11-bvgu" || /Candy Pink Magic Hole/i.test(p.button || "")
    );
    if (!def?.items?.length) return false;
    if (panel.items.length < def.items.length) return true;
    const ids = new Set(panel.items.map((it) => it.id));
    return def.items.some((it) => !ids.has(it.id));
  }

  function applyDefaultDutyFreeExtras(site) {
    const def = (window.DEFAULT_SITE?.pages?.guides?.panels || []).find((p) => p.id === "panel-duty-free");
    const cur = (site?.pages?.guides?.panels || []).find((p) => p.id === "panel-duty-free");
    if (!def?.items?.length || !cur) return false;
    const have = new Set((cur.items || []).map((it) => it.id));
    let added = false;
    def.items.forEach((it) => {
      if (!have.has(it.id)) {
        cur.items.push(deepClone(it));
        have.add(it.id);
        added = true;
      }
    });
    return added;
  }

  function applyDefaultTalkExtras(site) {
    const def = window.DEFAULT_SITE?.pages?.talk;
    if (!def || !site?.pages?.talk) return false;
    const talk = site.pages.talk;
    let touched = false;
    const nextCrewTitle = def.crewTitle || "kiiikiii团队核心人物";
    const nextGearTitle = def.gearTitle || "kiiikiii同款设备分享";
    if (talk.crewTitle !== nextCrewTitle) { talk.crewTitle = nextCrewTitle; touched = true; }
    if (talk.gearTitle !== nextGearTitle) { talk.gearTitle = nextGearTitle; touched = true; }
    if (talk.crewIntro == null && def.crewIntro != null) { talk.crewIntro = def.crewIntro; touched = true; }
    if (
      talk.gearIntro == null
      || talk.gearIntro === "器材合集，可继续替换与补充"
      || talk.gearIntro === "机型信息可点文字编辑"
    ) {
      talk.gearIntro = def.gearIntro != null ? def.gearIntro : "";
      touched = true;
    }
    if (Array.isArray(def.gear) && def.gear.length) {
      const need = !talk.gear?.length || talk.gear.length !== def.gear.length
        || !talk.gear.every((g) => String(g.src || "").includes("from-device-info"))
        || talk.gear.some((g) => !g.title)
        || talk.gear[0]?.src !== def.gear[0]?.src;
      if (need) {
        talk.gear = deepClone(def.gear);
        touched = true;
      }
    }
    if (!talk.thanks || !talk.thanks.qr) {
      talk.thanks = deepClone(def.thanks || {
        text: "谢谢观看，请给个好评～",
        qr: "assets/imported/talk/thanks-qr.jpg"
      });
      touched = true;
    }
    if (Array.isArray(def.crew) && def.crew.length) {
      const byName = Object.fromEntries(def.crew.map((c) => [String(c.name || "").toLowerCase(), c]));
      const wrong = !talk.crew?.length || talk.crew.length !== def.crew.length
        || talk.crew.some((c) => {
          const want = byName[String(c.name || "").toLowerCase()];
          return !want || c.src !== want.src;
        });
      if (wrong) {
        talk.crew = deepClone(def.crew);
        touched = true;
      }
    }
    (talk.crew || []).forEach((c) => {
      if (!c.frame) { c.frame = { w: 100, fit: "contain" }; touched = true; }
      else if (c.frame.fit === "cover") { c.frame.fit = "contain"; touched = true; }
    });
    if (def.nostalgia) {
      const wantIntro = def.nostalgia.intro || "";
      const wantItems = Array.isArray(def.nostalgia.items) ? def.nostalgia.items : [];
      const cur = talk.nostalgia || { title: "互动 · 回忆杀", intro: "", items: [] };
      const needNos = !cur.items?.length || cur.items.length !== wantItems.length
        || !cur.items.every((it) => String(it.src || "").includes("from-nostalgia-ip"))
        || cur.items[0]?.src !== wantItems[0]?.src
        || cur.intro !== wantIntro;
      if (needNos) {
        talk.nostalgia = deepClone(def.nostalgia);
        touched = true;
      }
    }
    return touched;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state.site = scrubSite(JSON.parse(raw));
        let touched = false;
        if (jamsMissing0920Images(state.site.pages?.jams)) {
          applyDefaultJamsProducts(state.site);
          touched = true;
        }
        if (candyPinkNeedsSync(state.site)) {
          applyDefaultCandyPinkPanel(state.site);
          touched = true;
        }
        if (applyDefaultDutyFreeExtras(state.site)) touched = true;
        if (applyDefaultTalkExtras(state.site)) touched = true;
        if (touched) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
      } else {
        let migrated = null;
        for (const key of PREV_STORAGE_KEYS) {
          const prev = localStorage.getItem(key);
          if (prev) {
            migrated = scrubSite(JSON.parse(prev));
            break;
          }
        }
        if (migrated) {
          state.site = migrated;
          applyDefaultJamsProducts(state.site);
          applyDefaultCandyPinkPanel(state.site);
          applyDefaultDutyFreeExtras(state.site);
          applyDefaultTalkExtras(state.site);
        } else {
          state.site = scrubSite(deepClone(window.DEFAULT_SITE));
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
      }
    } catch (_) {
      state.site = scrubSite(deepClone(window.DEFAULT_SITE));
    }
    if (state.site?.pages?.jams) {
      const before = (state.site.pages.jams.products || []).map((p) => p.id).join(",");
      ensureJamsShop(state.site.pages.jams);
      const after = (state.site.pages.jams.products || []).map((p) => p.id).join(",");
      if (before !== after) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
      }
    }
    if (state.site?.pages?.talk) ensureTalk(state.site.pages.talk);
  }

  function save() {
    pushHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
    toast("已保存到本机");
  }

  function snapshotSite() {
    return JSON.stringify(state.site);
  }

  function resetHistory() {
    history = [snapshotSite()];
    historyIndex = 0;
  }

  function pushHistory() {
    if (applyingHistory) return;
    const snap = snapshotSite();
    if (historyIndex >= 0 && history[historyIndex] === snap) return;
    history = history.slice(0, historyIndex + 1);
    history.push(snap);
    if (history.length > MAX_HISTORY) history.shift();
    historyIndex = history.length - 1;
  }

  function restoreHistory(index) {
    if (index < 0 || index >= history.length) return false;
    applyingHistory = true;
    historyIndex = index;
    state.site = JSON.parse(history[historyIndex]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
    applyingHistory = false;
    render();
    return true;
  }

  function undo() {
    if (historyIndex <= 0) {
      toast("没有可撤回的操作");
      return;
    }
    restoreHistory(historyIndex - 1);
    toast("已撤回");
  }

  function redo() {
    if (historyIndex >= history.length - 1) {
      toast("没有可重做的操作");
      return;
    }
    restoreHistory(historyIndex + 1);
    toast("已重做");
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }

  function setEdit(on) {
    state.edit = on;
    document.body.classList.toggle("edit", on);
    $("#btnEdit").classList.toggle("active", on);
    $("#btnView").classList.toggle("active", !on);
    if (!on) {
      state.placingText = false;
      state.placingBookText = false;
      state.selectedMedia = null;
    }
    render();
  }

  function go(page, productId = null) {
    clearTourTimer();
    clearHeroTimer();
    state.page = page;
    state.productId = page === "jams" ? productId : null;
    state.placingText = false;
    state.selectedMedia = null;
    closeIgModal();
    syncHash();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLightbox(src, type = "image") {
    if (!src) return;
    openLightboxGallery([{ src, type: isVideoMedia(src, type) ? "video" : "image" }], 0);
  }

  function openLightboxGallery(items, index = 0) {
    const list = (items || []).filter((it) => it && it.src);
    if (!list.length) return;
    state.lightbox = {
      items: list,
      index: ((index % list.length) + list.length) % list.length
    };
    renderLightbox();
  }

  function renderLightbox() {
    const lb = state.lightbox;
    if (!lb?.items?.length) return;
    const item = lb.items[lb.index];
    lightboxBody.innerHTML = "";
    if (isVideoMedia(item)) {
      const v = document.createElement("video");
      v.src = item.src;
      v.controls = true;
      v.autoplay = true;
      v.loop = true;
      v.addEventListener("click", (e) => e.stopPropagation());
      attachReplayChrome(lightboxBody, v, {});
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "";
      img.addEventListener("click", (e) => e.stopPropagation());
      attachReplayChrome(lightboxBody, img, {});
    }
    const multi = lb.items.length > 1;
    lightboxPrev?.classList.toggle("show", multi);
    lightboxNext?.classList.toggle("show", multi);
    if (lightboxCount) {
      lightboxCount.classList.toggle("show", multi);
      lightboxCount.textContent = multi ? `${lb.index + 1} / ${lb.items.length}` : "";
    }
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function stepLightbox(delta) {
    const lb = state.lightbox;
    if (!lb?.items?.length) return;
    lb.index = (lb.index + delta + lb.items.length) % lb.items.length;
    renderLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxBody.innerHTML = "";
    lightboxPrev?.classList.remove("show");
    lightboxNext?.classList.remove("show");
    lightboxCount?.classList.remove("show");
    if (lightboxCount) lightboxCount.textContent = "";
    state.lightbox = null;
  }

  function editable(el, value, onCommit) {
    el.textContent = value || "";
    if (!state.edit) return;
    el.contentEditable = "true";
    el.spellcheck = false;
    el.addEventListener("blur", () => onCommit(el.innerText.replace(/\u00a0/g, " ").trimEnd()));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && el.tagName !== "P") {
        e.preventDefault();
        el.blur();
      }
    });
  }

  function mediaSrc(item) {
    return item.src || item.poster || "";
  }

  function renderNav() {
    const small = $("#brandSmall");
    if (small) small.textContent = state.site.brandSmall || "Visual Archaeology";
    const duty = $("#navDuty");
    if (duty) duty.textContent = state.site.duty || "(Girls) Duty Free";

    const existing = [...navLinks.querySelectorAll("button[data-nav]")];
    if (existing.length === NAV.length) {
      existing.forEach((btn, i) => {
        const n = NAV[i];
        btn.textContent = n.label;
        btn.dataset.nav = n.id;
        btn.classList.toggle("on", state.page === n.id);
      });
      return;
    }

    navLinks.innerHTML = "";
    NAV.forEach((n) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.nav = n.id;
      btn.textContent = n.label;
      btn.className = state.page === n.id ? "on" : "";
      btn.addEventListener("click", () => go(n.id));
      li.appendChild(btn);
      navLinks.appendChild(li);
    });
  }

  function ensureLayout(item) {
    if (!item.layout) item.layout = {};
    if (!item.layout.size) item.layout.size = "m";
    if (!item.layout.frame) item.layout.frame = "auto";
    return item.layout;
  }

  function shotEl(item, list, idx) {
    ensureLayout(item);
    const wrap = document.createElement("article");
    const size = item.layout.size || "m";
    const frame = item.layout.frame || "auto";
    wrap.className = `shot size-${size} frame-${frame}` + (item.type === "link" ? " link-card" : "");
    wrap.dataset.index = String(idx);

    if (state.edit) {
      wrap.draggable = true;
      wrap.addEventListener("dragstart", (e) => {
        if (e.target.closest("button,[contenteditable]")) {
          e.preventDefault();
          return;
        }
        state.dragFrom = idx;
        wrap.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(idx));
      });
      wrap.addEventListener("dragend", () => {
        wrap.classList.remove("dragging");
        state.dragFrom = null;
        document.querySelectorAll(".shot.drag-over").forEach((el) => el.classList.remove("drag-over"));
      });
      wrap.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        wrap.classList.add("drag-over");
      });
      wrap.addEventListener("dragleave", () => wrap.classList.remove("drag-over"));
      wrap.addEventListener("drop", (e) => {
        e.preventDefault();
        wrap.classList.remove("drag-over");
        const from = Number(e.dataTransfer.getData("text/plain"));
        const to = idx;
        if (Number.isNaN(from) || from === to || !list) return;
        const [moved] = list.splice(from, 1);
        list.splice(to, 0, moved);
        saveQuiet();
        render();
        toast("已调整顺序");
      });
    }

    if (state.edit) {
      const tools = document.createElement("div");
      tools.className = "shot-tools";
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "drag-handle";
      handle.textContent = "⋮⋮ 拖拽";
      handle.title = "按住卡片拖动排序";
      tools.appendChild(handle);

      [["s", "S"], ["m", "M"], ["l", "L"], ["xl", "XL"]].forEach(([val, label]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.title = "展示大小 " + label;
        if (size === val) b.classList.add("on");
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          item.layout.size = val;
          saveQuiet();
          render();
        });
        tools.appendChild(b);
      });

      [["portrait", "竖"], ["landscape", "横"], ["square", "方"], ["auto", "原"]].forEach(([val, label]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.title = "展示框：" + label;
        if (frame === val) b.classList.add("on");
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          item.layout.frame = val;
          saveQuiet();
          render();
        });
        tools.appendChild(b);
      });

      const del = document.createElement("button");
      del.type = "button";
      del.className = "danger";
      del.textContent = "删";
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        list.splice(idx, 1);
        saveQuiet();
        render();
      });
      tools.appendChild(del);
      wrap.appendChild(tools);
    }

    if (item.type === "link") {
      const strong = document.createElement("strong");
      editable(strong, item.title || "链接", (v) => { item.title = v; saveQuiet(); });
      const span = document.createElement("span");
      span.style.display = "block";
      span.style.marginTop = "6px";
      span.style.color = "var(--mute)";
      editable(span, item.caption || item.href || "", (v) => { item.caption = v; saveQuiet(); });
      wrap.appendChild(strong);
      wrap.appendChild(span);
      wrap.addEventListener("click", () => {
        if (state.edit) return;
        if (item.href) window.open(item.href, "_blank", "noopener");
      });
    } else {
      const media = document.createElement("div");
      media.className = "shot-media";
      const src = mediaSrc(item);
      if (item.type === "video" && src && /\.(mp4|webm)$/i.test(src)) {
        const v = document.createElement("video");
        v.src = src;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.autoplay = true;
        media.appendChild(v);
      } else if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = item.title || "";
        img.loading = "lazy";
        media.appendChild(img);
      } else {
        const ph = document.createElement("div");
        ph.style.cssText = "aspect-ratio:4/5;display:grid;place-items:center;color:#9aa;background:#f3f6f8;font-size:13px;";
        ph.textContent = "双击添加媒体";
        media.appendChild(ph);
      }
      wrap.appendChild(media);

      if (item.title || item.caption || state.edit) {
        const meta = document.createElement("div");
        meta.className = "meta";
        const strong = document.createElement("strong");
        editable(strong, item.title || "", (v) => { item.title = v; saveQuiet(); });
        const span = document.createElement("span");
        editable(span, item.caption || "", (v) => { item.caption = v; saveQuiet(); });
        meta.appendChild(strong);
        meta.appendChild(span);
        wrap.appendChild(meta);
      }

      wrap.addEventListener("click", (e) => {
        if (state.edit) {
          if (e.target.closest("button,[contenteditable]")) return;
          state.selectedMedia = item;
          toast("已选中 · ⌘C 复制 / ⌘V 粘贴替换");
          return;
        }
        if (e.target.closest("button")) return;
        const s = mediaSrc(item);
        if (!s) return;
        if (item.href && e.metaKey) {
          window.open(item.href, "_blank", "noopener");
          return;
        }
        openLightbox(s, item.type === "video" ? "video" : "image");
      });

      wrap.addEventListener("dblclick", (e) => {
        if (!state.edit) return;
        if (e.target.closest("button,[contenteditable]")) return;
        state.replaceTarget = item;
        fileImage.click();
      });
    }

    return wrap;
  }

  function saveQuiet() {
    pushHistory();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.site));
    } catch (err) {
      console.warn(err);
      toast("本机存储空间不足（视频太大时常见）。可先导出 JSON，或换更小的文件。");
    }
  }

  function renderHome() {
    const home = state.site.home;
    const view = document.createElement("section");
    view.className = "view active";
    view.id = "view-home";

    const hero = document.createElement("div");
    hero.className = "home-hero";
    hero.innerHTML = `<div class="skyband"></div>`;

    const grid = document.createElement("div");
    grid.className = "home-grid";

    const copy = document.createElement("div");
    copy.className = "home-copy";
    const tag = document.createElement("div");
    tag.className = "tag";
    editable(tag, home.tag || "Design Share", (v) => { home.tag = v; saveQuiet(); });
    const h1 = document.createElement("h1");
    editable(h1, home.headline || "", (v) => { home.headline = v; saveQuiet(); });
    const sub = document.createElement("div");
    sub.className = "sub";
    editable(sub, home.sub || "", (v) => { home.sub = v; saveQuiet(); });

    const btns = document.createElement("div");
    btns.className = "album-btns";
    (home.albums || []).forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "album-btn";
      b.innerHTML = `<strong></strong><span></span>`;
      editable(b.querySelector("strong"), a.label, (v) => { a.label = v; saveQuiet(); });
      editable(b.querySelector("span"), a.hint || "", (v) => { a.hint = v; saveQuiet(); });
      b.addEventListener("click", (e) => {
        if (state.edit && (e.target === b.querySelector("strong") || e.target === b.querySelector("span"))) return;
        go(a.id);
      });
      btns.appendChild(b);
    });

    copy.append(tag, h1, sub, btns);

    const visual = document.createElement("div");
    visual.className = "home-visual";
    const g = home.heroGuide || {};
    const guide = document.createElement("div");
    guide.className = "guide-card";
    guide.style.backgroundImage = g.src ? `url("${g.src}")` : "";
    guide.innerHTML = `<div class="badge"></div><div class="cap"><strong></strong><span></span></div>`;
    editable(guide.querySelector(".badge"), g.badge || "", (v) => { g.badge = v; saveQuiet(); });
    editable(guide.querySelector("strong"), g.title || "", (v) => { g.title = v; saveQuiet(); });
    editable(guide.querySelector(".cap span"), g.caption || "", (v) => { g.caption = v; saveQuiet(); });
    guide.addEventListener("click", () => { if (!state.edit && g.src) openLightbox(g.src); });
    guide.addEventListener("dblclick", () => {
      if (!state.edit) return;
      state.replaceTarget = g;
      fileImage.click();
    });

    const jars = document.createElement("div");
    jars.className = "home-jars";
    (home.jars || []).forEach((j) => {
      const jar = document.createElement("div");
      jar.className = "jar";
      jar.innerHTML = `<div class="pic">${j.locked ? '<div class="lock">🔒</div>' : ""}</div><div class="meta"><b></b><div class="price"></div></div>`;
      jar.querySelector(".pic").style.backgroundImage = j.src ? `url("${j.src}")` : "";
      editable(jar.querySelector("b"), j.title || "", (v) => { j.title = v; saveQuiet(); });
      editable(jar.querySelector(".price"), j.price || "", (v) => { j.price = v; saveQuiet(); });
      jar.querySelector(".pic").addEventListener("click", () => { if (!state.edit && j.src) openLightbox(j.src); });
      jar.querySelector(".pic").addEventListener("dblclick", () => {
        if (!state.edit) return;
        state.replaceTarget = j;
        fileImage.click();
      });
      jars.appendChild(jar);
    });

    visual.innerHTML = `
      <div class="deco-pin">🐬</div>
      <div class="deco-plate">WHYKIIIKIII\nSTATE BEACH</div>
      <div class="deco-cam">📷</div>
      <div class="deco-note">boarding\npass inside →</div>
    `;
    visual.prepend(guide);
    visual.appendChild(jars);

    grid.append(copy, visual);
    hero.appendChild(grid);

    const foot = document.createElement("div");
    foot.className = "home-footer";
    const seals = document.createElement("div");
    seals.className = "seals";
    (home.seals || []).forEach((s) => {
      const el = document.createElement("div");
      el.className = "seal";
      el.textContent = s;
      seals.appendChild(el);
    });
    foot.appendChild(seals);
    hero.appendChild(foot);

    view.appendChild(hero);
    return view;
  }

  function renderJamsPage() {
    const page = ensureJamsShop(state.site.pages.jams);
    if (state.productId) {
      const prod = findJamsProduct(state.productId);
      if (prod) return renderJamsProduct(page, prod);
      state.productId = null;
    }

    const view = document.createElement("section");
    view.className = "view active";
    const wrap = document.createElement("div");
    wrap.className = "shop-page";

    const top = document.createElement("div");
    top.className = "shop-top";
    const brand = document.createElement("div");
    brand.className = "shop-brand";
    brand.innerHTML = `<span class="dolphin">🐬</span><div><div class="shop-name"></div><small>Dancing Alone ♥</small></div>`;
    editable(brand.querySelector(".shop-name"), page.shopName || "KiiiKiii Garage Sale", (v) => {
      page.shopName = v; saveQuiet();
    });
    const mini = document.createElement("div");
    mini.className = "shop-mini-nav";
    ["Home", "Sellers", "Social", "Newsletter"].forEach((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      mini.appendChild(s);
    });
    top.append(brand, mini);

    const heading = document.createElement("h1");
    heading.className = "shop-heading";
    editable(heading, page.title || "Items", (v) => { page.title = v; saveQuiet(); });

    const toolbar = document.createElement("div");
    toolbar.className = "pd-toolbar";
    toolbar.style.marginBottom = "18px";
    if (state.edit) {
      const add = document.createElement("button");
      add.type = "button"; add.className = "tab"; add.textContent = "+ 商品";
      add.addEventListener("click", () => {
        state.replaceTarget = { __jamsNewProduct: true };
        fileImage.click();
      });
      const place = document.createElement("button");
      place.type = "button"; place.className = "tab";
      place.textContent = state.placingText ? "取消放置文字" : "+ 空白处加文字";
      place.addEventListener("click", () => {
        state.placingText = !state.placingText;
        render();
      });
      toolbar.append(add, place);
    }

    const grid = document.createElement("div");
    grid.className = "shop-grid";
    page.products.forEach((prod, pi) => {
      const card = document.createElement("article");
      card.className = "product-card" + (prod.locked ? " locked" : "");
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      if (prod.cover) thumb.style.backgroundImage = `url("${prod.cover}")`;
      const pname = document.createElement("div");
      pname.className = "pname";
      editable(pname, prod.title || "", (v) => { prod.title = v; saveQuiet(); });
      const pseller = document.createElement("div");
      pseller.className = "pseller";
      pseller.append("By ");
      const sellerEm = document.createElement("em");
      editable(sellerEm, prod.seller || "", (v) => { prod.seller = v; saveQuiet(); });
      pseller.appendChild(sellerEm);
      const pprice = document.createElement("div");
      pprice.className = "pprice";
      const priceLabel = document.createElement("span");
      priceLabel.textContent = "Price: ";
      const priceVal = document.createElement("span");
      editable(priceVal, prod.price || "", (v) => { prod.price = v; saveQuiet(); });
      pprice.append(priceLabel, priceVal);
      card.append(thumb, pname, pseller, pprice);

      if (state.edit) {
        const hint = document.createElement("span");
        hint.className = "drag-hint";
        hint.textContent = "⋮⋮ 拖排序";
        card.appendChild(hint);

        card.draggable = true;
        card.addEventListener("dragstart", (e) => {
          if (e.target.closest("button,[contenteditable]")) {
            e.preventDefault();
            return;
          }
          state.dragFrom = pi;
          card.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(pi));
        });
        card.addEventListener("dragend", () => {
          card.classList.remove("dragging");
          state.dragFrom = null;
          document.querySelectorAll(".product-card.drag-over").forEach((el) => el.classList.remove("drag-over"));
        });
        card.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          card.classList.add("drag-over");
        });
        card.addEventListener("dragleave", () => card.classList.remove("drag-over"));
        card.addEventListener("drop", (e) => {
          e.preventDefault();
          card.classList.remove("drag-over");
          const from = Number(e.dataTransfer.getData("text/plain"));
          if (Number.isNaN(from) || from === pi) return;
          const [moved] = page.products.splice(from, 1);
          page.products.splice(pi, 0, moved);
          saveQuiet();
          render();
          toast("已调整商品顺序");
        });

        const tools = document.createElement("div");
        tools.style.cssText = "display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;";
        const up = document.createElement("button");
        up.type = "button"; up.className = "tab"; up.textContent = "↑";
        up.title = "前移";
        up.addEventListener("click", (e) => {
          e.stopPropagation();
          if (pi <= 0) return;
          page.products.splice(pi - 1, 0, page.products.splice(pi, 1)[0]);
          saveQuiet();
          render();
        });
        const down = document.createElement("button");
        down.type = "button"; down.className = "tab"; down.textContent = "↓";
        down.title = "后移";
        down.addEventListener("click", (e) => {
          e.stopPropagation();
          if (pi >= page.products.length - 1) return;
          page.products.splice(pi + 1, 0, page.products.splice(pi, 1)[0]);
          saveQuiet();
          render();
        });
        const open = document.createElement("button");
        open.type = "button"; open.className = "tab"; open.textContent = "进详情";
        open.addEventListener("click", (e) => {
          e.stopPropagation();
          go("jams", prod.id);
        });
        const cover = document.createElement("button");
        cover.type = "button"; cover.className = "tab"; cover.textContent = "换封面";
        cover.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = { __jamsCover: true, product: prod };
          fileImage.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "tab danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          page.products.splice(pi, 1);
          saveQuiet();
          render();
        });
        tools.append(up, down, open, cover, del);
        card.appendChild(tools);
        thumb.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          state.replaceTarget = { __jamsCover: true, product: prod };
          fileImage.click();
        });
      } else {
        card.addEventListener("click", () => go("jams", prod.id));
      }
      grid.appendChild(card);
    });

    wrap.append(top, heading);
    if (state.edit) wrap.appendChild(toolbar);
    wrap.appendChild(grid);
    attachFloats(wrap, page);
    view.appendChild(wrap);
    return view;
  }

  function renderJamsProduct(page, prod) {
    const view = document.createElement("section");
    view.className = "view active";
    const wrap = document.createElement("div");
    wrap.className = "product-detail";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "pd-back";
    back.textContent = "← Items";
    back.addEventListener("click", () => go("jams"));

    const protect = document.createElement("div");
    protect.className = "pd-protect";
    protect.innerHTML = `<span class="shield">🛡️</span><span class="prot-text"></span>`;
    editable(protect.querySelector(".prot-text"), page.protection || "", (v) => {
      page.protection = v; saveQuiet();
    });

    const title = document.createElement("h1");
    title.className = "pd-title";
    editable(title, page.detailTitle || "Product Details", (v) => {
      page.detailTitle = v; saveQuiet();
    });

    const meta = document.createElement("div");
    meta.style.cssText = "text-align:center;margin:-12px 0 22px;font-family:var(--display);color:#8b3a32;";
    const mt = document.createElement("div");
    editable(mt, prod.title || "", (v) => { prod.title = v; saveQuiet(); });
    mt.style.cssText = "font-size:20px;text-decoration:underline;text-underline-offset:3px;margin-bottom:4px;";
    const ms = document.createElement("div");
    editable(ms, `By ${prod.seller || ""} · ${prod.price || ""}`, (v) => {
      // allow free edit of combined line into seller only if needed — split lightly
      prod.seller = v.replace(/^By\s*/i, "").split("·")[0].trim();
      saveQuiet();
    });
    ms.style.fontSize = "14px";
    meta.append(mt, ms);

    const toolbar = document.createElement("div");
    toolbar.className = "pd-toolbar";
    if (state.edit) {
      const add = document.createElement("button");
      add.type = "button"; add.className = "tab"; add.textContent = "+ 概念照";
      add.addEventListener("click", () => {
        state.replaceTarget = { __jamsDetail: true, product: prod };
        fileImage.click();
      });
      const place = document.createElement("button");
      place.type = "button"; place.className = "tab";
      place.textContent = state.placingText ? "取消放置文字" : "+ 空白处加文字";
      place.addEventListener("click", () => {
        state.placingText = !state.placingText;
        render();
      });
      const hint = document.createElement("span");
      hint.style.cssText = "font-size:12px;color:#667;align-self:center;";
      hint.textContent = "选中图后 ⌘C / ⌘V · 拖右下角缩放（露出原图）";
      toolbar.append(add, place, hint);
    }

    const stack = document.createElement("div");
    stack.className = "pd-stack";
    (prod.details || []).forEach((d, di) => {
      stack.appendChild(freeFrameEl(d, prod.details, di));
    });

    wrap.append(back, protect, title, meta);
    if (state.edit) wrap.appendChild(toolbar);
    wrap.appendChild(stack);
    attachFloats(wrap, prod);
    view.appendChild(wrap);
    return view;
  }

  function renderGalleryPage(key) {
    const page = state.site.pages[key];
    ensureFloats(page);
    const view = document.createElement("section");
    view.className = "view active";

    const wrap = document.createElement("div");
    wrap.className = "gallery-wrap";
    wrap.style.cssText = "position:relative;min-height:60vh;";

    const head = document.createElement("div");
    head.className = "page-head";
    const eye = document.createElement("div");
    eye.className = "eyebrow";
    editable(eye, page.eyebrow || "", (v) => { page.eyebrow = v; saveQuiet(); });
    const h1 = document.createElement("h1");
    editable(h1, page.title || "", (v) => { page.title = v; saveQuiet(); });
    const intro = document.createElement("div");
    intro.className = "intro";
    editable(intro, page.intro || "", (v) => { page.intro = v; saveQuiet(); });
    head.append(eye, h1, intro);

    if (state.edit) {
      const bar = document.createElement("div");
      bar.className = "pd-toolbar";
      bar.style.cssText = "display:flex;padding:0 6vw 8px;max-width:1180px;margin:0 auto;";
      const place = document.createElement("button");
      place.type = "button"; place.className = "tab";
      place.textContent = state.placingText ? "取消放置文字" : "+ 空白处加文字";
      place.addEventListener("click", () => {
        state.placingText = !state.placingText;
        render();
      });
      bar.appendChild(place);
      wrap.appendChild(bar);
    }

    const masonry = document.createElement("div");
    masonry.className = "masonry";
    (page.items || []).forEach((item, idx) => {
      masonry.appendChild(shotEl(item, page.items, idx));
    });

    wrap.append(head, masonry);
    attachFloats(wrap, page);
    view.appendChild(wrap);
    return view;
  }

  function renderTalk() {
    const page = ensureTalk(state.site.pages.talk);
    const view = document.createElement("section");
    view.className = "view active";

    const head = document.createElement("div");
    head.className = "page-head";
    const eye = document.createElement("div");
    eye.className = "eyebrow";
    editable(eye, page.eyebrow || "", (v) => { page.eyebrow = v; saveQuiet(); });
    const h1 = document.createElement("h1");
    editable(h1, page.title || "", (v) => { page.title = v; saveQuiet(); });
    const intro = document.createElement("div");
    intro.className = "intro";
    editable(intro, page.intro || "", (v) => { page.intro = v; saveQuiet(); });
    head.append(eye, h1, intro);
    view.appendChild(head);

    const mkSectionHead = (titleKey, introKey, titleFallback, introFallback, listKey) => {
      const block = document.createElement("div");
      block.className = "section-block";
      const h2 = document.createElement("h2");
      editable(h2, page[titleKey] || titleFallback, (v) => { page[titleKey] = v; saveQuiet(); });
      block.appendChild(h2);
      const introText = page[introKey] != null ? page[introKey] : introFallback;
      if (introText || state.edit) {
        const p = document.createElement("p");
        editable(p, introText || "", (v) => { page[introKey] = v; saveQuiet(); });
        block.appendChild(p);
      }
      if (state.edit) {
        const bar = document.createElement("div");
        bar.className = "talk-toolbar";
        const add = document.createElement("button");
        add.type = "button";
        add.className = "tab";
        add.textContent = "+ 图片";
        add.addEventListener("click", () => {
          state.replaceTarget = { __talkAdd: true, listKey };
          fileImage.click();
        });
        bar.appendChild(add);
        block.appendChild(bar);
      }
      return block;
    };

    // --- Crew ---
    view.appendChild(mkSectionHead("crewTitle", "crewIntro", "kiiikiii团队核心人物", "视觉 / 摄影 / 造型", "crew"));
    const crew = document.createElement("div");
    crew.className = "crew-grid";
    (page.crew || []).forEach((c, ci) => {
      ensureFrame(c);
      if (typeof c.frame.w !== "number") c.frame.w = 100;
      const card = document.createElement("article");
      card.className = "person talk-card";
      const mediaWrap = document.createElement("div");
      mediaWrap.className = "talk-media";
      mediaWrap.style.width = `${clamp(c.frame.w, 40, 100)}%`;
      const pic = document.createElement("div");
      pic.className = "pic";
      if (c.src) pic.style.backgroundImage = `url("${c.src}")`;
      mediaWrap.appendChild(pic);
      const body = document.createElement("div");
      body.className = "body";
      const b = document.createElement("b");
      const span = document.createElement("span");
      editable(b, c.name || "", (v) => { c.name = v; saveQuiet(); });
      editable(span, c.role || "", (v) => { c.role = v; saveQuiet(); });
      body.append(b, span);
      card.append(mediaWrap, body);

      pic.addEventListener("click", () => { if (!state.edit && c.src) openLightbox(c.src); });
      pic.addEventListener("dblclick", () => {
        if (!state.edit) return;
        state.replaceTarget = c;
        state.selectedMedia = c;
        fileImage.click();
      });

      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "talk-card-tools";
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换图";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = c;
          state.selectedMedia = c;
          fileImage.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          page.crew.splice(ci, 1);
          saveQuiet();
          render();
        });
        tools.append(repl, del);
        card.appendChild(tools);

        const se = document.createElement("div");
        se.className = "rh rh-se";
        se.title = "拖角等比缩放";
        const startResize = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = c.frame.w;
          const onMove = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            c.frame.w = clamp(startW + (dx + dy) * 0.35, 40, 100);
            mediaWrap.style.width = `${c.frame.w}%`;
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveQuiet();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        };
        se.addEventListener("pointerdown", startResize);
        mediaWrap.appendChild(se);
        mediaWrap.style.position = "relative";
      }
      crew.appendChild(card);
    });
    view.appendChild(crew);

    // --- Gear ---
    view.appendChild(mkSectionHead("gearTitle", "gearIntro", "kiiikiii同款设备分享", "", "gear"));
    const gear = document.createElement("div");
    gear.className = "gear-grid";
    (page.gear || []).forEach((g, gi) => {
      const card = document.createElement("article");
      card.className = "gear talk-card";
      card.innerHTML = `<div class="pic"></div><div class="body"><b></b><span></span></div>`;
      card.querySelector(".pic").style.backgroundImage = g.src ? `url("${g.src}")` : "";
      editable(card.querySelector("b"), g.title || "", (v) => { g.title = v; saveQuiet(); });
      editable(card.querySelector("span"), g.caption || "", (v) => { g.caption = v; saveQuiet(); });
      card.querySelector(".pic").addEventListener("click", () => { if (!state.edit && g.src) openLightbox(g.src); });
      card.querySelector(".pic").addEventListener("dblclick", () => {
        if (!state.edit) return;
        state.replaceTarget = g;
        state.selectedMedia = g;
        fileImage.click();
      });
      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "talk-card-tools";
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换图";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = g;
          fileImage.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          page.gear.splice(gi, 1);
          saveQuiet();
          render();
        });
        tools.append(repl, del);
        card.appendChild(tools);
      }
      gear.appendChild(card);
    });
    view.appendChild(gear);

    // --- Nostalgia ---
    const nos = page.nostalgia || { title: "互动 · 回忆杀", intro: "", items: [] };
    page.nostalgia = nos;
    const nosBlock = document.createElement("div");
    nosBlock.className = "section-block";
    const nh = document.createElement("h2");
    editable(nh, nos.title || "互动 · 回忆杀", (v) => { nos.title = v; saveQuiet(); });
    const np = document.createElement("p");
    editable(np, nos.intro || "", (v) => { nos.intro = v; saveQuiet(); });
    nosBlock.append(nh, np);
    if (state.edit) {
      const bar = document.createElement("div");
      bar.className = "talk-toolbar";
      const add = document.createElement("button");
      add.type = "button"; add.className = "tab"; add.textContent = "+ 图片";
      add.addEventListener("click", () => {
        state.replaceTarget = { __talkAdd: true, listKey: "nostalgia" };
        fileImage.click();
      });
      bar.appendChild(add);
      nosBlock.appendChild(bar);
    }
    view.appendChild(nosBlock);

    const nostalgia = document.createElement("div");
    nostalgia.className = "nostalgia-grid";
    (nos.items || []).forEach((n, ni) => {
      const card = document.createElement("article");
      card.className = "memory talk-card memory-pic-only";
      const pic = document.createElement("div");
      pic.className = "pic";
      if (n.src) pic.style.backgroundImage = `url("${n.src}")`;
      card.appendChild(pic);
      pic.addEventListener("click", () => { if (!state.edit && n.src) openLightbox(n.src); });
      pic.addEventListener("dblclick", () => {
        if (!state.edit) return;
        state.replaceTarget = n;
        fileImage.click();
      });
      if (state.edit) {
        const tools = document.createElement("div");
        tools.className = "talk-card-tools";
        const repl = document.createElement("button");
        repl.type = "button"; repl.textContent = "换图";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = n;
          fileImage.click();
        });
        const del = document.createElement("button");
        del.type = "button"; del.className = "danger"; del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          nos.items.splice(ni, 1);
          saveQuiet();
          render();
        });
        tools.append(repl, del);
        card.appendChild(tools);
      }
      nostalgia.appendChild(card);
    });
    view.appendChild(nostalgia);

    // --- Thanks + QR ---
    const thanks = page.thanks || { text: "谢谢观看，请给个好评～", qr: "assets/imported/talk/thanks-qr.jpg" };
    page.thanks = thanks;
    if (typeof thanks.qrW !== "number") thanks.qrW = 220;
    const thanksBlock = document.createElement("div");
    thanksBlock.className = "talk-thanks";
    const thanksText = document.createElement("div");
    thanksText.className = "talk-thanks-text";
    editable(thanksText, thanks.text || "谢谢观看，请给个好评～", (v) => { thanks.text = v; saveQuiet(); });
    const thanksQr = document.createElement("div");
    thanksQr.className = "talk-thanks-qr";
    thanksQr.style.setProperty("--qr-w", `${clamp(thanks.qrW, 120, 560)}px`);
    const qrImg = document.createElement("img");
    qrImg.src = thanks.qr || "assets/imported/talk/thanks-qr.jpg";
    qrImg.alt = "二维码";
    thanksQr.appendChild(qrImg);
    if (state.edit) {
      const qrTools = document.createElement("div");
      qrTools.className = "talk-card-tools";
      const repl = document.createElement("button");
      repl.type = "button"; repl.textContent = "换二维码";
      repl.addEventListener("click", () => {
        state.replaceTarget = { __talkQr: true };
        fileImage.click();
      });
      qrTools.appendChild(repl);
      thanksQr.appendChild(qrTools);
      qrImg.addEventListener("dblclick", () => {
        state.replaceTarget = { __talkQr: true };
        fileImage.click();
      });
    }

    const se = document.createElement("div");
    se.className = "rh rh-se";
    se.title = "拖角等比缩放";
    const startResize = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = thanks.qrW;
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        thanks.qrW = clamp(startW + (dx + dy) * 0.55, 120, 560);
        thanksQr.style.setProperty("--qr-w", `${thanks.qrW}px`);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        saveQuiet();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
    se.addEventListener("pointerdown", startResize);
    thanksQr.appendChild(se);
    thanksBlock.append(thanksText, thanksQr);
    view.appendChild(thanksBlock);

    return view;
  }

  function ensureTalk(page) {
    if (!page) return page;
    if (!page.crewTitle) page.crewTitle = "kiiikiii团队核心人物";
    if (page.crewIntro == null) page.crewIntro = "视觉 / 摄影 / 造型";
    if (!page.gearTitle) page.gearTitle = "kiiikiii同款设备分享";
    if (
      page.gearIntro == null
      || page.gearIntro === "器材合集，可继续替换与补充"
      || page.gearIntro === "机型信息可点文字编辑"
    ) page.gearIntro = "";
    if (!Array.isArray(page.crew)) page.crew = [];
    if (!Array.isArray(page.gear)) page.gear = [];
    page.crew.forEach((c) => {
      ensureFrame(c);
      if (typeof c.frame.w !== "number") c.frame.w = 100;
    });
    if (!page.nostalgia) page.nostalgia = { title: "互动 · 回忆杀", intro: "", items: [] };
    if (!Array.isArray(page.nostalgia.items)) page.nostalgia.items = [];
    if (!page.thanks) {
      page.thanks = {
        text: "谢谢观看，请给个好评～",
        qr: "assets/imported/talk/thanks-qr.jpg"
      };
    }
    if (!page.thanks.qr) page.thanks.qr = "assets/imported/talk/thanks-qr.jpg";
    if (page.thanks.text == null) page.thanks.text = "谢谢观看，请给个好评～";
    if (typeof page.thanks.qrW !== "number") page.thanks.qrW = 220;
    return page;
  }

  function renderSide() {
    const box = $("#sidePageMeta");
    if (!box) return;
    const labels = {
      home: "首页 · 可改大标题与三张专辑按钮",
      jams: state.productId
        ? "Jams 详情 · 大图概念照 · 拖角缩放 / 粘贴换图"
        : "Jams · 货架可拖卡片排序（编辑模式）· 点进详情",
      "404": "404 · 轮播 + 贴纸墙 + Loop + 横滑条 + 双页书本",
      guides: "Guides · 右侧按钮切换主题图文；可新增主题 / 图片 / 视频",
      talk: "Talk · 团队核心人物 / 同款设备 / 回忆杀 / 好评二维码"
    };
    box.innerHTML = `<div class="note">${labels[state.page] || ""}</div>`;
  }

  function defaultGuidesPanels() {
    return (window.DEFAULT_SITE?.pages?.guides?.panels) || [];
  }

  function ensureGuides(page) {
    if (!page.panels || !page.panels.length) page.panels = deepClone(defaultGuidesPanels());
    if (typeof page.activePanel !== "number") page.activePanel = 0;
    if (page.activePanel < 0 || page.activePanel >= page.panels.length) page.activePanel = 0;
    page.panels.forEach((p) => {
      if (!p.id) p.id = uid("panel");
      if (!p.style) p.style = "dark";
      if (!p.sections) p.sections = [{ heading: "SECTION", body: "" }];
      if (!Array.isArray(p.items)) p.items = [];
      if (p.button == null) p.button = "Theme";
      if (p.title == null) p.title = "";
      if (p.intro == null) p.intro = "";
      if (p.eyebrow == null) p.eyebrow = "";
    });
    // migrate legacy page.items → first panel once
    const anyPanelItems = page.panels.some((p) => p.items && p.items.length);
    if (!anyPanelItems && page.items && page.items.length) {
      page.panels[0].items = page.items.slice();
    }
    // keep page.items mirrored to active theme (compat + export)
    const active = page.panels[page.activePanel];
    page.items = active.items;
    if (!page.tour) page.tour = {};
    if (!page.tour.title) page.tour.title = "Hey Hi Tour Guide";
    if (typeof page.tour.active !== "number") page.tour.active = 0;
    if (!page.tour.slides || !page.tour.slides.length) {
      const pool = (active.items || []).slice(-6);
      const fallback = [
        "assets/albums/why-kiiikiii/19_kiiikiii_EP最新概念图_13_Adele_estetica.jpg",
        "assets/albums/why-kiiikiii/20_kiiikiii_EP最新概念图_15_Adele_estetica.jpg",
        "assets/albums/why-kiiikiii/21_kiiikiii_EP最新概念图_1_Adele_estetica.jpg",
        "assets/albums/why-kiiikiii/22_kiiikiii_EP最新概念图_6_Adele_estetica.jpg",
        "assets/albums/why-kiiikiii/23_kiiikiii_EP最新概念图_9_Adele_estetica.jpg",
        "assets/albums/why-kiiikiii/26_最懂KiiiKiii美学的_一直是她们自己_1_VSN.jpg"
      ];
      const srcs = pool.length >= 3
        ? pool.map((it) => it.src)
        : fallback;
      const names = ["Jiyu", "Sui", "Haum", "Kya", "Leesol", "Crew"];
      page.tour.slides = srcs.slice(0, 6).map((src, i) => ({
        id: uid("tour"),
        type: "image",
        src: typeof src === "string" ? src : (src || fallback[i] || ""),
        label: `Hey Hi Guide by ${names[i % names.length]}`,
        time: ["08:00 - 12:00", "12:30 - 15:00", "15:30 - 18:00", "18:30 - 21:00", "21:30 - 23:00", "All day"][i] || "",
        caption: ""
      }));
    }
    page.tour.slides.forEach((s) => {
      if (s.label == null) s.label = "";
      if (s.time == null) s.time = "";
      if (s.caption == null) s.caption = "";
    });
    if (page.tour.active < 0 || page.tour.active >= page.tour.slides.length) {
      page.tour.active = 0;
    }
    if (typeof page.tour.interval !== "number") page.tour.interval = 3800;
    if (typeof page.tour.autoplay !== "boolean") page.tour.autoplay = true;
    ensureFloats(page.tour);
    return page;
  }

  function guidesActivePanel(page) {
    ensureGuides(page);
    return page.panels[page.activePanel];
  }

  function guidesActiveItems(page) {
    const panel = guidesActivePanel(page);
    if (!Array.isArray(panel.items)) panel.items = [];
    page.items = panel.items;
    return panel.items;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  const PUZZLE_CYCLE = [
    { cols: 3, rows: 2 }, // 竖半
    { cols: 3, rows: 2 },
    { cols: 4, rows: 1 }, // 横宽
    { cols: 2, rows: 2 }, // 窄竖
    { cols: 6, rows: 2 }, // 单张大图
    { cols: 3, rows: 2 },
    { cols: 3, rows: 1 },
    { cols: 3, rows: 1 }
  ];

  function ensurePuzzle(item, idx = 0) {
    if (!item.puzzle) item.puzzle = { ...PUZZLE_CYCLE[idx % PUZZLE_CYCLE.length] };
    item.puzzle.cols = clamp(Number(item.puzzle.cols) || 3, 1, 6);
    item.puzzle.rows = clamp(Number(item.puzzle.rows) || 2, 1, 6);
    return item.puzzle;
  }

  function applyPuzzleClass(shot, cols, rows) {
    const extra = [
      shot.classList.contains("resizing") ? "resizing" : "",
      shot.classList.contains("dragging") ? "dragging" : ""
    ].filter(Boolean).join(" ");
    shot.className = `guides-shot cols-${cols} rows-${rows}${extra ? " " + extra : ""}`;
  }

  function attachPuzzleResize(shot, item, stack) {
    const dirs = [
      { name: "se" },
      { name: "e" },
      { name: "s" }
    ];
    dirs.forEach(({ name }) => {
      const h = document.createElement("div");
      h.className = `guides-rh guides-rh-${name}`;
      h.title = "拖拽边角放大到铺满";
      h.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pz = ensurePuzzle(item);
        const startX = e.clientX;
        const startY = e.clientY;
        const startCols = pz.cols;
        const startRows = pz.rows;
        // 用固定格子尺寸，避免“越拉越难拉大”
        const cellW = Math.max(20, stack.clientWidth / 6);
        const cellH = Math.max(48, window.innerHeight * 0.22);
        let lastCols = startCols;
        let lastRows = startRows;

        shot.draggable = false;
        shot.classList.add("resizing");
        h.setPointerCapture(e.pointerId);

        const onMove = (ev) => {
          let cols = startCols;
          let rows = startRows;
          // 加一点提前量，更容易拉到满宽/满高
          if (name === "se" || name === "e") {
            cols = clamp(startCols + Math.round((ev.clientX - startX) / cellW), 1, 6);
          }
          if (name === "se" || name === "s") {
            rows = clamp(startRows + Math.round((ev.clientY - startY) / cellH), 1, 6);
          }
          if (cols === lastCols && rows === lastRows) return;
          lastCols = cols;
          lastRows = rows;
          item.puzzle.cols = cols;
          item.puzzle.rows = rows;
          applyPuzzleClass(shot, cols, rows);
          shot.classList.add("resizing");
        };

        const onUp = (ev) => {
          try { h.releasePointerCapture(ev.pointerId); } catch (_) {}
          h.removeEventListener("pointermove", onMove);
          h.removeEventListener("pointerup", onUp);
          h.removeEventListener("pointercancel", onUp);
          shot.classList.remove("resizing");
          shot.draggable = true;
          applyPuzzleClass(shot, item.puzzle.cols, item.puzzle.rows);
          saveQuiet();
        };

        h.addEventListener("pointermove", onMove);
        h.addEventListener("pointerup", onUp);
        h.addEventListener("pointercancel", onUp);
      });
      shot.appendChild(h);
    });
  }

  function applyPuzzlePreset(items, mode) {
    items.forEach((item, idx) => {
      if (mode === "stack") item.puzzle = { cols: 6, rows: 5 };
      else if (mode === "pairs") item.puzzle = { cols: 3, rows: 3 };
      else item.puzzle = { ...PUZZLE_CYCLE[idx % PUZZLE_CYCLE.length] };
    });
  }

  function renderGuidesPage() {
    const page = ensureGuides(state.site.pages.guides);
    const theme = guidesActivePanel(page);
    const items = guidesActiveItems(page);
    items.forEach((item, idx) => ensurePuzzle(item, idx));

    const view = document.createElement("section");
    view.className = "view active";

    const split = document.createElement("div");
    split.className = "guides-split";

    // LEFT: puzzle collage for active theme
    const gallery = document.createElement("div");
    gallery.className = "guides-gallery";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "guides-back";
    back.textContent = "←";
    back.title = "Home";
    back.addEventListener("click", () => go("home"));

    const bar = document.createElement("div");
    bar.className = "guides-puzzle-bar";
    bar.innerHTML = `<span>主题拼图 · ${theme.button || "Guides"}</span>`;
    const mkBarBtn = (label, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.textContent = label;
      b.addEventListener("click", fn);
      return b;
    };
    bar.append(
      mkBarBtn("拼图预设", () => {
        applyPuzzlePreset(items, "puzzle");
        saveQuiet();
        render();
        toast("已套用拼图预设");
      }),
      mkBarBtn("两列竖图", () => {
        applyPuzzlePreset(items, "pairs");
        saveQuiet();
        render();
      }),
      mkBarBtn("全部大图", () => {
        applyPuzzlePreset(items, "stack");
        saveQuiet();
        render();
      }),
      mkBarBtn("全部铺满", () => {
        items.forEach((item) => { item.puzzle = { cols: 6, rows: 5 }; });
        saveQuiet();
        render();
        toast("已全部铺满");
      }),
      mkBarBtn("+ 图片/GIF", () => {
        state.replaceTarget = { __guidesThemeItem: true, prefer: "image" };
        fileImage.click();
      }),
      mkBarBtn("+ 视频", () => {
        state.replaceTarget = { __guidesThemeItem: true, prefer: "video" };
        fileVideo.click();
      })
    );

    const stack = document.createElement("div");
    stack.className = "guides-stack";

    items.forEach((item, idx) => {
      const pz = ensurePuzzle(item, idx);
      const shot = document.createElement("article");
      shot.className = `guides-shot cols-${pz.cols} rows-${pz.rows}`;
      shot.dataset.index = String(idx);

      const media = document.createElement("div");
      media.className = "shot-media";
      const src = mediaSrc(item);
      if (isVideoMedia(item) && src) {
        appendMediaNode(media, item, { cover: true, alt: item.title || "" });
        if (item.poster) {
          /* cover frame shown */
        } else if (!media.querySelector("video, img")) {
          appendMediaNode(media, item, { cover: false, muted: true, loop: true, autoplay: true });
        }
      } else if (src) {
        appendMediaNode(media, item, {
          cover: false, muted: true, loop: true, autoplay: true, lazy: true, alt: item.title || ""
        });
      } else {
        media.style.cssText += "display:grid;place-items:center;color:#99a;font-size:12px;";
        media.textContent = "双击添加";
      }
      shot.appendChild(media);

      if (state.edit) {
        shot.draggable = true;
        shot.addEventListener("dragstart", (e) => {
          if (e.target.closest("button, .guides-rh")) { e.preventDefault(); return; }
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(idx));
          shot.classList.add("dragging");
        });
        shot.addEventListener("dragend", () => {
          shot.classList.remove("dragging");
          document.querySelectorAll(".guides-shot.drag-over").forEach((el) => el.classList.remove("drag-over"));
        });
        shot.addEventListener("dragover", (e) => { e.preventDefault(); shot.classList.add("drag-over"); });
        shot.addEventListener("dragleave", () => shot.classList.remove("drag-over"));
        shot.addEventListener("drop", (e) => {
          e.preventDefault();
          shot.classList.remove("drag-over");
          const from = Number(e.dataTransfer.getData("text/plain"));
          if (Number.isNaN(from) || from === idx) return;
          const [moved] = items.splice(from, 1);
          items.splice(idx, 0, moved);
          saveQuiet();
          render();
          toast("已调整拼图顺序");
        });

        const tools = document.createElement("div");
        tools.className = "shot-tools";

        const addTool = (label, title, on, fn) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.title = title;
          if (on) b.classList.add("on");
          b.addEventListener("click", (e) => {
            e.stopPropagation();
            fn();
            saveQuiet();
            render();
          });
          tools.appendChild(b);
        };

        addTool("竖", "竖图", pz.cols <= 3 && pz.rows >= 2, () => { item.puzzle = { cols: 3, rows: 2 }; });
        addTool("横", "横图", pz.cols >= 4 && pz.rows <= 1, () => { item.puzzle = { cols: 6, rows: 2 }; });
        addTool("满", "铺满左侧", pz.cols === 6 && pz.rows >= 4, () => { item.puzzle = { cols: 6, rows: 5 }; });

        const repl = document.createElement("button");
        repl.type = "button";
        repl.textContent = "换";
        repl.title = "替换图片/GIF";
        repl.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = item;
          fileImage.click();
        });
        tools.appendChild(repl);

        const replVid = document.createElement("button");
        replVid.type = "button";
        replVid.textContent = "视频";
        replVid.title = "替换为视频";
        replVid.addEventListener("click", (e) => {
          e.stopPropagation();
          state.replaceTarget = item;
          fileVideo.click();
        });
        tools.appendChild(replVid);

        const del = document.createElement("button");
        del.type = "button";
        del.className = "danger";
        del.textContent = "删";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          items.splice(idx, 1);
          saveQuiet();
          render();
        });
        tools.appendChild(del);
        shot.appendChild(tools);
        attachPuzzleResize(shot, item, stack);

        shot.addEventListener("dblclick", (e) => {
          if (e.target.closest("button, .guides-rh")) return;
          state.replaceTarget = item;
          fileImage.click();
        });
      } else {
        shot.addEventListener("click", () => {
          if (!src) return;
          const galleryItems = items.filter((it) => it.src).map((it) => ({
            src: it.src,
            type: isVideoMedia(it) ? "video" : "image"
          }));
          const gi = galleryItems.findIndex((g) => g.src === src);
          openLightboxGallery(galleryItems, gi < 0 ? 0 : gi);
        });
      }
      stack.appendChild(shot);
    });

    gallery.append(back, bar, stack);

    // RIGHT: sticky editable rail — theme switcher
    const rail = document.createElement("aside");
    rail.className = "guides-rail";

    const eye = document.createElement("div");
    eye.className = "eyebrow";
    editable(eye, theme.eyebrow || page.eyebrow || "Guides", (v) => {
      theme.eyebrow = v;
      saveQuiet();
    });

    const title = document.createElement("div");
    title.className = "title";
    editable(title, theme.title || page.title || "WhyKiiiKiii", (v) => {
      theme.title = v;
      saveQuiet();
    });

    const lede = document.createElement("div");
    lede.className = "lede";
    editable(lede, theme.intro || page.intro || "", (v) => {
      theme.intro = v;
      saveQuiet();
    });

    const btns = document.createElement("div");
    btns.className = "guides-btns";
    page.panels.forEach((panel, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `guides-btn ${panel.style || "dark"}${page.activePanel === i ? " on" : ""}`;
      editable(btn, panel.button || `Theme ${i + 1}`, (v) => { panel.button = v; saveQuiet(); });
      btn.addEventListener("click", () => {
        if (page.activePanel === i) return;
        page.activePanel = i;
        page.items = page.panels[i].items || [];
        saveQuiet();
        render();
        toast(`切换到「${page.panels[i].button || "主题"}」`);
      });
      btns.appendChild(btn);
    });

    if (state.edit) {
      const row = document.createElement("div");
      row.className = "guides-edit-row";
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "tab";
      addBtn.textContent = "+ 新主题按钮";
      addBtn.addEventListener("click", () => {
        page.panels.push({
          id: uid("panel"),
          button: "New Theme",
          style: page.panels.length % 2 ? "mint" : "dark",
          eyebrow: page.eyebrow || "Guides",
          title: "新主题",
          intro: "在此写主题简介；左侧可插入对应图片 / GIF / 视频。",
          sections: [{ heading: "CONCEPT", body: "编辑这段文字。" }],
          items: []
        });
        page.activePanel = page.panels.length - 1;
        page.items = page.panels[page.activePanel].items;
        saveQuiet();
        render();
        toast("已新增主题按钮");
      });
      const styleBtn = document.createElement("button");
      styleBtn.type = "button";
      styleBtn.className = "tab";
      styleBtn.textContent = "切换按钮色";
      styleBtn.addEventListener("click", () => {
        const p = page.panels[page.activePanel];
        const cycle = ["dark", "mint", "outline"];
        p.style = cycle[(cycle.indexOf(p.style || "dark") + 1) % cycle.length];
        saveQuiet();
        render();
      });
      const addSec = document.createElement("button");
      addSec.type = "button";
      addSec.className = "tab";
      addSec.textContent = "+ 文案段落";
      addSec.addEventListener("click", () => {
        theme.sections.push({ heading: "NEW", body: "" });
        saveQuiet();
        render();
      });
      const delPanel = document.createElement("button");
      delPanel.type = "button";
      delPanel.className = "tab danger";
      delPanel.textContent = "删当前主题";
      delPanel.addEventListener("click", () => {
        if (page.panels.length <= 1) { toast("至少保留一个主题"); return; }
        page.panels.splice(page.activePanel, 1);
        page.activePanel = Math.max(0, page.activePanel - 1);
        page.items = page.panels[page.activePanel].items || [];
        saveQuiet();
        render();
      });
      row.append(addBtn, styleBtn, addSec, delPanel);
      rail.append(eye, title, lede, btns, row);
    } else {
      rail.append(eye, title, lede, btns);
    }

    const sections = document.createElement("div");
    sections.className = "guides-sections";
    (theme.sections || []).forEach((sec, si) => {
      const box = document.createElement("div");
      box.className = "guides-sec";
      const h = document.createElement("h3");
      editable(h, sec.heading || "", (v) => { sec.heading = v; saveQuiet(); });
      const p = document.createElement("p");
      editable(p, sec.body || "", (v) => { sec.body = v; saveQuiet(); });
      box.append(h, p);
      if (state.edit) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "tab";
        del.style.marginTop = "8px";
        del.textContent = "删段落";
        del.addEventListener("click", () => {
          theme.sections.splice(si, 1);
          saveQuiet();
          render();
        });
        box.appendChild(del);
      }
      sections.appendChild(box);
    });
    rail.appendChild(sections);

    const chat = document.createElement("div");
    chat.className = "guides-chat";
    chat.textContent = "💬";
    chat.title = "Guides";
    rail.appendChild(chat);

    split.append(gallery, rail);
    view.appendChild(renderGuidesTour(page));
    view.appendChild(split);
    return view;
  }

  function renderGuidesTour(page) {
    const tour = page.tour;
    const slides = tour.slides || [];
    const active = clamp(tour.active || 0, 0, Math.max(0, slides.length - 1));
    tour.active = active;
    const slide = slides[active] || null;
    clearTourTimer();

    const section = document.createElement("section");
    section.className = "guides-tour";
    const inner = document.createElement("div");
    inner.className = "guides-tour-inner";

    const head = document.createElement("div");
    head.className = "guides-tour-head";
    const eye = document.createElement("div");
    eye.className = "eyebrow";
    editable(eye, tour.eyebrow || "KiiiKiii Travel · WHYKiiiiKIII TOUR", (v) => {
      tour.eyebrow = v; saveQuiet();
    });
    const h2 = document.createElement("h2");
    editable(h2, tour.title || "Hey Hi Tour Guide", (v) => {
      tour.title = v; saveQuiet();
    });
    head.append(eye, h2);

    const toolbar = document.createElement("div");
    toolbar.className = "guides-tour-toolbar";
    if (state.edit) {
      const mk = (label, fn) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "tab"; b.textContent = label;
        b.addEventListener("click", fn);
        return b;
      };
      toolbar.append(
        mk("+ 导览图", () => {
          state.replaceTarget = { __guidesTourSlide: true };
          fileImage.click();
        }),
        mk("换当前大图", () => {
          if (!slide) return;
          state.replaceTarget = slide;
          state.selectedMedia = slide;
          fileImage.click();
        }),
        mk("删当前", () => {
          if (!slides.length) return;
          slides.splice(active, 1);
          tour.active = Math.max(0, active - 1);
          saveQuiet();
          render();
        }),
        mk(tour.autoplay === false ? "开自动轮播" : "停自动轮播", () => {
          tour.autoplay = tour.autoplay === false;
          saveQuiet();
          render();
          toast(tour.autoplay !== false ? "已开启自动轮播" : "已关闭自动轮播");
        }),
        mk(state.placingText ? "取消放置文字" : "+ 空白处加文字", () => {
          state.placingText = !state.placingText;
          render();
        })
      );
    }

    const setTour = (idx, opts = {}) => {
      if (!slides.length) return;
      tour.active = ((idx % slides.length) + slides.length) % slides.length;
      if (!opts.quiet) saveQuiet();
      // Prefer in-place paint so nav / page chrome aren't rebuilt every tick
      if (opts.full || state.edit) render();
      else paintTour();
    };

    const stageWrap = document.createElement("div");
    stageWrap.className = "guides-tour-stage-wrap";

    const prev = document.createElement("button");
    prev.type = "button"; prev.className = "guides-tour-arrow"; prev.textContent = "‹";
    prev.addEventListener("click", () => setTour(tour.active - 1));

    const next = document.createElement("button");
    next.type = "button"; next.className = "guides-tour-arrow"; next.textContent = "›";
    next.addEventListener("click", () => setTour(tour.active + 1));

    const stage = document.createElement("div");
    stage.className = "guides-tour-stage";

    const shelf = document.createElement("div");
    shelf.className = "guides-tour-shelf";
    const thumbs = document.createElement("div");
    thumbs.className = "guides-tour-thumbs";

    const paintTour = () => {
      const i = clamp(tour.active || 0, 0, Math.max(0, slides.length - 1));
      tour.active = i;
      const s = slides[i] || null;
      stage.innerHTML = "";
      stage.style.cursor = "";
      if (s?.src) {
        if (isVideoMedia(s) || (s.type === "video" && /\.(mp4|webm|mov)$/i.test(s.src))) {
          const v = document.createElement("video");
          v.src = s.src; v.controls = true; v.playsInline = true; v.muted = true; v.autoplay = true; v.loop = true;
          if (s.poster) v.poster = s.poster;
          attachReplayChrome(stage, v, {});
        } else {
          const img = document.createElement("img");
          img.src = s.src; img.alt = s.label || "";
          attachReplayChrome(stage, img, {});
        }
      } else {
        const ph = document.createElement("div");
        ph.style.cssText = "display:grid;place-items:center;height:100%;color:#99a;";
        ph.textContent = state.edit ? "添加导览大图" : "暂无导览图";
        stage.appendChild(ph);
      }

      if (s) {
        const time = document.createElement("div");
        time.className = "guides-tour-time";
        editable(time, s.time || "", (v) => { s.time = v; saveQuiet(); });
        stage.appendChild(time);

        const foot = document.createElement("div");
        foot.className = "guides-tour-footer";
        const pager = document.createElement("div");
        pager.className = "guides-tour-pager";
        const dots = document.createElement("div");
        dots.className = "guides-tour-dots";
        slides.forEach((_, di) => {
          const d = document.createElement("span");
          if (di === i) d.classList.add("on");
          dots.appendChild(d);
        });
        const count = document.createElement("span");
        count.textContent = `${i + 1} / ${slides.length || 1}`;
        pager.append(dots, count);

        const label = document.createElement("div");
        label.className = "guides-tour-label";
        editable(label, s.label || "", (v) => { s.label = v; saveQuiet(); });
        foot.append(pager, label);
        stage.appendChild(foot);
      }

      if (state.edit) {
        stage.onclick = (e) => {
          if (e.target.closest("[contenteditable],.guides-tour-time,.guides-tour-label,.media-replay-btn")) return;
          if (s) {
            state.selectedMedia = s;
            toast("已选中导览图 · ⌘C / ⌘V");
          }
        };
        stage.ondblclick = (e) => {
          if (e.target.closest("[contenteditable],.media-replay-btn")) return;
          if (!s) state.replaceTarget = { __guidesTourSlide: true };
          else state.replaceTarget = s;
          fileImage.click();
        };
      } else if (s?.src) {
        stage.onclick = (e) => {
          if (e.target.closest(".media-replay-btn")) return;
          openLightbox(s.src, isVideoMedia(s) ? "video" : "image");
        };
        stage.style.cursor = "zoom-in";
      } else {
        stage.onclick = null;
        stage.ondblclick = null;
      }

      thumbs.querySelectorAll(".guides-tour-thumb").forEach((th, ti) => {
        th.classList.toggle("on", ti === i);
      });
    };

    slides.forEach((s, i) => {
      const th = document.createElement("button");
      th.type = "button";
      th.className = "guides-tour-thumb" + (i === active ? " on" : "");
      if (s.src) {
        const img = document.createElement("img");
        img.src = s.poster || s.src; img.alt = ""; img.loading = "lazy";
        th.appendChild(img);
      }
      th.addEventListener("click", () => setTour(i));
      if (state.edit) {
        th.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          state.replaceTarget = s;
          fileImage.click();
        });
      }
      thumbs.appendChild(th);
    });
    shelf.appendChild(thumbs);

    paintTour();
    if (slides.length > 1) stageWrap.append(prev, stage, next);
    else stageWrap.appendChild(stage);

    // autoplay carousel (pause on hover / edit) — in-place only, never full-page render
    if (slides.length > 1 && tour.autoplay !== false && !state.edit) {
      const startAuto = () => {
        clearTourTimer();
        const ms = clamp(tour.interval || 3800, 1800, 12000);
        state.tourTimer = setInterval(() => {
          if (document.hidden || state.page !== "guides") return;
          tour.active = (tour.active + 1) % slides.length;
          paintTour();
        }, ms);
      };
      startAuto();
      stageWrap.addEventListener("mouseenter", clearTourTimer);
      stageWrap.addEventListener("mouseleave", startAuto);
    }

    inner.append(head);
    if (state.edit) inner.appendChild(toolbar);
    inner.append(stageWrap, shelf);
    attachFloats(inner, tour);
    section.appendChild(inner);
    return section;
  }

  function render() {
    if (state.page !== "404") clearHeroTimer();
    if (state.page !== "guides") clearTourTimer();
    renderNav();
    views.innerHTML = "";
    let view;
    if (state.page === "home") view = renderHome();
    else if (state.page === "jams") view = renderJamsPage();
    else if (state.page === "guides") view = renderGuidesPage();
    else if (state.page === "404") view = render404Page();
    else if (state.page === "talk") view = renderTalk();
    else if (state.site.pages[state.page]) view = renderGalleryPage(state.page);
    else {
      state.page = "home";
      view = renderHome();
    }
    views.appendChild(view);
    renderSide();
  }

  function addItem(type) {
    if (state.page === "404") {
      state.replaceTarget = { __404NewTile: true, prefer: type };
      if (type === "video") fileVideo.click();
      else fileImage.click();
      return;
    }
    if (state.page === "guides") {
      state.replaceTarget = { __guidesThemeItem: true, prefer: type === "video" ? "video" : "image" };
      if (type === "video") fileVideo.click();
      else fileImage.click();
      return;
    }
    if (state.page === "talk") {
      state.replaceTarget = { __talkAdd: true, listKey: "gear" };
      (type === "video" ? fileVideo : fileImage).click();
      return;
    }
    if (state.page === "jams") {
      if (state.productId) {
        const prod = findJamsProduct(state.productId);
        if (prod) {
          state.replaceTarget = { __jamsDetail: true, product: prod };
          (type === "video" ? fileVideo : fileImage).click();
          return;
        }
      }
      state.replaceTarget = { __jamsNewProduct: true };
      (type === "video" ? fileVideo : fileImage).click();
      return;
    }
    const page = state.site.pages[state.page];
    if (!page || !page.items) {
      toast("当前页不支持加媒体（可去 Jams / 404 / Guides）");
      return;
    }
    if (type === "link") {
        page.items.push({
          id: uid("link"),
          type: "link",
          title: "新链接",
          caption: "填写说明",
          href: "https://",
          src: "",
          layout: { size: "m", frame: "auto" }
        });
      saveQuiet();
      render();
      return;
    }
    state.replaceTarget = { __new: true, type, pageKey: state.page };
    (type === "video" ? fileVideo : fileImage).click();
  }

  function onFile(file) {
    if (!file || !state.replaceTarget) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      const target = state.replaceTarget;
      let type = detectFileMediaType(file);
      if (target.prefer === "video" && type !== "video") {
        toast("请选择 mp4 / webm 视频文件");
        state.replaceTarget = null;
        return;
      }
      if (target.prefer === "video") type = "video";

      let poster = "";
      if (type === "video") {
        toast("正在截取封面帧…");
        poster = await captureVideoPoster(dataUrl);
      }

      if (target.__404NewPost) {
        ensure404Posts(state.site.pages["404"]);
        state.site.pages["404"].posts.push({
          id: uid("post"),
          username: "kiiikiii",
          blurb: "新杂志短文，点击可编辑。",
          caption: "新帖文案 ✦ #404",
          likes: 0,
          liked: false,
          time: "just now",
          comments: [],
          slides: [{ id: uid("slide"), type, src: dataUrl, poster }]
        });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已新增帖子");
        return;
      }

      if (target.__404NewTile) {
        ensure404Posts(state.site.pages["404"]);
        const tiles = state.site.pages["404"].tiles;
        tiles.push({
          id: uid("tile"),
          src: dataUrl,
          type,
          poster,
          text: type === "video" ? "视频" : "",
          dot: PIN_DOTS[tiles.length % PIN_DOTS.length]
        });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast(type === "video" ? (poster ? "已添加视频贴纸（封面帧）" : "已添加视频贴纸") : "已添加图片贴纸");
        return;
      }

      if (target.__404HeroSlide) {
        ensure404Posts(state.site.pages["404"]);
        state.site.pages["404"].heroSlides.push({ id: uid("hero"), type, src: dataUrl, poster });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast(type === "video" ? "已加入轮播视频" : "已加入顶部轮播");
        return;
      }

      if (target.__404GifItem) {
        const page = ensure404Posts(state.site.pages["404"]);
        page.gifRow.items.push({
          id: uid("gif"),
          type,
          src: dataUrl,
          poster,
          title: ""
        });
        page.gifRow.activePage = page.gifRow.items.length - 1;
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast(type === "video" ? "已新增视频动图" : "已新增动图");
        return;
      }

      if (target.__404SplitFeature) {
        const page = ensure404Posts(state.site.pages["404"]);
        if (!page.splitRail.features) page.splitRail.features = [];
        page.splitRail.features.push({
          id: uid("split"),
          type,
          src: dataUrl,
          poster
        });
        page.splitRail.feature = page.splitRail.features[0];
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已加入上方动图");
        return;
      }

      if (target.__404SplitItem) {
        const page = ensure404Posts(state.site.pages["404"]);
        page.splitRail.items.push({
          id: uid("split"),
          type,
          src: dataUrl,
          poster
        });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已加入下方横滑图");
        return;
      }

      if (target.__404BookPage) {
        const page = ensure404Posts(state.site.pages["404"]);
        page.book.pages.push({
          id: uid("book"),
          type,
          src: dataUrl,
          poster,
          frame: { w: 70, fit: "contain" },
          floats: []
        });
        page.book.active = Math.floor((page.book.pages.length - 1) / 2);
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已添加书页");
        return;
      }

      if (target.__guidesThemeItem) {
        const page = ensureGuides(state.site.pages.guides);
        const items = guidesActiveItems(page);
        items.push({
          id: uid("guides"),
          type,
          src: dataUrl,
          poster,
          title: "",
          caption: "",
          puzzle: { cols: 3, rows: 2 }
        });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast(type === "video" ? "已加入当前主题视频" : "已加入当前主题图片");
        return;
      }

      if (target.__talkAdd) {
        const page = ensureTalk(state.site.pages.talk);
        const key = target.listKey || "gear";
        if (key === "crew") {
          page.crew.push({
            id: uid("crew"),
            name: "新成员",
            role: "",
            src: dataUrl,
            frame: { w: 100, fit: "contain" }
          });
        } else if (key === "nostalgia") {
          page.nostalgia.items.push({
            id: uid("mem"),
            title: "",
            caption: "",
            src: dataUrl
          });
        } else {
          page.gear.push({
            id: uid("gear"),
            title: "",
            caption: "",
            src: dataUrl
          });
        }
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已添加图片");
        return;
      }

      if (target.__talkQr) {
        const page = ensureTalk(state.site.pages.talk);
        page.thanks.qr = dataUrl;
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已更换二维码");
        return;
      }

      if (target.__guidesTourSlide) {
        const page = ensureGuides(state.site.pages.guides);
        page.tour.slides.push({
          id: uid("tour"),
          type,
          src: dataUrl,
          poster,
          label: "New Guide",
          time: "",
          caption: ""
        });
        page.tour.active = page.tour.slides.length - 1;
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已添加导览图");
        return;
      }

      if (target.__jamsNewProduct) {
        const page = ensureJamsShop(state.site.pages.jams);
        page.products.push({
          id: uid("prod"),
          title: file.name.replace(/\.[^.]+$/, "") || "New Item",
          seller: "kiiikiii",
          price: "1 Soft Landing",
          cover: poster || dataUrl,
          details: [{ id: uid("detail"), type, src: dataUrl, poster, frame: { w: 100, fit: "contain" } }],
          floats: []
        });
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已添加商品");
        return;
      }

      if (target.__jamsCover && target.product) {
        target.product.cover = poster || dataUrl;
        if (target.product.details?.[0]) {
          target.product.details[0].src = dataUrl;
          target.product.details[0].type = type;
          target.product.details[0].poster = poster;
        }
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已更新封面");
        return;
      }

      if (target.__jamsDetail && target.product) {
        target.product.details.push({
          id: uid("detail"), type, src: dataUrl, poster, frame: { w: 100, fit: "contain" }
        });
        if (!target.product.cover) target.product.cover = poster || dataUrl;
        state.replaceTarget = null;
        saveQuiet();
        render();
        toast("已添加概念照");
        return;
      }

      if (target.__igNewSlide) {
        const post = find404Post(target.postId);
        if (post) {
          post.slides.push({ id: uid("slide"), type, src: dataUrl, poster });
          state.ig = { postId: post.id, slide: post.slides.length - 1 };
        }
        state.replaceTarget = null;
        saveQuiet();
        render();
        renderIgModal();
        toast("已添加下一张");
        return;
      }

      if (target.__igSlide) {
        const post = find404Post(target.postId);
        if (post?.slides?.[target.slideIndex]) {
          post.slides[target.slideIndex].src = dataUrl;
          post.slides[target.slideIndex].type = type;
          post.slides[target.slideIndex].poster = poster;
        }
        state.replaceTarget = null;
        saveQuiet();
        render();
        renderIgModal();
        toast("已替换当前图");
        return;
      }

      if (target.__new) {
        const page = state.site.pages[target.pageKey];
        const entry = {
          id: uid("media"),
          type: target.type === "video" || type === "video" ? (type === "video" ? "video" : "image") : type,
          src: dataUrl,
          poster,
          title: file.name.replace(/\.[^.]+$/, ""),
          caption: "",
          href: "",
          layout: { size: "m", frame: "auto" }
        };
        if (target.pageKey === "guides" || target.puzzle) {
          entry.puzzle = target.puzzle || { cols: 3, rows: 2 };
        }
        page.items.push(entry);
      } else {
        target.src = dataUrl;
        target.type = type;
        if (type === "video") target.poster = poster;
        else if ("poster" in target) target.poster = "";
      }
      state.replaceTarget = null;
      saveQuiet();
      render();
      toast(type === "video" ? (poster ? "已替换为视频（已截封面）" : "已替换为视频") : "已替换媒体");
    };
    reader.onerror = () => toast("读取文件失败");
    reader.readAsDataURL(file);
  }

  function bind() {
    $("#btnEdit").addEventListener("click", () => setEdit(true));
    $("#btnView").addEventListener("click", () => setEdit(false));
    $("#fabEdit").addEventListener("click", () => setEdit(true));
    $("#btnSave").addEventListener("click", save);
    $("#btnUndo")?.addEventListener("click", undo);
    $("#btnRedo")?.addEventListener("click", redo);
    $("#btnExport").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state.site, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "kiiikiii-site.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    $("#importFile").addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state.site = scrubSite(JSON.parse(reader.result));
          if (state.site?.pages?.jams) ensureJamsShop(state.site.pages.jams);
          resetHistory();
          saveQuiet();
          render();
          toast("已导入");
        } catch (_) {
          toast("导入失败");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    $("#btnReset").addEventListener("click", () => {
      if (!confirm("恢复默认内容？本机编辑会丢失。")) return;
      localStorage.removeItem(STORAGE_KEY);
      state.site = scrubSite(deepClone(window.DEFAULT_SITE));
      resetHistory();
      render();
      toast("已恢复默认");
    });
    $("#btnAddImage").addEventListener("click", () => addItem("image"));
    $("#btnAddVideo").addEventListener("click", () => addItem("video"));
    $("#btnAddLink").addEventListener("click", () => addItem("link"));
    $("#btnPlaceText")?.addEventListener("click", () => {
      if (!state.edit) {
        setEdit(true);
      }
      state.placingText = !state.placingText;
      render();
      toast(state.placingText ? "点击页面空白处放置文字" : "已取消放置");
    });
    fileImage.addEventListener("change", (e) => {
      onFile(e.target.files?.[0]);
      e.target.value = "";
    });
    fileVideo?.addEventListener("change", (e) => {
      onFile(e.target.files?.[0]);
      e.target.value = "";
    });
    $("#lightboxClose").addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
    lightboxPrev?.addEventListener("click", (e) => {
      e.stopPropagation();
      stepLightbox(-1);
    });
    lightboxNext?.addEventListener("click", (e) => {
      e.stopPropagation();
      stepLightbox(1);
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
    document.addEventListener("paste", (e) => {
      if (!state.edit) return;
      const tag = (e.target && e.target.tagName) || "";
      if (e.target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA") return;
      const items = [...(e.clipboardData?.items || [])];
      const imgItem = items.find((it) => it.type.startsWith("image/"));
      if (imgItem) {
        e.preventDefault();
        const file = imgItem.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => ingestImageDataUrl(reader.result, "image");
        reader.readAsDataURL(file);
        return;
      }
      if (state.clip?.src) {
        e.preventDefault();
        ingestImageDataUrl(state.clip.src, state.clip.type || "image");
      }
    });
    document.addEventListener("copy", (e) => {
      if (!state.edit || !state.selectedMedia?.src) return;
      const tag = (e.target && e.target.tagName) || "";
      if (e.target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA") return;
      state.clip = { src: state.selectedMedia.src, type: state.selectedMedia.type || "image" };
      try {
        e.clipboardData?.setData("text/plain", state.selectedMedia.src);
        e.preventDefault();
      } catch (_) {}
      toast("已复制图片（可 ⌘V 粘贴替换/添加）");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (state.ig) closeIgModal();
        else if (lightbox.classList.contains("open")) closeLightbox();
        if (state.placingText) {
          state.placingText = false;
          render();
        }
      }

      const tag = (e.target && e.target.tagName) || "";
      const typing = e.target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA";

      if (state.ig && !e.metaKey && !e.ctrlKey) {
        const post = find404Post(state.ig.postId);
        const n = post?.slides?.length || 0;
        if (n > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          state.ig.slide = e.key === "ArrowLeft"
            ? (state.ig.slide - 1 + n) % n
            : (state.ig.slide + 1) % n;
          renderIgModal();
          return;
        }
      }

      // 404 photo book keyboard flip
      if (
        state.page === "404" &&
        !state.ig &&
        !lightbox.classList.contains("open") &&
        !e.metaKey && !e.ctrlKey && !e.altKey &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight")
      ) {
        if (!typing) {
          const bookEl = document.querySelector(".mag-book-block");
          if (bookEl && typeof bookEl._flipBook === "function") {
            e.preventDefault();
            bookEl._flipBook(e.key === "ArrowLeft" ? -1 : 1);
            return;
          }
        }
      }

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (typing) return;

      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      } else if (key === "c" && state.edit && state.selectedMedia?.src) {
        state.clip = { src: state.selectedMedia.src, type: state.selectedMedia.type || "image" };
        toast("已复制图片");
      } else if (key === "v" && state.edit && state.clip?.src) {
        // browser paste event also fires for images; this catches internal clip
        e.preventDefault();
        ingestImageDataUrl(state.clip.src, state.clip.type || "image");
      }
    });
    igModal.addEventListener("click", () => closeIgModal());
    document.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", () => go(el.getAttribute("data-go")));
    });
    window.addEventListener("hashchange", () => {
      applyHash();
      clearHeroTimer();
      clearTourTimer();
      render();
    });
  }

  function boot() {
    load();
    applyHash();
    resetHistory();
    bind();
    render();
  }

  boot();
})();
