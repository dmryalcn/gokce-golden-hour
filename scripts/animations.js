/* =========================================================
   GÖKÇE & YALÇIN
   PREMIUM ANIMATIONS JS
   Scroll Reveal + Parallax + Luxury Confetti
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     Açılış ekranı bitince çalıştır
  ========================================================= */

  function afterOpening(callback) {
    const opening = document.getElementById("cinematic-opening");

    if (!opening || opening.classList.contains("hidden")) {
      callback();
      return;
    }

    const observer = new MutationObserver(() => {
      if (opening.classList.contains("hidden")) {
        observer.disconnect();
        setTimeout(() => { callback(); }, 300);
      }
    });

    observer.observe(opening, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  function initScrollReveal() {
    const elements = document.querySelectorAll(
      ".section-title, .card, .time-box, .cards, .countdown, .luxury-map, .memory-note"
    );

    elements.forEach((element, index) => {
      element.classList.add("reveal");

      const delay = index % 4;
      if (delay === 1) element.classList.add("reveal-delay-1");
      if (delay === 2) element.classList.add("reveal-delay-2");
      if (delay === 3) element.classList.add("reveal-delay-3");
    });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0,              // ← 0.12 → 0
    rootMargin: "0px 0px -40px 0px"   // ← ekranın 40px yukarısına gelince tetikle
  }
);

  /* =========================================================
     HERO PARALLAX
  ========================================================= */

  function initParallax() {
    const heroBg = document.querySelector(".hero-bg");
    if (!heroBg) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* =========================================================
     LUXURY CONFETTI
  ========================================================= */

  const COLORS = ["#c9a96e", "#e8d5b0", "#f0ece4", "#fff8e7"];

  function launchConfetti() {
    const count = window.innerWidth < 768 ? 18 : 32;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const piece = document.createElement("div");
        piece.className = "gy-confetti-particle";

        const size = 4 + Math.random() * 4;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.left = `${10 + Math.random() * 80}%`;
        piece.style.top = "-10px";
        piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        piece.style.animationDuration = `${1.5 + Math.random()}s`;

        document.body.appendChild(piece);
        setTimeout(() => { piece.remove(); }, 3500);
      }, i * 25);
    }
  }

  /* =========================================================
     CUSTOM EVENTS
  ========================================================= */

  window.addEventListener("gy:memorySent", launchConfetti);
  window.addEventListener("gy:rsvpSent", launchConfetti);

  /* =========================================================
     FORM FALLBACK
  ========================================================= */

  const memoryForm = document.getElementById("memoryForm");
  if (memoryForm) {
    memoryForm.addEventListener("submit", () => {
      setTimeout(() => {
        const modal = document.getElementById("memoryModal");
        if (modal && !modal.classList.contains("active")) {
          launchConfetti();
        }
      }, 2200);
    });
  }

  const rsvpForm = document.getElementById("rsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", () => {
      setTimeout(() => {
        const modal = document.getElementById("rsvpModal");
        if (modal && !modal.classList.contains("active")) {
          launchConfetti();
        }
      }, 1800);
    });
  }

  /* =========================================================
     BAŞLAT
  ========================================================= */

  afterOpening(() => {
    initScrollReveal();
    initParallax();
  });

});
