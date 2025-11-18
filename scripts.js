/* ==========================================================
   GLOBAL SCRIPTS: language switching, dark mode, navbar,
   whatsapp, scroll-top, teacher loading (backend -> fallback)
   ========================================================= */

/* CONFIG */
const BACKEND_TEACHERS_URL = ""; // <-- set to "https://api.yourdomain.com/teachers" if you have backend, otherwise leave empty
const LOCAL_TEACHERS_URL = "/data/teachers.json"; // ensure file exists
const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = ["en","tr","de"];
const LANG_PATH = "/lang/"; // folder with en.json tr.json de.json
const WHATSAPP_NUMBER = "905XXXXXXXXX"; // replace with your WhatsApp number (country code + number, no +)

/* ---------- helpers ---------- */
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }
function setLS(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}}
function getLS(k,def){ try{ const v = localStorage.getItem(k); return v? JSON.parse(v): def }catch(e){return def}}

/* ---------- LANGUAGE: load JSON file & translate ---------- */
async function loadLang(lang){
  if(!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  try{
    const res = await fetch(`${LANG_PATH}${lang}.json`, {cache:"no-cache"});
    if(!res.ok) throw new Error("lang fetch fail");
    const json = await res.json();
    return json;
  }catch(err){
    console.warn("Language load failed:", err);
    return null;
  }
}
async function applyTranslations(lang){
  const translations = await loadLang(lang) || {};
  // elements with data-i18n="key"
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(!key) return;
    const val = translations[key] ?? el.getAttribute("data-i18n-default") ?? "";
    if(el.tagName.toLowerCase()==="input" || el.tagName.toLowerCase()==="textarea"){
      el.placeholder = val;
    } else {
      el.innerHTML = val;
    }
  });
  // update active language UI if exists
  const sel = $("#languageSelector") || $("#languageSwitcher") || $(".lang-switch select");
  if(sel) sel.value = lang;
}

/* auto detect */
function detectLanguage(){
  const saved = getLS("site_lang", null);
  if(saved) return saved;
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || DEFAULT_LANG;
  const code = nav ? nav.slice(0,2).toLowerCase() : DEFAULT_LANG;
  return SUPPORTED_LANGS.includes(code) ? code : DEFAULT_LANG;
}

/* ---------- DARK MODE ---------- */
function applyTheme(theme){
  if(theme === "dark") document.documentElement.setAttribute("data-theme","dark");
  else document.documentElement.removeAttribute("data-theme");
  setLS("site_theme", theme);
}
function detectTheme(){
  const saved = getLS("site_theme", null);
  if(saved) return saved;
  const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark":"light";
  return prefers;
}

/* ---------- NAVBAR (in DOM by HTML) ---------- */
function setupMobileMenu(){
  const toggle = document.getElementById("hamburgerBtn") || document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks") || document.querySelector(".nav-links");
  const mobileMenu = document.querySelector(".mobile-menu");
  if(!toggle || !links) return;
  toggle.addEventListener("click", (e)=>{
    e.stopPropagation();
    const isOpen = links.classList.toggle("open");
    if(isOpen){
      links.style.display = "flex";
      links.style.flexDirection = "column";
    } else {
      links.style.display = "";
    }
  });
  // close on outside click
  document.addEventListener("click", (ev)=>{
    if(!links.contains(ev.target) && !toggle.contains(ev.target)){
      links.classList.remove("open");
      links.style.display = "";
    }
  });
}

/* ---------- WHATSAPP BAR ---------- */
function setupWhatsApp(){
  const wa = document.getElementById("waBar") || document.querySelector(".wa-bar") || document.querySelector(".waBar");
  if(wa){
    wa.addEventListener("click", ()=> {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I would like more information.")}`,"_blank");
    });
  }
}

