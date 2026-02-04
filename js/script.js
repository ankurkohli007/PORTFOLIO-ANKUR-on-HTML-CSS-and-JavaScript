document.addEventListener("click", function (event) {
  // Theme switch (keep this working)
  if (event.target.hasAttribute("data-theme")) {
    const themeFile = event.target.getAttribute("data-theme");
    const themeButtons = document.querySelectorAll("[data-theme]");
    themeButtons.forEach((btn) => btn.classList.remove("active-theme"));
    event.target.classList.add("active-theme");
    document.getElementById("themeStylesheet").setAttribute("href", themeFile);
    return;
  }

  // Language dropdown open/close (mobile + desktop click)
  const dropdown = document.querySelector(".lang-dropdown");
  if (!dropdown) return;

  // If user clicks the globe button, toggle menu
  if (event.target.closest(".lang-current")) {
    dropdown.classList.toggle("open");
    return;
  }

  // If click is outside dropdown, close it
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("open");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Apply saved language on load (default English)
  const saved = localStorage.getItem("lang") || "en";
  setGoogTransCookie(saved);

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
  }

  const flagMap = { en: "🇬🇧", it: "🇮🇹", de: "🇩🇪", nl: "🇳🇱", fr: "🇫🇷" };
  const btn = document.querySelector(".lang-current");
  if (btn) btn.textContent = flagMap[saved] || "🌐";


  // ✅ Extra cleanup: remove any injected banner iframe if it appears later
  const killBanner = () => {
    const frames = document.querySelectorAll(
      ".goog-te-banner-frame, iframe.goog-te-banner-frame"
    );
    frames.forEach((f) => f.remove());

    document.body.style.top = "0px";
    document.documentElement.style.top = "0px";
  };

  killBanner();
  setTimeout(killBanner, 500);
  setTimeout(killBanner, 1500);
});

function getBasePath() {
  // For GitHub Pages repo sites: /<repo-name>/...
  // For custom domains or root sites: /
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length > 0) return "/" + parts[0] + "/";
  return "/";
}

function setGoogTransCookie(lang) {
  // Google expects "/<source>/<target>"
  const value = `/en/${lang}`;
  const base = getBasePath();

  document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
  document.cookie = `googtrans=${value};path=${base};SameSite=Lax`;
}

window.setLang = function (lang) {
  if (window.__langSwitching) return;
  window.__langSwitching = true;

  // UX: show loading state
  document.body.classList.add("lang-loading");

  localStorage.setItem("lang", lang);
  setGoogTransCookie(lang);

  // Disable all language buttons so user can't spam clicks
  document.querySelectorAll(".lang-menu button, .lang-current").forEach((b) => (b.disabled = true));

  // Close dropdown immediately
  const dropdown = document.querySelector(".lang-dropdown");
  if (dropdown) dropdown.classList.remove("open");

  // Single reload
  location.reload();
};