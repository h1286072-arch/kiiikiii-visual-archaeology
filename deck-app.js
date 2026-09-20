(() => {
  const STORAGE_KEY = "kiiikiii-deck-v2-fusion";
  const NAV_ITEMS = ["Home", "Jams", "Shop", "Guides", "FAQ", "Talk"];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const $ = (id) => document.getElementById(id);
  const pct = (n) => `${n}%`;

  let state = { mode: "edit", index: 0, selectedId: null, deck: null };
  let drag = null;
  let presenterWin = null;
  let presenterTimer = null;
  let presenterStartedAt = 0;
  const deckBus = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("kiiikiii-deck-v1") : null;

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1600);
  }

  function cloneDefault() {
    return JSON.parse(JSON.stringify(window.DEFAULT_DECK));
  }

  function loadDeck() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.slides?.length) {
          state.deck = parsed;
          return;
        }
      }
    } catch (_) {}
    state.deck = cloneDefault();
  }

  function saveSilent() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.deck));
  }

  function saveDeck() {
    saveSilent();
    toast("已保存到本地");
  }

  function currentSlide() {
    return state.deck.slides[state.index];
  }

  function setMode(mode) {
    state.mode = mode;
    document.body.classList.toggle("present", mode === "present");
    $("btnEdit").classList.toggle("active", mode === "edit");
    $("btnPresent").classList.toggle("active", mode === "present");
    state.selectedId = null;
    // never show notes dock on the audience/projector surface
    $("notesDock").classList.remove("open");
    renderAll();
    if (mode === "present") {
      openPresenterWindow(true);
      toast("演讲模式 · 大屏只显示幻灯 · 本机看「演讲者视图」讲稿");
    } else {
      toast("编辑模式");
    }
  }

  function go(delta) {
    const next = state.index + delta;
    if (next < 0 || next >= state.deck.slides.length) return;
    state.index = next;
    state.selectedId = null;
    renderAll();
    broadcastDeck({ type: "index", index: state.index });
  }

  function goTo(index) {
    if (index < 0 || index >= state.deck.slides.length) return;
    state.index = index;
    state.selectedId = null;
    renderAll();
    broadcastDeck({ type: "index", index: state.index });
  }

  function broadcastDeck(msg) {
    try { deckBus?.postMessage(msg); } catch (_) {}
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatElapsed(ms) {
    const sec = Math.floor(ms / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function paintPresenter() {
    const w = presenterWin;
    if (!w || w.closed) {
      presenterWin = null;
      return;
    }
    const s = currentSlide();
    const next = state.deck.slides[state.index + 1];
    const prev = state.deck.slides[state.index - 1];
    const elapsed = presenterStartedAt ? formatElapsed(Date.now() - presenterStartedAt) : "00:00";
    const root = w.document.getElementById("root");
    if (!root) return;
    root.innerHTML = `
      <header class="bar">
        <div>
          <div class="eyebrow">演讲者视图 · 仅本机</div>
          <div class="page">${state.index + 1} / ${state.deck.slides.length}</div>
        </div>
        <div class="timer" id="timer">${elapsed}</div>
      </header>
      <section class="now">
        <h1>${esc(s.title || "未命名")}</h1>
        <pre class="notes">${esc(s.notes || "（本页暂无备注）")}</pre>
      </section>
      <section class="meta">
        <div class="card">
          <div class="label">上一页</div>
          <div class="val">${prev ? esc(prev.title || "未命名") : "—"}</div>
        </div>
        <div class="card">
          <div class="label">下一页</div>
          <div class="val">${next ? esc(next.title || "未命名") : "—"}</div>
        </div>
      </section>
      <footer class="controls">
        <button type="button" data-act="prev">← 上一页</button>
        <button type="button" data-act="next">下一页 →</button>
        <button type="button" data-act="reset-timer">重置计时</button>
      </footer>
      <p class="hint">大屏窗口只播幻灯；在本窗口或大屏按 ← → / 空格均可翻页</p>
    `;
    root.querySelectorAll("[data-act]").forEach((btn) => {
      btn.onclick = () => {
        const act = btn.getAttribute("data-act");
        if (act === "prev") go(-1);
        if (act === "next") go(1);
        if (act === "reset-timer") {
          presenterStartedAt = Date.now();
          paintPresenter();
        }
      };
    });
  }

  function openPresenterWindow(auto = false) {
    if (presenterWin && !presenterWin.closed) {
      try { presenterWin.focus(); } catch (_) {}
      paintPresenter();
      return presenterWin;
    }
    const w = window.open(
      "",
      "kiiikiii-presenter",
      "popup=yes,width=520,height=820,left=40,top=40"
    );
    if (!w) {
      toast(auto ? "请允许弹窗，才能打开本机讲稿窗" : "弹窗被拦截，请允许后重试");
      return null;
    }
    presenterWin = w;
    if (!presenterStartedAt) presenterStartedAt = Date.now();
    w.document.title = "演讲者视图 · 讲稿";
    w.document.head.innerHTML = `<meta charset="UTF-8" /><style>
      *{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,sans-serif;background:#0b0d12;color:#eef2ff}
      #root{min-height:100vh;padding:18px 18px 24px;display:flex;flex-direction:column;gap:14px}
      .bar{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7dd3fc}
      .page{font-size:28px;font-weight:700;margin-top:4px}
      .timer{font-variant-numeric:tabular-nums;font-size:28px;font-weight:600;color:#a5b4fc}
      .now{background:#151821;border:1px solid #2c3140;border-radius:14px;padding:16px;flex:1}
      .now h1{font-size:20px;margin:0 0 12px;line-height:1.3}
      .notes{margin:0;white-space:pre-wrap;line-height:1.65;font-size:17px;font-family:ui-sans-serif,system-ui,sans-serif;color:#e5e7eb}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .card{background:#12151d;border:1px solid #2c3140;border-radius:12px;padding:12px}
      .label{font-size:11px;color:#93c5fd;margin-bottom:6px}
      .val{font-size:13px;color:#cbd5e1;line-height:1.4}
      .controls{display:flex;flex-wrap:wrap;gap:8px}
      .controls button{appearance:none;border:1px solid #334155;background:#1e293b;color:#f8fafc;border-radius:10px;padding:10px 14px;font-size:13px;cursor:pointer}
      .controls button:hover{border-color:#38bdf8}
      .hint{margin:0;font-size:12px;color:#94a3b8;line-height:1.45}
    </style>`;
    w.document.body.innerHTML = `<div id="root"></div>`;
    w.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName || "")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    });
    w.addEventListener("beforeunload", () => {
      if (presenterWin === w) presenterWin = null;
    });
    clearInterval(presenterTimer);
    presenterTimer = setInterval(() => {
      if (!presenterWin || presenterWin.closed) {
        clearInterval(presenterTimer);
        presenterTimer = null;
        return;
      }
      const el = presenterWin.document.getElementById("timer");
      if (el && presenterStartedAt) el.textContent = formatElapsed(Date.now() - presenterStartedAt);
    }, 1000);
    paintPresenter();
    try { w.focus(); } catch (_) {}
    return w;
  }

  function renderThumbs() {
    const box = $("thumbs");
    box.innerHTML = "<h3>Pages</h3>";
    state.deck.slides.forEach((s, i) => {
      const d = document.createElement("div");
      d.className = "thumb" + (i === state.index ? " active" : "");
      d.innerHTML = `<div class="t">${s.title || "未命名"}</div><div class="idx">${i + 1}</div>`;
      d.onclick = () => {
        state.index = i;
        state.selectedId = null;
        renderAll();
      };
      box.appendChild(d);
    });
  }

  function renderChrome() {
    const s = currentSlide();
    const stage = $("stage");
    $("navSmall").textContent = s.navSmall || "Travel · Archaeology";
    $("navDuty").textContent = s.duty || "(Girls) Duty Free";
    $("navLinks").innerHTML = NAV_ITEMS.map(
      (n) => `<li class="${n === (s.navOn || "Home") ? "on" : ""}">${n}</li>`
    ).join("");

    stage.classList.toggle("sky-tall", s.sky === "tall");
    $("skyband").style.display = s.sky === "0" ? "none" : "block";
    stage.style.background = s.bgColor || "#ffffff";
    const bg = $("stageBg");
    if (s.bgImage) {
      bg.style.backgroundImage = `url("${s.bgImage}")`;
    } else {
      bg.style.backgroundImage = "none";
    }

    const seals = (s.seals || "")
      .split("|")
      .map((x) => x.trim())
      .filter(Boolean);
    $("footerSeals").innerHTML = seals.map((t) => `<span class="seal">${t}</span>`).join("");
    $("footerDots").innerHTML = state.deck.slides
      .map((_, i) => `<i class="${i === state.index ? "on" : ""}"></i>`)
      .join("");

    $("pageLabel").textContent = `${state.index + 1} / ${state.deck.slides.length}`;
    $("notesDockTitle").textContent = `${state.index + 1}. ${s.title || ""}`;
    $("notesDockBody").textContent = s.notes || "（本页暂无备注）";
  }

  function renderInspector() {
    const s = currentSlide();
    $("slideTitle").value = s.title || "";
    $("slideNavSmall").value = s.navSmall || "";
    $("slideNavOn").value = s.navOn || "Home";
    $("slideDuty").value = s.duty || "";
    $("slideSeals").value = s.seals || "";
    $("slideSky").value = s.sky === true ? "1" : String(s.sky ?? "1");
    $("slideBgColor").value = s.bgColor || "#ffffff";
    $("slideBgImage").value = s.bgImage || "";
    $("slideNotes").value = s.notes || "";
    $("imgGuide").textContent = "配图：" + (s.imgGuide || "—");

    const el = s.elements.find((e) => e.id === state.selectedId);
    if (!el) {
      $("elPanel").classList.add("hidden");
      $("elHint").classList.remove("hidden");
      return;
    }
    $("elPanel").classList.remove("hidden");
    $("elHint").classList.add("hidden");
    $("imgSwapRow").classList.toggle("hidden", !isImageEl(el));
    $("elFont").value = el.font || "Inter, sans-serif";
    $("elSize").value = el.size || 16;
    $("elColor").value = el.color || "#161616";
    if (el.type === "jar") {
      $("elContent").value = [el.title || "", el.price || "", el.src || "", el.locked ? "locked" : ""].join("\n");
    } else if (el.type === "guide") {
      $("elContent").value = [el.title || "", el.caption || "", el.badge || "", el.src || ""].join("\n");
    } else if (el.type === "image" || el.type === "video") {
      $("elContent").value = el.src || "";
    } else if (el.type === "link") {
      $("elContent").value = `${el.text || ""}\n${el.href || ""}`;
    } else {
      $("elContent").value = el.text || "";
    }
  }

  function makeElNode(el) {
    const node = document.createElement("div");
    node.className = `el ${el.type}` + (el.id === state.selectedId ? " selected" : "");
    node.dataset.id = el.id;
    node.style.left = pct(el.x);
    node.style.top = pct(el.y);
    node.style.width = pct(el.w);
    node.style.height = pct(el.h);
    if (el.color) node.style.color = el.color;
    if (el.font) node.style.fontFamily = el.font;
    if (el.size) node.style.fontSize = el.size + "px";

    if (el.type === "jar") {
      node.innerHTML = `
        <div class="pic" style="background-image:url('${esc(el.src)}')">${el.locked ? '<div class="lock">🔒</div>' : ""}</div>
        <div class="meta"><b>${esc(el.title)}</b><div class="price">${esc(el.price)}</div></div>`;
    } else if (el.type === "guide") {
      node.style.backgroundImage = el.src ? `url("${el.src}")` : "";
      node.innerHTML = `
        <div class="badge">${esc(el.badge || "")}</div>
        <div class="cap"><strong>${esc(el.title || "")}</strong><div>${esc(el.caption || "")}</div></div>`;
    } else if (el.type === "image") {
      node.innerHTML = `<img src="${esc(el.src)}" alt="" />`;
    } else if (el.type === "video") {
      if (/\.gif($|\?)/i.test(el.src || "")) node.innerHTML = `<img src="${esc(el.src)}" alt="" />`;
      else node.innerHTML = `<video src="${esc(el.src)}" muted loop autoplay playsinline></video>`;
    } else if (el.type === "section") {
      node.innerHTML = el.text || "";
    } else if (el.type === "link") {
      node.textContent = "↗ " + (el.text || el.href || "链接");
    } else if (el.type === "pin" || el.type === "cam") {
      node.textContent = el.text || "";
    } else {
      node.textContent = el.text || "";
    }

    const handle = document.createElement("div");
    handle.className = "resize-h";
    node.appendChild(handle);
    node.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointerdown", onResizeDown);

    node.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.mode === "present") {
        if (el.type === "image" || el.type === "guide" || el.type === "jar") openLightbox(el);
        else if (el.type === "link" && el.href) window.open(el.href, "_blank");
        return;
      }
      state.selectedId = el.id;
      renderStage();
      renderInspector();
    });

    node.addEventListener("dblclick", (e) => {
      if (state.mode !== "edit") return;
      e.stopPropagation();
      if (isImageEl(el)) {
        state.selectedId = el.id;
        pickReplaceFile();
        return;
      }
      const editable = ["headline", "sub", "text", "card", "plate", "note-sticker", "pixel", "tag", "section"];
      if (!editable.includes(el.type)) {
        if (el.type === "link") {
          const text = prompt("链接文字", el.text || "");
          const href = prompt("URL", el.href || "https://");
          if (text != null) el.text = text;
          if (href != null) el.href = href;
          saveSilent();
          renderStage();
        }
        return;
      }
      if (el.type === "section") {
        const t = prompt("章节标题（可用 <span class=\"accent\">高亮</span>）", el.text || "");
        if (t != null) {
          el.text = t;
          saveSilent();
          renderStage();
        }
        return;
      }
      node.contentEditable = "true";
      node.classList.add("editing");
      node.focus();
      const finish = () => {
        node.contentEditable = "false";
        node.classList.remove("editing");
        el.text = node.innerText;
        saveSilent();
        renderInspector();
      };
      node.addEventListener("blur", finish, { once: true });
    });

    return node;
  }

  function renderStage() {
    renderChrome();
    const layer = $("layer");
    layer.innerHTML = "";
    currentSlide().elements.forEach((el) => layer.appendChild(makeElNode(el)));
  }

  function renderAll() {
    renderThumbs();
    renderStage();
    renderInspector();
    paintPresenter();
  }

  function openLightbox(el) {
    const box = $("lightbox");
    box.innerHTML = "";
    const src = el.src || "";
    if (!src && el.type !== "jar") return;
    const img = document.createElement("img");
    img.src = src;
    box.appendChild(img);
    box.classList.add("open");
  }
  $("lightbox").addEventListener("click", () => $("lightbox").classList.remove("open"));

  function onPointerDown(e) {
    if (state.mode !== "edit") return;
    if (e.target.classList.contains("resize-h")) return;
    const id = e.currentTarget.dataset.id;
    const el = currentSlide().elements.find((x) => x.id === id);
    if (!el || e.currentTarget.classList.contains("editing")) return;
    state.selectedId = id;
    const rect = $("stage").getBoundingClientRect();
    drag = { kind: "move", id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
    renderStage();
    renderInspector();
  }

  function onResizeDown(e) {
    if (state.mode !== "edit") return;
    e.stopPropagation();
    const node = e.currentTarget.parentElement;
    const id = node.dataset.id;
    const el = currentSlide().elements.find((x) => x.id === id);
    const rect = $("stage").getBoundingClientRect();
    drag = { kind: "resize", id, startX: e.clientX, startY: e.clientY, origW: el.w, origH: el.h, rect };
    node.setPointerCapture(e.pointerId);
    state.selectedId = id;
  }

  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const el = currentSlide().elements.find((x) => x.id === drag.id);
    if (!el) return;
    const dx = ((e.clientX - drag.startX) / drag.rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / drag.rect.height) * 100;
    if (drag.kind === "move") {
      el.x = Math.max(0, Math.min(94, drag.origX + dx));
      el.y = Math.max(8, Math.min(88, drag.origY + dy));
    } else {
      el.w = Math.max(6, Math.min(100 - el.x, drag.origW + dx));
      el.h = Math.max(5, Math.min(92 - el.y, drag.origH + dy));
    }
    const node = $("layer").querySelector(`[data-id="${el.id}"]`);
    if (node) {
      node.style.left = pct(el.x);
      node.style.top = pct(el.y);
      node.style.width = pct(el.w);
      node.style.height = pct(el.h);
    }
  });

  window.addEventListener("pointerup", () => {
    if (!drag) return;
    drag = null;
    saveSilent();
    renderInspector();
  });

  $("stage").addEventListener("click", () => {
    if (state.mode !== "edit") return;
    state.selectedId = null;
    renderStage();
    renderInspector();
  });

  function addElement(type) {
    const base = { id: uid(), type, x: 20, y: 30, w: 24, h: 20, text: "", color: "#161616", font: "Inter, sans-serif", size: 16 };
    const presets = {
      headline: { text: "新标题", w: 40, h: 16, size: 40, font: "Instrument Serif, serif" },
      section: { text: 'Section <span class="accent">Title</span>', w: 40, h: 8, size: 26, font: "Space Grotesk, sans-serif" },
      sub: { text: "说明文字", w: 30, h: 10, size: 13 },
      tag: { text: "Tag", w: 12, h: 4 },
      jar: { title: "New Jam", price: "12.00", src: "assets/xhs/jam_01.webp", w: 16, h: 30 },
      guide: { title: "Guide", caption: "caption", badge: "NEW", src: "assets/ref/ever2late.png", w: 36, h: 40 },
      card: { text: "信息卡", w: 28, h: 28 },
      image: { src: "assets/xhs/style_01.webp", w: 28, h: 40 },
      video: { src: "", w: 36, h: 40 },
      pin: { text: "✌️", w: 7, h: 12 },
      plate: { text: "PLATE\nTEXT", w: 12, h: 10 },
      cam: { text: "📷", w: 9, h: 10 },
      "note-sticker": { text: "note →", w: 10, h: 12 },
      pixel: { text: "PIXEL", w: 14, h: 4 },
      link: { text: "link", href: "https://www.kiiikiii.kr/", w: 18, h: 6 }
    };
    const el = Object.assign(base, presets[type] || {});
    if (type === "image") {
      const local = confirm("确定＝本地上传；取消＝输入路径/URL");
      if (local) {
        $("fileImage").onchange = async (ev) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          el.src = await readFile(file);
          currentSlide().elements.push(el);
          state.selectedId = el.id;
          saveSilent();
          renderAll();
          ev.target.value = "";
        };
        $("fileImage").click();
        return;
      }
      const src = prompt("图片路径", "assets/xhs/");
      if (!src) return;
      el.src = src;
    }
    if (type === "video") {
      const local = confirm("确定＝上传；取消＝输入 URL");
      if (local) {
        $("fileVideo").onchange = async (ev) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          el.src = await readFile(file);
          currentSlide().elements.push(el);
          state.selectedId = el.id;
          saveSilent();
          renderAll();
          ev.target.value = "";
        };
        $("fileVideo").click();
        return;
      }
      const src = prompt("视频/GIF URL", "");
      if (!src) return;
      el.src = src;
    }
    currentSlide().elements.push(el);
    state.selectedId = el.id;
    saveSilent();
    renderAll();
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function selectedEl() {
    return currentSlide().elements.find((e) => e.id === state.selectedId);
  }

  function isImageEl(el) {
    return el && ["jar", "guide", "image", "video"].includes(el.type);
  }

  async function applyImageSrc(el, src) {
    if (!el || !src) return;
    el.src = src;
    saveSilent();
    renderStage();
    renderInspector();
    toast("图片已更换");
  }

  function pickReplaceFile() {
    const el = selectedEl();
    if (!isImageEl(el)) return toast("请先选中果酱卡 / Guides / 图片");
    $("fileReplace").value = "";
    $("fileReplace").click();
  }

  async function pasteReplaceImage() {
    const el = selectedEl();
    if (!isImageEl(el)) return toast("请先选中果酱卡 / Guides / 图片");
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (!type) continue;
        const blob = await item.getType(type);
        const src = await readFile(blob);
        await applyImageSrc(el, src);
        return;
      }
      toast("剪贴板里没有图片，先复制一张图再粘贴");
    } catch (_) {
      toast("无法读剪贴板：请用 ⌘V / Ctrl+V，或点「换本地图」");
    }
  }

  function bindSlide(id, key, transform) {
    $(id).addEventListener("input", (e) => {
      currentSlide()[key] = transform ? transform(e.target.value) : e.target.value;
      if (key === "title") renderThumbs();
      renderStage();
      if (key === "notes") {
        $("notesDockBody").textContent = currentSlide().notes || "";
        paintPresenter();
      }
      if (key === "title") paintPresenter();
      saveSilent();
    });
  }

  // wire UI
  $("btnEdit").onclick = () => setMode("edit");
  $("btnPresent").onclick = () => setMode("present");
  $("btnPrev").onclick = () => go(-1);
  $("btnNext").onclick = () => go(1);
  $("btnSave").onclick = saveDeck;
  $("btnExport").onclick = () => {
    const blob = new Blob([JSON.stringify(state.deck, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kiiikiii-deck-fusion.json";
    a.click();
  };
  $("btnReset").onclick = () => {
    if (!confirm("恢复 fusion 默认讲稿？本地修改会丢失。")) return;
    state.deck = cloneDefault();
    state.index = 0;
    state.selectedId = null;
    saveSilent();
    renderAll();
  };
  $("importFile").onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    state.deck = JSON.parse(await file.text());
    state.index = 0;
    saveSilent();
    renderAll();
    toast("已导入");
  };

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addElement(btn.dataset.add));
  });

  $("btnNewSlide").onclick = () => {
    const s = {
      id: uid(),
      title: "新页面",
      navSmall: "Travel · New",
      navOn: "Talk",
      duty: "(Girls) Duty Free",
      seals: "New Page",
      sky: "1",
      bgColor: "#ffffff",
      bgImage: "",
      notes: "",
      imgGuide: "",
      elements: [
        { id: uid(), type: "section", x: 7, y: 18, w: 50, h: 8, text: 'New <span class="accent">Page</span>', size: 28, font: "Space Grotesk, sans-serif" }
      ]
    };
    state.deck.slides.splice(state.index + 1, 0, s);
    state.index += 1;
    saveSilent();
    renderAll();
  };
  $("btnDupSlide").onclick = () => {
    const copy = JSON.parse(JSON.stringify(currentSlide()));
    copy.id = uid();
    copy.title = (copy.title || "") + " 副本";
    copy.elements.forEach((el) => { el.id = uid(); });
    state.deck.slides.splice(state.index + 1, 0, copy);
    state.index += 1;
    saveSilent();
    renderAll();
  };
  $("btnDelSlide").onclick = () => {
    if (state.deck.slides.length <= 1) return toast("至少保留一页");
    if (!confirm("删除当前页？")) return;
    state.deck.slides.splice(state.index, 1);
    state.index = Math.max(0, state.index - 1);
    state.selectedId = null;
    saveSilent();
    renderAll();
  };

  bindSlide("slideTitle", "title");
  bindSlide("slideNavSmall", "navSmall");
  bindSlide("slideNavOn", "navOn");
  bindSlide("slideDuty", "duty");
  bindSlide("slideSeals", "seals");
  bindSlide("slideSky", "sky");
  bindSlide("slideBgColor", "bgColor");
  bindSlide("slideBgImage", "bgImage");
  bindSlide("slideNotes", "notes");

  $("elFont").onchange = (e) => {
    const el = selectedEl();
    if (!el) return;
    el.font = e.target.value;
    saveSilent();
    renderStage();
  };
  $("elSize").oninput = (e) => {
    const el = selectedEl();
    if (!el) return;
    el.size = +e.target.value || 16;
    saveSilent();
    renderStage();
  };
  $("elColor").oninput = (e) => {
    const el = selectedEl();
    if (!el) return;
    el.color = e.target.value;
    saveSilent();
    renderStage();
  };
  $("elContent").onchange = (e) => {
    const el = selectedEl();
    if (!el) return;
    const v = e.target.value;
    const lines = v.split("\n");
    if (el.type === "jar") {
      el.title = lines[0] || "";
      el.price = lines[1] || "";
      el.src = (lines[2] || el.src || "").trim();
      el.locked = /locked/i.test(lines[3] || "");
    } else if (el.type === "guide") {
      el.title = lines[0] || "";
      el.caption = lines[1] || "";
      el.badge = lines[2] || "";
      el.src = (lines[3] || el.src || "").trim();
    } else if (el.type === "image" || el.type === "video") {
      el.src = v.trim();
    } else if (el.type === "link") {
      el.text = lines[0] || "";
      el.href = (lines[1] || "").trim();
    } else {
      el.text = v;
    }
    saveSilent();
    renderStage();
  };
  $("btnDelEl").onclick = () => {
    const s = currentSlide();
    s.elements = s.elements.filter((e) => e.id !== state.selectedId);
    state.selectedId = null;
    saveSilent();
    renderAll();
  };
  $("btnBringFront").onclick = () => {
    const s = currentSlide();
    const i = s.elements.findIndex((e) => e.id === state.selectedId);
    if (i < 0) return;
    const [el] = s.elements.splice(i, 1);
    s.elements.push(el);
    saveSilent();
    renderStage();
  };

  $("btnSwapFile").onclick = pickReplaceFile;
  $("btnSwapPaste").onclick = pasteReplaceImage;
  $("fileReplace").onchange = async (e) => {
    const file = e.target.files?.[0];
    const el = selectedEl();
    if (!file || !isImageEl(el)) return;
    const src = await readFile(file);
    await applyImageSrc(el, src);
    e.target.value = "";
  };

  window.addEventListener("paste", async (e) => {
    if (state.mode !== "edit") return;
    const tag = e.target?.tagName || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || e.target?.isContentEditable) return;
    const el = selectedEl();
    if (!isImageEl(el)) return;
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (!item) return;
    e.preventDefault();
    const file = item.getAsFile();
    if (!file) return;
    const src = await readFile(file);
    await applyImageSrc(el, src);
  });

  $("btnNotesWindow").onclick = () => openPresenterWindow(false);

  if (deckBus) {
    deckBus.onmessage = (e) => {
      const msg = e.data || {};
      if (msg.type === "go" && typeof msg.delta === "number") go(msg.delta);
      if (msg.type === "goto" && typeof msg.index === "number") goTo(msg.index);
    };
  }

  window.addEventListener("keydown", (e) => {
    const tag = e.target?.tagName || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || e.target?.isContentEditable) return;
    if (e.key === "Escape") {
      if ($("lightbox").classList.contains("open")) $("lightbox").classList.remove("open");
      else if (state.mode === "present") setMode("edit");
      return;
    }
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(-1);
    }
    // N opens presenter notes on THIS machine only — never on the projector surface
    if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      openPresenterWindow(false);
    }
    if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
    if ((e.key === "Backspace" || e.key === "Delete") && state.mode === "edit" && state.selectedId) {
      e.preventDefault();
      $("btnDelEl").click();
    }
  });

  loadDeck();
  renderAll();
})();
