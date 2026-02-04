document.addEventListener("click", function (event) {
  if (event.target.hasAttribute("data-theme")) {
    const themeFile = event.target.getAttribute("data-theme");
    const themeButtons = document.querySelectorAll("[data-theme]");
    themeButtons.forEach((btn) => btn.classList.remove("active-theme"));
    event.target.classList.add("active-theme");
    document.getElementById("themeStylesheet").setAttribute("href", themeFile);
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
  const value = lang === "it" ? "/en/it" : "/en/en";
  const base = getBasePath();

  // Set cookie for root + repo base path
  document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
  document.cookie = `googtrans=${value};path=${base};SameSite=Lax`;
}

// ✅ Global function for your HTML onclick buttons
window.setLang = function (lang) {
  document.body.classList.add("lang-loading");
  setGoogTransCookie(lang);
  localStorage.setItem("lang", lang);
  location.reload();
};



