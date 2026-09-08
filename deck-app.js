(() => {
  const STORAGE_KEY = "kiiikiii-deck-v5-album-pages";
  const NAV_ITEMS = ["Home", "Jams", "Shop", "Guides", "FAQ", "Talk"];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const $ = (id) => document.getElementById(id);
  const pct = (n) => `${n}%`;

  let state = { mode: "edit", index: 0, selectedId: null, deck: null };
  let drag = null;
  const MAX_HISTORY = 50;
  let undoStack = [];
  let redoStack = [];
  let applyingHistory = false;
  let thumbDragFrom = null;

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1600);
  }

  function deepSnap() {
    return {
      deck: JSON.parse(JSON.stringify(state.deck)),
      index: state.index,
      selectedId: state.selectedId
    };
  }

  function pushUndo(preSnap) {
    if (applyingHistory) return;
    undoStack.push(preSnap || deepSnap());
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
  }

  function restoreSnap(snap) {
    applyingHistory = true;
    state.deck = snap.deck;
    state.index = Math.max(0, Math.min(snap.index, snap.deck.slides.length - 1));
    state.selectedId = snap.selectedId;
    saveSilent();
    renderAll();
    applyingHistory = false;
  }

  function undo() {
    if (!undoStack.length) return toast("没有可撤回的操作");
    redoStack.push(deepSnap());
    restoreSnap(undoStack.pop());
    toast("已撤回");
  }

  function redo() {
    if (!redoStack.length) return toast("没有可重做的操作");
    undoStack.push(deepSnap());
    restoreSnap(redoStack.pop());
    toast("已重做");
  }

  /** Capture state, run mutation, persist */
  function commit(fn) {
    pushUndo(deepSnap());
    fn();
    saveSilent();
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
    if (mode === "edit") $("notesDock").classList.remove("open");
    renderAll();
    toast(mode === "present" ? "演讲模式 · ←→ N F Esc" : "编辑模式");
  }

  function go(delta) {
    const next = state.index + delta;
    if (next < 0 || next >= state.deck.slides.length) return;
    state.index = next;
    state.selectedId = null;
    renderAll();
    if (window.__notesPaint) try { window.__notesPaint(); } catch (_) {}
  }

  function renderThumbs() {
    const box = $("thumbs");
    box.innerHTML = "<h3>Pages</h3><div class=\"hint-drag\">拖拽排序 · 或点 ↑↓</div>";
    state.deck.slides.forEach((s, i) => {
      const d = document.createElement("div");
      d.className = "thumb" + (i === state.index ? " active" : "");
      d.draggable = state.mode === "edit";
      d.dataset.index = String(i);
      d.innerHTML = `
        <div class="t">${s.title || "未命名"}</div>
        <div class="idx">${i + 1}</div>
        <div class="move-btns">
          <button type="button" data-move="-1" title="上移">↑</button>
          <button type="button" data-move="1" title="下移">↓</button>
        </div>`;
      d.onclick = (e) => {
        if (e.target.closest("[data-move]")) return;
        state.index = i;
        state.selectedId = null;
        renderAll();
      };
      d.querySelectorAll("[data-move]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          moveSlide(i, i + Number(btn.dataset.move));
        });
      });
      d.addEventListener("dragstart", (e) => {
        if (state.mode !== "edit") return;
        thumbDragFrom = i;
        d.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(i));
      });
      d.addEventListener("dragend", () => {
        d.classList.remove("dragging");
        thumbDragFrom = null;
        box.querySelectorAll(".thumb").forEach((t) => t.classList.remove("drag-over"));
      });
      d.addEventListener("dragover", (e) => {
        if (state.mode !== "edit") return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        d.classList.add("drag-over");
      });
      d.addEventListener("dragleave", () => d.classList.remove("drag-over"));
      d.addEventListener("drop", (e) => {
        e.preventDefault();
        d.classList.remove("drag-over");
        const from = Number(e.dataTransfer.getData("text/plain"));
        if (Number.isNaN(from)) return;
        moveSlide(from, i);
      });
      box.appendChild(d);
    });
  }

  function moveSlide(from, to) {
    if (from === to || to < 0 || to >= state.deck.slides.length) return;
    commit(() => {
      const [slide] = state.deck.slides.splice(from, 1);
      state.deck.slides.splice(to, 0, slide);
      if (state.index === from) state.index = to;
      else if (from < state.index && to >= state.index) state.index -= 1;
      else if (from > state.index && to <= state.index) state.index += 1;
      state.selectedId = null;
    });
    renderAll();
    toast("已调整页面顺序");
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

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
          if (text == null && href == null) return;
          pushUndo(deepSnap());
          if (text != null) el.text = text;
          if (href != null) el.href = href;
          saveSilent();
          renderStage();
        }
        return;
      }
      if (el.type === "section") {
        const t = prompt("章节标题（可用 <span class=\"accent\">高亮</span>）", el.text || "");
        if (t != null && t !== el.text) {
          pushUndo(deepSnap());
          el.text = t;
          saveSilent();
          renderStage();
        }
        return;
      }
      const preEdit = deepSnap();
      const prevText = el.text || "";
      node.contentEditable = "true";
      node.classList.add("editing");
      node.focus();
      const finish = () => {
        node.contentEditable = "false";
        node.classList.remove("editing");
        const next = node.innerText;
        if (next !== prevText) {
          pushUndo(preEdit);
          el.text = next;
          saveSilent();
        }
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
    drag = {
      kind: "move",
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      rect,
      preSnap: deepSnap(),
      changed: false
    };
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
    drag = {
      kind: "resize",
      id,
      startX: e.clientX,
      startY: e.clientY,
      origW: el.w,
      origH: el.h,
      rect,
      preSnap: deepSnap(),
      changed: false
    };
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
      if (el.x !== drag.origX || el.y !== drag.origY) drag.changed = true;
    } else {
      el.w = Math.max(6, Math.min(100 - el.x, drag.origW + dx));
      el.h = Math.max(5, Math.min(92 - el.y, drag.origH + dy));
      if (el.w !== drag.origW || el.h !== drag.origH) drag.changed = true;
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
    if (drag.changed && drag.preSnap) pushUndo(drag.preSnap);
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
    const insertEl = async (src) => {
      if (src != null) el.src = src;
      commit(() => {
        currentSlide().elements.push(el);
        state.selectedId = el.id;
      });
      renderAll();
    };
    if (type === "image") {
      const local = confirm("确定＝本地上传；取消＝输入路径/URL");
      if (local) {
        $("fileImage").onchange = async (ev) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          await insertEl(await readFile(file));
          ev.target.value = "";
        };
        $("fileImage").click();
        return;
      }
      const src = prompt("图片路径", "assets/xhs/");
      if (!src) return;
      insertEl(src);
      return;
    }
    if (type === "video") {
      const local = confirm("确定＝上传；取消＝输入 URL");
      if (local) {
        $("fileVideo").onchange = async (ev) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          await insertEl(await readFile(file));
          ev.target.value = "";
        };
        $("fileVideo").click();
        return;
      }
      const src = prompt("视频/GIF URL", "");
      if (!src) return;
      insertEl(src);
      return;
    }
    insertEl();
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
    pushUndo(deepSnap());
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
    const node = $(id);
    node.addEventListener("focus", () => {
      node._undoSnap = deepSnap();
    });
    node.addEventListener("input", (e) => {
      if (node._undoSnap) {
        pushUndo(node._undoSnap);
        node._undoSnap = null;
      }
      currentSlide()[key] = transform ? transform(e.target.value) : e.target.value;
      if (key === "title") renderThumbs();
      renderStage();
      if (key === "notes") {
        $("notesDockBody").textContent = currentSlide().notes || "";
      }
      saveSilent();
    });
  }

  // wire UI
  $("btnEdit").onclick = () => setMode("edit");
  $("btnPresent").onclick = () => setMode("present");
  $("btnPrev").onclick = () => go(-1);
  $("btnNext").onclick = () => go(1);
  $("btnSave").onclick = saveDeck;
  $("btnUndo").onclick = undo;
  $("btnRedo").onclick = redo;
  $("btnExport").onclick = () => {
    const blob = new Blob([JSON.stringify(state.deck, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kiiikiii-deck-fusion.json";
    a.click();
  };
  $("btnReset").onclick = () => {
    if (!confirm("恢复讲稿默认版（对齐最新分享会讲稿）？本地修改会丢失。")) return;
    commit(() => {
      state.deck = cloneDefault();
      state.index = 0;
      state.selectedId = null;
    });
    undoStack = [];
    redoStack = [];
    renderAll();
  };
  $("importFile").onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const parsed = JSON.parse(await file.text());
    commit(() => {
      state.deck = parsed;
      state.index = 0;
      state.selectedId = null;
    });
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
    commit(() => {
      state.deck.slides.splice(state.index + 1, 0, s);
      state.index += 1;
      state.selectedId = null;
    });
    renderAll();
  };
  $("btnDupSlide").onclick = () => {
    commit(() => {
      const copy = JSON.parse(JSON.stringify(currentSlide()));
      copy.id = uid();
      copy.title = (copy.title || "") + " 副本";
      copy.elements.forEach((el) => { el.id = uid(); });
      state.deck.slides.splice(state.index + 1, 0, copy);
      state.index += 1;
      state.selectedId = null;
    });
    renderAll();
  };
  $("btnDelSlide").onclick = () => {
    if (state.deck.slides.length <= 1) return toast("至少保留一页");
    if (!confirm("删除当前页？")) return;
    commit(() => {
      state.deck.slides.splice(state.index, 1);
      state.index = Math.max(0, state.index - 1);
      state.selectedId = null;
    });
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
    pushUndo(deepSnap());
    el.font = e.target.value;
    saveSilent();
    renderStage();
  };
  $("elSize").addEventListener("focus", () => { $("elSize")._undoSnap = deepSnap(); });
  $("elSize").oninput = (e) => {
    const el = selectedEl();
    if (!el) return;
    if ($("elSize")._undoSnap) {
      pushUndo($("elSize")._undoSnap);
      $("elSize")._undoSnap = null;
    }
    el.size = +e.target.value || 16;
    saveSilent();
    renderStage();
  };
  $("elColor").addEventListener("focus", () => { $("elColor")._undoSnap = deepSnap(); });
  $("elColor").oninput = (e) => {
    const el = selectedEl();
    if (!el) return;
    if ($("elColor")._undoSnap) {
      pushUndo($("elColor")._undoSnap);
      $("elColor")._undoSnap = null;
    }
    el.color = e.target.value;
    saveSilent();
    renderStage();
  };
  $("elContent").addEventListener("focus", () => { $("elContent")._undoSnap = deepSnap(); });
  $("elContent").onchange = (e) => {
    const el = selectedEl();
    if (!el) return;
    if ($("elContent")._undoSnap) {
      pushUndo($("elContent")._undoSnap);
      $("elContent")._undoSnap = null;
    }
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
    if (!state.selectedId) return;
    commit(() => {
      const s = currentSlide();
      s.elements = s.elements.filter((e) => e.id !== state.selectedId);
      state.selectedId = null;
    });
    renderAll();
  };
  $("btnBringFront").onclick = () => {
    const s = currentSlide();
    const i = s.elements.findIndex((e) => e.id === state.selectedId);
    if (i < 0) return;
    commit(() => {
      const [el] = s.elements.splice(i, 1);
      s.elements.push(el);
    });
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

  $("btnNotesWindow").onclick = () => {
    const w = window.open("", "notes", "width=420,height=640");
    const paint = () => {
      const s = currentSlide();
      w.document.title = "讲者备注";
      w.document.body.style.cssText = "font-family:Inter,sans-serif;padding:16px;background:#111;color:#eee;";
      w.document.body.innerHTML = `<h2 style="color:#7dd3fc;font-size:14px">${state.index + 1}. ${esc(s.title)}</h2><pre style="white-space:pre-wrap;line-height:1.55;font-size:15px">${esc(s.notes)}</pre><button id="r">刷新</button>`;
      w.document.getElementById("r").onclick = paint;
    };
    paint();
    window.__notesPaint = paint;
  };

  window.addEventListener("keydown", (e) => {
    const mod = e.metaKey || e.ctrlKey;
    const tag = e.target?.tagName || "";
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(tag) || e.target?.isContentEditable;

    if (mod && (e.key === "z" || e.key === "Z")) {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && (e.key === "y" || e.key === "Y")) {
      e.preventDefault();
      redo();
      return;
    }

    if (typing) return;
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
    if (e.key === "n" || e.key === "N") $("notesDock").classList.toggle("open");
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