/* ---------- SCROLL-TO-TOP toggle-on-click behavior ---------- */
function setupScrollTop(){
  const btn = document.getElementById("scroll-top-btn") || document.getElementById("scrollTopBtn") || document.querySelector("#scroll-top-btn");
  if(!btn) return;
  // toggle show/hide on document click (except clicking the button itself)
  document.addEventListener("click", (e)=>{
    if(btn.contains(e.target)) return;
    // toggle
    if(btn.classList.contains("show")){
      btn.classList.remove("show");
    } else {
      btn.classList.add("show");
    }
  });
  // on click, scrollTo top
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    window.scrollTo({top:0,behavior:"smooth"});
    btn.classList.remove("show");
  });
}

/* ---------- TEACHERS: try backend, fallback to local JSON ---------- */
async function fetchTeachers(){
  // try backend
  if(BACKEND_TEACHERS_URL){
    try{
      const r = await fetch(BACKEND_TEACHERS_URL, {cache:"no-cache"});
      if(r.ok){
        const json = await r.json();
        return json;
      } else {
        console.warn("Backend teachers returned not ok:", r.status);
      }
    }catch(err){
      console.warn("Backend fetch failed:", err);
    }
  }
  // fallback to local
  try{
    const r2 = await fetch(LOCAL_TEACHERS_URL, {cache:"no-cache"});
    if(r2.ok) return await r2.json();
    console.warn("Local teachers fetch not ok:", r2.status);
  }catch(e){ console.warn("Local teachers fetch failed:", e); }
  return [];
}

/* render teacher list into container with id="results" (if present) */
function renderTeachers(list){
  const container = document.getElementById("results");
  if(!container) return;
  container.innerHTML = "";
  if(!list || !list.length){
    const empty = document.getElementById("empty");
    if(empty) empty.style.display = "block";
    return;
  }
  if(document.getElementById("empty")) document.getElementById("empty").style.display = "none";
  list.forEach(t=>{
    const a = document.createElement("article");
    a.className = "card";
    a.innerHTML = `
      <div class="avatar" aria-hidden="true">${t.avatarText || (t.name? t.name[0] : "T")}</div>
      <div class="info">
        <div class="name">${t.name}</div>
        <div class="meta">${(t.subjects||[])[0] || ""} • ${t.city || ""}</div>
        <div class="bio">${t.bio ? (t.bio.length>120? t.bio.slice(0,120)+"…": t.bio) : ""}</div>
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
          <div class="rate">₺${t.rate ?? "-"}/hr</div>
          <button class="btn contact" data-id="${t.id}">Contact</button>
        </div>
      </div>
    `;
    container.appendChild(a);
  });
  // wire contact buttons to whatsapp helper
  container.querySelectorAll(".contact").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = btn.getAttribute("data-id");
      const teacher = list.find(x => String(x.id) === String(id));
      if(!teacher) return;
      const text = `Hi ${teacher.name}, I would like to book a lesson about ${teacher.subjects?teacher.subjects[0]:"English"}.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
    });
  });
}

/* ---------- BOOTSTRAP on DOMContentLoaded ---------- */
document.addEventListener("DOMContentLoaded", async ()=>{
  // 1) language
  const chosen = detectLanguage();
  setLS("site_lang", chosen);
  await applyTranslations(chosen);

  // wire language selector(s)
  document.querySelectorAll("[data-lang-select]").forEach(el => {
    el.value = chosen;
    el.addEventListener("change", async (e) => {
      const v = e.target.value;
      setLS("site_lang", v);
      await applyTranslations(v);
    });
  });

  // 2) theme
  const theme = detectTheme();
  applyTheme(theme);
  // wire theme toggle buttons (data-theme-toggle)
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const current = document.documentElement.hasAttribute("data-theme") ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  });

  // 3) navbar mobile behavior
  setupMobileMenu();
  // 4) whatsapp
  setupWhatsApp();
  // 5) scroll top toggle-on-click
  setupScrollTop();
  // 6) load teachers
  const teachers = await fetchTeachers();
  renderTeachers(teachers);
});
