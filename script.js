/* =========================================================
   WE SAIL TOGETHER — charter site
   Bu dosya arayüz mantığını yönetir.
   Gerçek bir AI backend'i henüz bağlı değil — arama gönderildiğinde
   aşağıdaki EXAMPLE_BOATS listesinden örnek sonuçlar gösterilir.
   AI destekli gerçek eşleştirme için buraya bir API çağrısı eklenmeli.
   ========================================================= */

/* ---------- Reklam alanları ----------
   Reklam markalarını buraya ekle. Her obje bir reklam alanını temsil eder.
   logo alanı boş bırakılırsa gri kutu placeholder olarak görünür. */
const ADS_TOP = [
  { name: "Kiracı Restaurant", logo: "assets/kiraci-logo.jpg" },
];
const ADS_BOTTOM = [
  // { name: "Marka 2", logo: "ads/marka2.png", url: "https://..." },
];

function renderAds(container, ads) {
  if (!container) return;
  container.innerHTML = "";
  ads.forEach(ad => {
    const el = document.createElement(ad.url ? "a" : "div");
    if (ad.url) { el.href = ad.url; el.target = "_blank"; el.rel = "noopener"; }
    el.className = "ad-item";
    if (ad.logo) {
      const img = document.createElement("img");
      img.src = ad.logo;
      img.alt = ad.name || "sponsor";
      el.appendChild(img);
    } else {
      /* Logo dosyası henüz yoksa isim bazlı zarif bir rozet göster */
      const span = document.createElement("span");
      span.textContent = ad.name || "";
      el.appendChild(span);
    }
    container.appendChild(el);
  });
}
renderAds(document.getElementById("adSlotTop"), ADS_TOP);
renderAds(document.getElementById("adSlotBottom"), ADS_BOTTOM);

/* ---------- Örnek tekne verisi (demo amaçlı) ---------- */
const EXAMPLE_BOATS = [
  { name: "Deniz Yıldızı Gulet", cabins: 3, length: 18 },
  { name: "Poyraz Gulet", cabins: 3, length: 20 },
  { name: "Ege Prensesi Gulet", cabins: 3, length: 22 },
];

/* ---------- Dil desteği ---------- */
let currentLang = "en"; /* site ilk açıldığında varsayılan dil: İngilizce */
const langButtons = document.querySelectorAll(".lang-opt");
langButtons.forEach(btn => {
  btn.addEventListener("click", () => setLang(btn.dataset.setLang));
});

