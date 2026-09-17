/* LEPOS 站点渲染逻辑：读取 data/site.js 的配置并填充页面 */
(function () {
  var d = window.LEPOS_SITE;
  if (!d) { console.error("未找到 data/site.js 中的 LEPOS_SITE 配置"); return; }

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 品牌 ---------- */
  document.title = d.brand.name + " 官方下载";
  $("navDomain").textContent = d.brand.domain ? d.brand.domain : "";

  /* ---------- 首屏 ---------- */
  $("badgeText").textContent = d.hero.badge || ("最新版本 " + d.download.version);
  $("heroTitle").textContent = d.hero.title || d.brand.name;
  $("heroSub").textContent = d.hero.subtitle || "";

  /* ---------- 下载按钮 ---------- */
  var btn = $("downloadBtn"), navBtn = $("navDownload");
  btn.href = d.download.url;
  navBtn.href = d.download.url;
  $("btnLabel").innerHTML = (d.hero.buttonText || ("下载 " + d.brand.name)) +
    ' <span class="ver">' + d.download.version + "</span>";

  // 点击后给一句反馈，避免直链失效时页面"毫无反应"
  btn.addEventListener("click", function () {
    showToast("正在请求下载…若长时间无反应，说明直链可能已失效");
  });

  // 备用地址：填了 mirrorUrl 才显示
  var mirror = $("mirrorLink");
  if (d.download.mirrorUrl) {
    mirror.href = d.download.mirrorUrl;
    mirror.style.display = "";
  } else {
    mirror.style.display = "none";
  }

  // 按钮上方那行风险提示小字
  $("riskNote").textContent = d.download.riskNote;

  var meta = [d.download.platform, d.download.filename, d.download.releasedAt];
  if (d.download.size) meta.splice(1, 0, d.download.size);
  $("dlMeta").textContent = meta.filter(Boolean).join(" · ");

  /* ---------- 关于 ---------- */
  $("aboutTitle").textContent = d.about.title;
  $("aboutDesc").textContent = d.about.desc;

  var icons = {
    box: '<path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
    download: '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6l8-3z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>'
  };
  $("aboutCards").innerHTML = d.about.cards.map(function (c) {
    return '<article class="card">' +
      '<div class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      (icons[c.icon] || icons.box) + "</svg></div>" +
      "<h3>" + c.title + "</h3><p>" + c.text + "</p></article>";
  }).join("");

  /* ---------- FAQ ---------- */
  $("faqList").innerHTML = d.faq.map(function (f) {
    return '<details class="faq-item"><summary>' + f.q + "</summary><p>" + f.a + "</p></details>";
  }).join("");

  /* ---------- 页脚 ---------- */
  $("footerDisclaimer").textContent = d.footer.disclaimer;
  $("footerCopyright").textContent = "© " + new Date().getFullYear() + " " + d.footer.copyright;
  $("footerContact").textContent = d.footer.contact || "";

  /* ---------- 复制链接 + Toast ---------- */
  var toast = $("toast"), timer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("show"); }, 2000);
  }
  $("copyLink").addEventListener("click", function () {
    var url = d.download.url;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { showToast("下载链接已复制"); },
        function () { showToast("复制失败，请手动复制"); }
      );
    } else {
      var ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); showToast("下载链接已复制"); }
      catch (e) { showToast("复制失败，请手动复制"); }
      document.body.removeChild(ta);
    }
  });
})();
