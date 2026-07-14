// i18n.js
// Handles: detecting the visitor's preferred language, applying translations,
// remembering the user's manual choice, and wiring up the EN/FR toggle button.

(function () {
    const STORAGE_KEY = "preferredLang";
    const SUPPORTED_LANGS = ["en", "fr"];
    const DEFAULT_LANG = "en";
  
    // 1. Work out which language to show on first load.
    function detectLanguage() {
      // a) Respect a language the visitor already chose manually.
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
  
      // b) Otherwise fall back to the browser/system language preference.
      //    navigator.languages gives an ordered list of preferences in modern browsers;
      //    navigator.language is the single-value fallback for older ones.
      const browserLangs = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || DEFAULT_LANG];
  
      for (const lang of browserLangs) {
        const short = lang.slice(0, 2).toLowerCase();
        if (SUPPORTED_LANGS.includes(short)) {
          return short;
        }
      }
  
      // c) Nothing matched — use the default.
      return DEFAULT_LANG;
    }
  
    // 2. Apply a language: update every [data-i18n] element, <html lang>, and the toggle button.
    function applyLanguage(lang) {
      const dict = translations[lang] || translations[DEFAULT_LANG];
  
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key] !== undefined) {
          el.innerHTML = dict[key];
        }
      });
  
      document.documentElement.setAttribute("lang", lang);
  
      if (dict["page.title"]) {
        document.title = dict["page.title"];
      }
  
      const toggleBtn = document.getElementById("lang-toggle");
      if (toggleBtn) {
        toggleBtn.textContent = lang === "en" ? "FR" : "EN";
        toggleBtn.setAttribute(
          "aria-label",
          lang === "en" ? "Switch to French" : "Passer en anglais"
        );
      }
  
      document.body.setAttribute("data-current-lang", lang);
    }
  
    // 3. Switch language, save the user's explicit choice, and re-render.
    function setLanguage(lang) {
      if (!SUPPORTED_LANGS.includes(lang)) return;
      localStorage.setItem(STORAGE_KEY, lang);
      applyLanguage(lang);
    }
  
    // 4. Wire everything up once the DOM is ready.
    document.addEventListener("DOMContentLoaded", () => {
      const initialLang = detectLanguage();
      applyLanguage(initialLang);
  
      const toggleBtn = document.getElementById("lang-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const current = document.documentElement.getAttribute("lang");
          const next = current === "en" ? "fr" : "en";
          setLanguage(next);
        });
      }
    });
  })();