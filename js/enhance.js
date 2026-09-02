document.addEventListener("DOMContentLoaded", function () {

  /* ── 1. PAGE LOADER ── */
  const loader = document.createElement("div");
  loader.id = "enh-loader";
  loader.innerHTML = `<span class="enh-loader-mark">AK</span>`;
  document.body.prepend(loader);
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("enh-hide"), 250);
    setTimeout(() => loader.remove(), 900);
  });

  /* ── 2. SCROLL REVEAL for sections without data-aos ── */
  const revealTargets = document.querySelectorAll(
    ".skill-chips, .career-text .section-body, .gauge, .contact-card, .cert-card, .project-card, .skill-category"
  );
  revealTargets.forEach(el => el.classList.add("enh-reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("enh-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ── 3. GLOW-FOLLOW + TILT for cards ── */
  const tiltEls = document.querySelectorAll(".project-card, .cert-card, .skill-category");
  tiltEls.forEach(el => {
    const glow = document.createElement("div");
    glow.className = "enh-tilt-glow";
    el.prepend(glow);

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.setProperty("--mx", `${x}px`);
      glow.style.setProperty("--my", `${y}px`);

      // subtle 3D tilt
      const rx = ((y / rect.height) - 0.5) * -4;
      const ry = ((x / rect.width) - 0.5) * 4;
      el.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  /* ── 4. MAGNETIC BUTTONS (hire button, contact cards) ── */
  const magneticEls = document.querySelectorAll(".btn-hire, .contact-card");
  magneticEls.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  /* ── 5. TIMELINE PROGRESS LINE ── */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const progressLine = document.createElement("div");
    progressLine.className = "timeline-progress";
    timeline.prepend(progressLine);

    const updateProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      progressLine.style.height = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ── 6. BACK TO TOP BUTTON ── */
  const topBtn = document.createElement("button");
  topBtn.id = "enh-top-btn";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
  document.body.appendChild(topBtn);
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  /* ── 7. LAZY IMAGE FADE-IN ── */
  document.querySelectorAll("img").forEach(img => {
    if (img.complete) {
      img.classList.add("enh-loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("enh-loaded"));
    }
  });

  /* ── 8. GAUGE HOVER MICRO-INTERACTION ── */
  document.querySelectorAll(".gauge").forEach(g => {
    g.addEventListener("mouseenter", () => {
      const circle = g.querySelector("circle[id^='circle']");
      if (circle) circle.style.filter = "drop-shadow(0 0 12px currentColor)";
    });
    g.addEventListener("mouseleave", () => {
      const circle = g.querySelector("circle[id^='circle']");
      if (circle) circle.style.filter = "";
    });
  });

  /* ══════════════════════════════════════════════════════
     ELEGANCE PASS v2
     ══════════════════════════════════════════════════════ */

  /* ── 9. AMBIENT BACKGROUND MESH ── */
  if (!document.getElementById("enh-mesh")) {
    const mesh = document.createElement("div");
    mesh.id = "enh-mesh";
    mesh.innerHTML = "<span></span><span></span><span></span>";
    document.body.prepend(mesh);
  }

  /* ── 10. SECTION TITLE REVEAL (underline sweep on scroll into view) ── */
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("enh-title-in");
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".section-title").forEach(t => titleObserver.observe(t));

  /* ── 11. SUBTLE HERO PARALLAX on mouse move (very gentle, elegant) ── */
  const heroSection = document.querySelector(".hero-section");
  const heroPortrait = document.querySelector(".hero-image-wrapper");
  if (heroSection && heroPortrait && window.matchMedia("(hover: hover)").matches) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroPortrait.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
    heroSection.addEventListener("mouseleave", () => {
      heroPortrait.style.transform = "";
    });
  }

  /* ── 12. SMOOTH FADE-UP for gauge numbers' parent on view (already have chart anim; just entrance) ── */
  document.querySelectorAll(".horizontal-values .gauge").forEach((g, i) => {
    g.style.transitionDelay = `${i * 70}ms`;
  });

});