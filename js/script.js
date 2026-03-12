/* 
   LANGUAGE CONFIG
   Maps lang code → { flag emoji, label }
 */
const LANG_MAP = {
  en: { flag: "🇬🇧", label: "EN" },
  it: { flag: "🇮🇹", label: "IT" },
  de: { flag: "🇩🇪", label: "DE" },
  nl: { flag: "🇳🇱", label: "NL" },
  fr: { flag: "🇫🇷", label: "FR" },
};

/* 
   PUBLICATIONS DATA
 */
const publicationsData = {
  patents: 12,
  bookChapters: 2,
  conferencePapers: 24,
  researchScore: 36.9,
  citations: 53,
  hIndex: 3
};

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ once: true, easing: "ease-out-quart", duration: 900, offset: 60 });

  /* 
     THEME TOGGLE — dark mode default
 */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const savedTheme = localStorage.getItem("theme") ?? "dark";

  function applyTheme(theme) {
    document.body.classList.toggle("light-mode", theme === "light");
    if (themeIcon) themeIcon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    localStorage.setItem("theme", theme);
  }
  applyTheme(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
    });
  }

  /* TYPEWRITER */
  const roles = [
    "Software Engineer",
    "AI / GenAI Developer",
    "Full Stack Builder",
    "ROS2 & Robotics Dev",
    "LLM Systems Architect",
  ];
  let ri = 0, ci = 0, deleting = false;
  function typeWriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
    if (!deleting && ci === word.length) { deleting = true; setTimeout(typeWriter, 2000); return; }
    if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    setTimeout(typeWriter, deleting ? 48 : 105);
  }
  typeWriter();

  /* PARTICLE CANVAS */
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.4 + 0.1,
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLight = document.body.classList.contains("light-mode");
      const c = isLight ? "192,57,43" : "255,85,85";
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${c},${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* CUSTOM CURSOR */
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll("a, button, .chip, .project-card, .cert-card, .contact-card").forEach(el => {
    el.addEventListener("mouseenter", () => ring && ring.classList.add("hovered"));
    el.addEventListener("mouseleave", () => ring && ring.classList.remove("hovered"));
  });

  /* LANG DROPDOWN */
  const langDropdown = document.querySelector(".lang-dropdown");
  const langBtn = langDropdown ? langDropdown.querySelector(".lang-current") : null;
  let dropdownOpen = false;

  function updateLangButton(lang) {
    if (!langBtn) return;
    const entry = LANG_MAP[lang] || LANG_MAP["en"];
    langBtn.textContent = entry.flag + " " + entry.label;
  }
  const savedLang = localStorage.getItem("lang") ?? "en";
  if (!localStorage.getItem("lang")) localStorage.setItem("lang", "en");
  updateLangButton(savedLang);

  const scrollKey = "__lang_scroll";
  const savedScroll = sessionStorage.getItem(scrollKey);
  if (savedScroll !== null) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem(scrollKey);
      });
    });
  }

  function openDropdown() { dropdownOpen = true; langDropdown.classList.add("open"); langBtn.setAttribute("aria-expanded", "true"); }
  function closeDropdown() { dropdownOpen = false; langDropdown.classList.remove("open"); langBtn.setAttribute("aria-expanded", "false"); }

  if (langBtn) {
    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownOpen ? closeDropdown() : openDropdown();
    });
  }
  document.addEventListener("click", function (e) { if (!dropdownOpen) return; if (e.target.closest("#google_translate_element")) return; if (langDropdown && langDropdown.contains(e.target)) return; closeDropdown(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDropdown(); });

  /* GOOGLE TRANSLATE BANNER KILL */
  const killBanner = () => {
    document.querySelectorAll(
      ".goog-te-banner-frame, iframe.goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt, .skiptranslate > iframe, .goog-te-spinner-pos"
    ).forEach(f => f.style.cssText = "display:none!important;height:0!important;visibility:hidden!important;");
    document.body.style.top = "0px";
    document.documentElement.style.marginTop = "0px";
    document.body.style.marginTop = "0px";
  };
  killBanner();
  setTimeout(killBanner, 300);
  setTimeout(killBanner, 800);
  setTimeout(killBanner, 2000);
  new MutationObserver(killBanner).observe(document.body, { childList: true, subtree: true });
  setGoogTransCookie(savedLang);

  /* 
     PUBLICATIONS GAUGE UPDATE WITH ANIMATION + TEXT COUNTER
   */
  function animateGauges(data) {
    const mapping = {
      circle1: data.patents, text1a: data.patents,
      circle2: data.bookChapters, text2a: data.bookChapters,
      circle3: data.conferencePapers, text3a: data.conferencePapers,
      circle4: data.researchScore, text4a: data.researchScore,
      circle5: data.citations, text5a: data.citations,
      circle6: data.hIndex, text6a: data.hIndex
    };

    const maxValues = {
      circle1: 50,
      circle2: 10,
      circle3: 50,
      circle4: 50,
      circle5: 100,
      circle6: 10
    };

    Object.keys(mapping).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      // Animate text numbers
      if (el.tagName.toLowerCase() === "text") {
        const target = mapping[id];
        let current = 0;
        const decimals = (id === "text4a") ? 1 : 0; // researchScore has 1 decimal

        const step = () => {
          if (decimals === 0) {
            // integer: increment by 1 until target
            if (current < target) current++;
            el.textContent = current;
            if (current < target) requestAnimationFrame(step);
          } else {
            // decimal: smooth animation
            current += (target - current) * 0.08;
            if (Math.abs(current - target) < 0.05) current = target;
            el.textContent = current.toFixed(decimals);
            if (current !== target) requestAnimationFrame(step);
          }
        };
        step();
      }

      // Animate circle gauge
      if (el.tagName.toLowerCase() === "circle" && id.startsWith("circle")) {
        const radius = el.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        el.style.strokeDasharray = circumference;
        let offset = circumference;
        const targetPercent = mapping[id] / (maxValues[id] || 100);
        const targetOffset = circumference * (1 - targetPercent);
        const step = () => {
          offset -= (offset - targetOffset) * 0.08;
          el.style.strokeDashoffset = offset;
          if (Math.abs(offset - targetOffset) > 0.1) requestAnimationFrame(step);
        };
        step();
      }
    });
  }

  animateGauges(publicationsData);

});