function setLang(lang) {
  currentLang = lang;
  document.documentElement.dataset.lang = lang;
  langButtons.forEach(b => b.classList.toggle("active", b.dataset.setLang === lang));

  document.querySelectorAll("[data-tr]").forEach(el => {
    const val = lang === "tr" ? el.dataset.tr : el.dataset.en;
    if (val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll("[data-tr-placeholder]").forEach(el => {
    const val = lang === "tr" ? el.dataset.trPlaceholder : el.dataset.enPlaceholder;
    if (val !== undefined) el.setAttribute("placeholder", val);
  });
}

/* Sayfa yüklendiğinde varsayılan dili (İngilizce) uygula */
setLang(currentLang);

/* ---------- Hamburger menü ---------- */
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
function openDrawer() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
}
function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}
document.getElementById("menuBtn").addEventListener("click", openDrawer);
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

/* Ana sayfadaki "Hizmetlerimiz" bağlantısı da aynı menüyü açar
   (hizmetler menünün en üstünde, üç başlık halinde zaten listeleniyor) */
document.getElementById("servicesLink").addEventListener("click", openDrawer);

/* ---------- Ekranlar arası geçiş ---------- */
const screenHome = document.getElementById("screenHome");
const screenResults = document.getElementById("screenResults");
const screenSuccess = document.getElementById("screenSuccess");
const chatThread = document.getElementById("chatThread");

function showScreen(screen) {
  [screenHome, screenResults, screenSuccess].forEach(s => s.hidden = true);
  screen.hidden = false;
  window.scrollTo(0, 0);
}

document.getElementById("backBtn").addEventListener("click", () => showScreen(screenHome));
document.getElementById("successHomeBtn").addEventListener("click", () => showScreen(screenHome));

/* ---------- Arama akışı ---------- */
function startSearch(queryText) {
  if (!queryText || !queryText.trim()) return;
  chatThread.innerHTML = "";
  showScreen(screenResults);

  addMessage(queryText, "user");

  setTimeout(() => {
    const introTr = "Anlaşıldı. Belirttiğiniz tarih ve kişi sayısına uygun olarak filomuzdan şu seçenekler bulunuyor:";
    const introEn = "Understood. Based on your dates and party size, here are a few options from our fleet:";
    addMessage(currentLang === "tr" ? introTr : introEn, "bot");
    addBoatList(EXAMPLE_BOATS);

    setTimeout(() => {
      const askTr = "Belirttiğiniz tarih ve kişi sayısına uygun teknelerin güncel müsaitlik ve fiyat bilgilerini size iletebilmemiz için lütfen e-posta adresinizi ve telefon numaranızı paylaşır mısınız?";
      const askEn = "To send you availability and pricing for your dates, could you share your email address and phone number?";
      addMessage(currentLang === "tr" ? askTr : askEn, "bot");
      addContactFields();
    }, 500);
  }, 400);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + (type === "user" ? "msg-user" : "msg-bot");
  div.textContent = text;
  chatThread.appendChild(div);
  chatThread.scrollTop = chatThread.scrollHeight;
}

function addBoatList(boats) {
  const wrap = document.createElement("div");
  wrap.className = "boat-list";
  boats.forEach(b => {
    const card = document.createElement("div");
    card.className = "boat-card";
    const cabinsLabel = currentLang === "tr" ? "kabin" : "cabins";
    card.innerHTML = `
      <div class="boat-icon"><i class="ti ti-sailboat"></i></div>
      <div class="boat-info">
        <p class="boat-name">${b.name}</p>
        <p class="boat-meta">${b.cabins} ${cabinsLabel} · ${b.length}m</p>
      </div>`;
    wrap.appendChild(card);
  });
  chatThread.appendChild(wrap);
  chatThread.scrollTop = chatThread.scrollHeight;
}

function addContactFields() {
  const wrap = document.createElement("div");
  wrap.className = "contact-fields";
  const emailPh = currentLang === "tr" ? "E-posta adresiniz" : "Your email address";
  const phonePh = currentLang === "tr" ? "Telefon numaranız (WhatsApp)" : "Your phone number (WhatsApp)";
  const btnLabel = currentLang === "tr" ? "Gönder" : "Send";
  wrap.innerHTML = `
    <input type="email" id="contactEmail" placeholder="${emailPh}" required>
    <input type="tel" id="contactPhone" placeholder="${phonePh}" required>
    <button type="button" class="btn-primary" id="contactSubmit" style="margin-top:4px;">${btnLabel}</button>
  `;
  chatThread.appendChild(wrap);
  chatThread.scrollTop = chatThread.scrollHeight;

  document.getElementById("contactSubmit").addEventListener("click", () => {
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    if (!email || !phone) return;

    /* TODO: Burada e-posta/telefonu kendi backend'ine veya bir form servisine
       (örn. Formspree, Google Sheets API, e-posta gönderim servisi) POST etmelisin.
       Şu an sadece konsola yazdırıyor ve başarı ekranını gösteriyor. */
    console.log("Yeni charter talebi:", { email, phone, query: chatThread.querySelector(".msg-user")?.textContent });

    showScreen(screenSuccess);
  });
}

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("searchInput");
  startSearch(input.value);
  input.value = "";
});

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const q = currentLang === "tr" ? chip.dataset.queryTr : chip.dataset.queryEn;
    startSearch(q);
  });
});

document.getElementById("followupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("followupInput");
  if (input.value.trim()) {
    addMessage(input.value, "user");
    input.value = "";
  }
});
