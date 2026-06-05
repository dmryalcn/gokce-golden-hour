/* =========================================================
   GÖKÇE & YALÇIN — ANİMASYONLAR
   6 animasyon: Konfeti, Scroll Reveal, Typewriter,
   Parallax Hero, Hover Çerçeve, Parti Modu
   Mevcut hiçbir koda dokunulmaz.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     YARDIMCI — Sinematik açılış bitene kadar bekle
  ========================================================= */
  function afterOpening(fn) {
    const opening = document.getElementById("openingScreen");
    if (!opening || opening.classList.contains("hidden")) {
      fn();
      return;
    }
    const observer = new MutationObserver(() => {
      if (opening.classList.contains("hidden")) {
        observer.disconnect();
        setTimeout(fn, 300);
      }
    });
    observer.observe(opening, { attributes: true, attributeFilter: ["class"] });
  }

  /* =========================================================
     1. SCROLL REVEAL
     section-title, .card, .time-box, .memory-card
     elementlerine otomatik .reveal sınıfı eklenir
  ========================================================= */

  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".section-title, .card, .time-box, .cards, .countdown, .luxury-map, .memory-note"
    );

    targets.forEach((el, i) => {
      el.classList.add("reveal");
      if (i % 4 === 1) el.classList.add("reveal-delay-1");
      if (i % 4 === 2) el.classList.add("reveal-delay-2");
      if (i % 4 === 3) el.classList.add("reveal-delay-3");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => io.observe(el));
  }

  /* =========================================================
     2. TYPEWRITER
     Hero h1 içindeki metni sırayla yazar/siler
     h1 içeriği korunur, sadece yazı efekti eklenir
  ========================================================= */

  function initTypewriter() {
    const h1 = document.querySelector(".hero h1");
    if (!h1) return;

    const phrases = [
      "Gökçe & Yalçın",
      "26 Haziran 2026",
      "Nişan Daveti 🤍",
    ];

    /* h1 içeriğini koru — başlangıçta ilk phrase gösterilir */
    const span = document.createElement("span");
    span.className = "typewriter-word";
    span.textContent = phrases[0];

    const cursor = document.createElement("span");
    cursor.className = "typewriter-cursor";

    h1.textContent = "";
    h1.appendChild(span);
    h1.appendChild(cursor);

    let phraseIdx = 0;
    let charIdx   = phrases[0].length;
    let deleting  = false;

    function tick() {
      const current = phrases[phraseIdx];

      if (!deleting) {
        span.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
      } else {
        span.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }

      setTimeout(tick, deleting ? 45 : 85);
    }

    /* 3 saniye sonra döngüye gir — önce statik okusunlar */
    setTimeout(() => {
      deleting = true;
      tick();
    }, 3000);
  }

  /* =========================================================
     3. PARALLAX HERO
     Sayfa kaydırılınca hero arka planı daha yavaş kayar
  ========================================================= */

  function initParallax() {
    const heroBg = document.querySelector(".hero-bg");
    if (!heroBg) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     4. KONFETİ
     form gönderilince tetiklenir — upload.js showPopup
     yerine buradan dinleniyor (custom event)
  ========================================================= */

  const CONFETTI_COLORS = [
    "#c9a96e", "#e8d5b0", "#f0ece4",
    "#a07840", "#ffd700", "#fff8e7"
  ];

  function launchConfetti() {
    const count = window.innerWidth < 768 ? 50 : 90;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const p = document.createElement("div");
        p.className = "gy-confetti-particle";

        const size = 4 + Math.random() * 7;
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const left  = 10 + Math.random() * 80; /* % */
        const dur   = 1.2 + Math.random() * 1.6;
        const delay = Math.random() * 0.5;

        p.style.cssText = `
          left: ${left}%;
          top: -10px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
          animation-duration: ${dur}s;
          animation-delay: ${delay}s;
        `;

        document.body.appendChild(p);
        setTimeout(() => p.remove(), (dur + delay + 0.3) * 1000);
      }, i * 18);
    }
  }

  /* Firestore başarısında tetiklenecek custom event */
  window.addEventListener("gy:memorySent", launchConfetti);
  window.addEventListener("gy:rsvpSent",   launchConfetti);

  /* upload.js'deki closeAllModals + showPopup'tan önce
     bu eventleri dispatch edebilmek için upload.js'de
     aşağıdaki satırları eklemek yeterli:
     window.dispatchEvent(new Event("gy:memorySent"));
     window.dispatchEvent(new Event("gy:rsvpSent"));
     Ama upload.js'e dokunmak istemiyorsak alternatif:
     form submit'i dinle */

  const memoryForm = document.getElementById("memoryForm");
  const rsvpForm   = document.getElementById("rsvpForm");

  /* Başarıyla gönderilince modal kapanıyor — bunu izle */
  if (memoryForm) {
    memoryForm.addEventListener("submit", () => {
      /* 2 saniye sonra modal kapanmışsa konfeti at */
      setTimeout(() => {
        const modal = document.getElementById("memoryModal");
        if (modal && !modal.classList.contains("active")) {
          launchConfetti();
        }
      }, 2200);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", () => {
      setTimeout(() => {
        const modal = document.getElementById("rsvpModal");
        if (modal && !modal.classList.contains("active")) {
          launchConfetti();
        }
      }, 1500);
    });
  }

  /* =========================================================
     5. PARTİ MODU
     Nişan günü (26 Haziran 2026) body'ye .party-mode eklenir
     1 saat öncesinden aktif olur
  ========================================================= */

  function initPartyMode() {
    const NISANDATE  = new Date("2026-06-26T19:00:00").getTime();
    const ONE_HOUR   = 60 * 60 * 1000;
    const now        = Date.now();
    const diff       = NISANDATE - now;

    /* Nişana 1 saat kala veya nişan günü parti modu */
    const isPartyTime = diff <= ONE_HOUR && diff > -(6 * 60 * 60 * 1000);

    if (isPartyTime) {
      activatePartyMode();
    } else if (diff > 0 && diff <= ONE_HOUR) {
      /* Tam zamanında aktif et */
      setTimeout(activatePartyMode, diff - ONE_HOUR);
    }
  }

  function activatePartyMode() {
    document.body.classList.add("party-mode");

    /* Parti banner ekle */
    const existingBanner = document.querySelector(".party-banner");
    if (!existingBanner) {
      const banner = document.createElement("div");
      banner.className = "party-banner";
      banner.textContent = "🎉 Bugün Nişan! · 26 Haziran 2026 · Gökçe & Yalçın 🤍";
      document.body.prepend(banner);
    }

    /* Banner yüksekliği kadar içeriği aşağı it */
    setTimeout(() => {
      const banner = document.querySelector(".party-banner");
      if (banner) {
        document.body.style.paddingTop = banner.offsetHeight + "px";
      }
    }, 100);

    /* Konfeti yağmuru — her 8 saniyede bir */
    launchConfetti();
    const partyInterval = setInterval(launchConfetti, 8000);

    /* 6 saat sonra durdur */
    setTimeout(() => {
      clearInterval(partyInterval);
    }, 6 * 60 * 60 * 1000);
  }

  /* =========================================================
     BAŞLAT
     Sinematik açılış bittikten sonra animasyonları çalıştır
  ========================================================= */

  afterOpening(() => {
    initScrollReveal();
    initTypewriter();
    initParallax();
    initPartyMode();
    /* Hover çerçeve efekti saf CSS — JS gerekmez */
  });

});