/* SCROLL: progress bar + header + nav active */
window.addEventListener("scroll", () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  const bar = document.getElementById("scroll-progress");
  if (bar) bar.style.width = pct + "%";
  const header = document.getElementById("main-header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 60);
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) current = s.id; });
  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("nav-active", a.getAttribute("href") === `#${current}`);
  });
});

/* GOOGLE TRANSLATE HELPERS */
function getBasePath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length > 0 ? "/" + parts[0] + "/" : "/";
}
function setGoogTransCookie(lang) {
  const value = `/en/${lang}`;
  const base = getBasePath();
  document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
  document.cookie = `googtrans=${value};path=${base};SameSite=Lax`;
}

/* SETLANG — called by menu buttons */
window.setLang = function (lang) {
  if (window.__langSwitching) return;
  window.__langSwitching = true;
  sessionStorage.setItem("__lang_scroll", window.scrollY);
  localStorage.setItem("lang", lang);
  setGoogTransCookie(lang);
  document.querySelector(".lang-dropdown")?.classList.remove("open");
  location.reload();
};

/*
   GIF DEMO GALLERY
*/

(function () {

  /*
     GIF PATHS
  */
  const GIF_FILES = [
    "./images/gifs/1.gif",
    "./images/gifs/2.gif",
    "./images/gifs/3.gif",
    "./images/gifs/4.gif",
    "./images/gifs/5.gif",
    "./images/gifs/6.gif",
    "./images/gifs/7.gif",
    "./images/gifs/8.gif",
    "./images/gifs/9.gif"
  ];

  let currentIndex = 0;

  /* ── Build the gallery grid tiles ── */
  function buildGallery() {
    const grid = document.getElementById("gifGalleryGrid");
    if (!grid) return;

    GIF_FILES.forEach((src, i) => {
      const tile = document.createElement("div");
      tile.className = "gif-tile";
      tile.setAttribute("role", "button");
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("aria-label", "View demo " + (i + 1));
      tile.innerHTML = `
          <img src="${src}" alt="Project demo ${i + 1}" loading="lazy">
          <div class="gif-tile-overlay">
            <span class="gif-tile-number">Demo ${String(i + 1).padStart(2, "0")}</span>
            <div class="gif-tile-expand"><i class="fa-solid fa-expand"></i></div>
          </div>`;

      tile.addEventListener("click", () => openLightbox(i));
      tile.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
      });
      grid.appendChild(tile);
    });
  }

  /* ── Build lightbox modal ── */
  function buildLightbox() {
    const el = document.createElement("div");
    el.id = "gifLightboxBackdrop";
    el.className = "gif-lightbox-backdrop";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML = `
        <div class="gif-lightbox" id="gifLightbox">
          <div class="gif-lightbox-bar">
            <div class="gif-lightbox-counter">
              Demo <span id="gifCurrent">1</span> / <span id="gifTotal">${GIF_FILES.length}</span>
            </div>
            <button class="gif-lightbox-close" id="gifLightboxClose" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="gif-lightbox-body loading" id="gifLightboxBody">
            <img id="gifLightboxImg" src="" alt="Project demo">
          </div>
          <div class="gif-lightbox-footer">
            <div class="gif-lightbox-nav">
              <button class="gif-nav-btn" id="gifNavPrev"><i class="fa-solid fa-chevron-left"></i> Prev</button>
              <button class="gif-nav-btn" id="gifNavNext">Next <i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="gif-lightbox-dots" id="gifDots"></div>
            <div class="gif-lightbox-hint"><kbd>ESC</kbd> close &nbsp; <kbd>←</kbd><kbd>→</kbd> navigate</div>
          </div>
        </div>`;
    document.body.appendChild(el);

    /* dots */
    const dotsEl = document.getElementById("gifDots");
    GIF_FILES.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "gif-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  /* ── Open lightbox at index ── */
  function openLightbox(index) {
    currentIndex = index;
    loadGif(index);
    document.getElementById("gifLightboxBackdrop").classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("gifLightboxClose")?.focus(), 80);
  }

  /* ── Load GIF into lightbox ── */
  function loadGif(index) {
    const body = document.getElementById("gifLightboxBody");
    const img = document.getElementById("gifLightboxImg");
    const counter = document.getElementById("gifCurrent");

    body.classList.add("loading");
    img.onload = () => body.classList.remove("loading");
    img.onerror = () => body.classList.remove("loading");
    img.src = GIF_FILES[index];

    if (counter) counter.textContent = index + 1;

    /* update dots */
    document.querySelectorAll(".gif-dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });

    /* update prev/next buttons */
    const prev = document.getElementById("gifNavPrev");
    const next = document.getElementById("gifNavNext");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === GIF_FILES.length - 1;
  }

  /* ── Navigate ── */
  function goTo(index) {
    if (index < 0 || index >= GIF_FILES.length) return;
    currentIndex = index;
    loadGif(index);
  }

  /* ── Close lightbox ── */
  function closeLightbox() {
    document.getElementById("gifLightboxBackdrop").classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      const img = document.getElementById("gifLightboxImg");
      if (img) img.src = "";
    }, 350);
  }

  /* ── Events ── */
  function bindEvents() {
    document.getElementById("gifLightboxClose")
      ?.addEventListener("click", closeLightbox);

    document.getElementById("gifNavPrev")
      ?.addEventListener("click", () => goTo(currentIndex - 1));

    document.getElementById("gifNavNext")
      ?.addEventListener("click", () => goTo(currentIndex + 1));

    /* click outside modal box */
    document.getElementById("gifLightboxBackdrop")
      ?.addEventListener("click", e => {
        if (!document.getElementById("gifLightbox").contains(e.target)) closeLightbox();
      });

    /* keyboard */
    document.addEventListener("keydown", e => {
      if (!document.getElementById("gifLightboxBackdrop")?.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
    });
  }

  /* ── Init ── */
  document.addEventListener("DOMContentLoaded", () => {
    buildGallery();
    buildLightbox();
    bindEvents();
  });

})();

