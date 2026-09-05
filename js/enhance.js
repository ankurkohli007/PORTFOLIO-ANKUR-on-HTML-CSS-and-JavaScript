document.addEventListener("DOMContentLoaded", function () {

  /* ── helper: stagger a NodeList by setting --d ── */
  function stagger(list, base = 0.08) {
    list.forEach((el, i) => el.style.setProperty("--d", (i * base).toFixed(2) + "s"));
  }

  /* ── 1. TAG ELEMENTS WITH 3D-REVEAL CLASSES (no text/content touched) ── */

  // Hero — none here, hero uses its own load-in choreography (see #5), skip scroll-reveal on it

  // Career Identity — image flips in from left, text rises from right
  const careerImg = document.querySelector(".career-img-wrap");
  const careerText = document.querySelector(".career-text");
  if (careerImg) careerImg.classList.add("r3d-left");
  if (careerText) careerText.classList.add("r3d-right");

  // Section titles — split into word spans for a 3D letter-drop reveal
  document.querySelectorAll(".section-title, .contact-heading").forEach(title => {
    if (title.dataset.r3dSplit) return;
    title.dataset.r3dSplit = "true";
    const walk = (node) => {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const words = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach(w => {
            if (w.trim() === "") { frag.appendChild(document.createTextNode(w)); }
            else {
              const span = document.createElement("span");
              span.className = "r3d-word";
              span.textContent = w;
              frag.appendChild(span);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(title);
    stagger(title.querySelectorAll(".r3d-word"), 0.05);
  });

  // Skill category cards — pop up from depth, staggered
  document.querySelectorAll(".skill-category").forEach((el, i) => {
    el.classList.add("r3d-flip");
    el.style.setProperty("--d", (i % 3 * 0.12).toFixed(2) + "s");
  });

  // Timeline cards — alternate left/right 3D swing
  document.querySelectorAll(".timeline-item").forEach((item, i) => {
    const card = item.querySelector(".timeline-card");
    if (!card) return;
    card.classList.add(i % 2 === 0 ? "r3d-left" : "r3d-right");
  });

  // Certification cards — pop from depth, staggered by column
  document.querySelectorAll(".cert-card").forEach((el, i) => {
    el.classList.add("r3d-pop");
    el.style.setProperty("--d", ((i % 4) * 0.1).toFixed(2) + "s");
  });

  // Project cards — flip up like cards being dealt, staggered
  document.querySelectorAll(".project-card").forEach((el, i) => {
    el.classList.add("r3d-flip");
    el.style.setProperty("--d", ((i % 3) * 0.12).toFixed(2) + "s");
  });

  // Publications image + gauges — image flips left, gauges pop in sequence
  const pubImg = document.querySelector(".publications-img");
  const pubContent = document.querySelector(".publications-content");
  if (pubImg) pubImg.classList.add("r3d-left");
  if (pubContent) pubContent.classList.add("r3d-right");
  const gauges = document.querySelectorAll(".gauge");
  stagger(Array.from(gauges), 0.1);
  gauges.forEach(g => g.classList.add("r3d-pop"));

  // Contact cards — pop from depth
  document.querySelectorAll(".contact-card").forEach((el, i) => {
    el.classList.add("r3d-pop");
    el.style.setProperty("--d", (i * 0.1).toFixed(2) + "s");
  });

  // GIF gallery tiles — flip up
  document.querySelectorAll(".gif-tile").forEach((el, i) => {
    el.classList.add("r3d-flip");
    el.style.setProperty("--d", ((i % 3) * 0.1).toFixed(2) + "s");
  });

  /* ── 2. INTERSECTION OBSERVER — trigger the reveals ── */
  const revealSelector = ".r3d, .r3d-left, .r3d-right, .r3d-flip, .r3d-pop, .r3d-word";
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("r3d-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  document.querySelectorAll(revealSelector).forEach(el => io.observe(el));

  /* ── 3. CARD 3D TILT ON HOVER (project/cert/skill/timeline/contact) ── */
  const tiltSelector = ".project-card, .cert-card, .skill-category, .timeline-card, .contact-card";
  document.querySelectorAll(tiltSelector).forEach(el => {
    let raf = null;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rx = (py - 0.5) * -10;   // tilt up/down
      const ry = (px - 0.5) * 12;    // tilt left/right
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) translateZ(10px)`;
      });
    });
    el.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });

  /* ── 4. HERO PORTRAIT — 3D parallax tilt following the mouse across the whole hero ── */
  const heroSection = document.querySelector(".hero-section");
  const heroImgWrap = document.querySelector(".hero-image-wrapper");
  const heroLayers = document.querySelectorAll(
    ".hero-eyebrow, .hero-name, .hero-role, .hero-desc, .hero-actions"
  );
  if (heroSection && heroImgWrap) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      heroImgWrap.style.transform =
        `perspective(1000px) rotateX(${(-py * 14).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`;

      heroLayers.forEach((layer, i) => {
        const depth = (i + 1) * 3.5;
        layer.style.transform = `translate3d(${(px * depth).toFixed(2)}px, ${(py * depth * 0.6).toFixed(2)}px, 0)`;
      });
    });
    heroSection.addEventListener("mouseleave", () => {
      heroImgWrap.style.transform = "";
      heroLayers.forEach(layer => { layer.style.transform = ""; });
    });
  }

  /* ── 5. SCROLL-LINKED HERO DEPTH (subtle sink-away as user scrolls past hero) ── */
  const hero = document.querySelector(".hero-section");
  if (hero) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      const fade = Math.max(1 - y / 700, 0);
      const push = Math.min(y * 0.15, 90);
      hero.style.opacity = fade.toFixed(2);
      hero.style.transform = `perspective(1200px) translateZ(${-push}px)`;
    }, { passive: true });
  }

});