/*
   GIF SPEED BOOSTER + CANVAS RENDERER
*/

   (function () {

    /* ── Speed multiplier: 2 = twice as fast, 3 = three times, etc. ── */
    const GIF_SPEED_MULTIPLIER = 3;
  
    /* ── Dynamically load gifler.js (lightweight GIF decoder, ~15kb) ── */
    function loadGifler(callback) {
      if (window.gifler) { callback(); return; }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gifler/0.1.0/gifler.min.js";
      script.onload = callback;
      script.onerror = () => console.warn("GifSpeedBooster: gifler failed to load, using normal GIFs.");
      document.head.appendChild(script);
    }
  
    /* ── Replace a single <img> GIF with a speed-boosted <canvas> ── */
    function boostGif(imgEl, speedMultiplier) {
      if (!window.gifler) return;
      if (imgEl.dataset.boosted) return; /* don't double-process */
      imgEl.dataset.boosted = "true";
  
      const src = imgEl.src || imgEl.getAttribute("data-src");
      if (!src || !src.toLowerCase().includes(".gif")) return;
  
      /* Create canvas with same dimensions */
      const canvas = document.createElement("canvas");
      canvas.style.cssText = imgEl.style.cssText;
      canvas.className = imgEl.className;
      canvas.style.width  = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.objectFit = imgEl.style.objectFit || "cover";
  
      /* Copy any data attributes */
      imgEl.parentNode.replaceChild(canvas, imgEl);
  
      try {
        gifler(src).frames(canvas, function (ctx, frame) {
          /* Resize canvas to match frame */
          if (canvas.width !== frame.width)  canvas.width  = frame.width;
          if (canvas.height !== frame.height) canvas.height = frame.height;
  
          ctx.drawImage(frame.buffer, 0, 0);
  
          /* Speed up: shorten each frame's delay */
          if (frame.delay) {
            frame.delay = Math.max(
              10, /* never go below 10ms — browser minimum */
              Math.round(frame.delay / speedMultiplier)
            );
          }
        });
      } catch (err) {
        /* Fallback: put img back if gifler errors */
        canvas.parentNode.replaceChild(imgEl, canvas);
        console.warn("GifSpeedBooster: could not boost", src, err);
      }
    }
  
    /* ── Boost all GIF tiles in the gallery grid ── */
    function boostAllTiles() {
      document.querySelectorAll(".gif-tile img").forEach(img => {
        /* Wait until the img has a src set */
        if (img.src && img.src.includes(".gif")) {
          boostGif(img, GIF_SPEED_MULTIPLIER);
        }
      });
    }
  
    /* ── Boost the lightbox GIF when it opens ── */
    function observeLightbox() {
      const backdrop = document.getElementById("gifLightboxBackdrop");
      if (!backdrop) return;
  
      /* Watch for when the lightbox becomes active */
      const observer = new MutationObserver(() => {
        if (backdrop.classList.contains("active")) {
          const img = document.getElementById("gifLightboxImg");
          if (img && img.src && img.src.includes(".gif")) {
            boostGif(img, GIF_SPEED_MULTIPLIER);
          }
        }
      });
  
      observer.observe(backdrop, { attributes: true, attributeFilter: ["class"] });
    }
  
    /* ── Init ── */
    document.addEventListener("DOMContentLoaded", () => {
      loadGifler(() => {
        /* Small delay to let the gallery tiles render first */
        setTimeout(() => {
          boostAllTiles();
          observeLightbox();
        }, 600);
      });
    });
  
  })();