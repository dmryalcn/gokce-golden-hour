/* =========================================================
   GÖKÇE & YALÇIN — CINEMATIC OPENING
   Tek dosya, temiz versiyon
========================================================= */

history.scrollRestoration = "manual";

document.addEventListener("DOMContentLoaded", () => {

  window.scrollTo(0, 0);

  /* ── ELEMENTS ──────────────────────────────────────── */
  const opening        = document.getElementById("openingScreen");
  const trigger        = document.getElementById("openSiteBtn");
  const music          = document.getElementById("bgMusic");
  const particlesLayer = document.querySelector(".cinematic-particles");

  if (!opening || !trigger) return;

  /* ── LOCK SCROLL ───────────────────────────────────── */
  document.body.style.overflow = "hidden";

  /* ── PARTICLES ─────────────────────────────────────── */
  const count = window.innerWidth < 768 ? 28 : 55;

  for (let i = 0; i < count; i++) {
    const p    = document.createElement("span");
    p.className = "gold-particle";

    const size  = Math.random() * 6 + 2;
    const op    = (.12 + Math.random() * .55).toFixed(2);
    const opMid = (parseFloat(op) + .2).toFixed(2);
    const dur   = (10 + Math.random() * 20).toFixed(1);
    const delay = (Math.random() * 10).toFixed(1);

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${(Math.random() * 100).toFixed(1)}%;
      top:${(20 + Math.random() * 90).toFixed(1)}%;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      --op-start:${op};
      --op-mid:${opMid};
    `;
    particlesLayer.appendChild(p);
  }

  /* ── EXTRA SHIMMER PARTICLES (büyük, yavaş) ─────── */
  for (let i = 0; i < 8; i++) {
    const p     = document.createElement("span");
    p.className = "gold-particle";
    const size  = Math.random() * 18 + 10;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${(Math.random() * 100).toFixed(1)}%;
      top:${(30 + Math.random() * 70).toFixed(1)}%;
      animation-duration:${(18 + Math.random() * 14).toFixed(1)}s;
      animation-delay:-${(Math.random() * 12).toFixed(1)}s;
      --op-start:0.04;
      --op-mid:0.12;
      filter:blur(3px);
    `;
    particlesLayer.appendChild(p);
  }

  /* ── LIGHT EXPLOSION EL ────────────────────────────── */
  const explosion = document.createElement("div");
  explosion.className = "light-explosion";
  opening.appendChild(explosion);

  /* ── OPEN ──────────────────────────────────────────── */
  let opened = false;

  trigger.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    /* Müzik */
    if (music) {
      music.volume = 0.32;
      music.play().catch(() => {});
    }

    /* Buton durumu */
    trigger.classList.add("opening-triggered");

    /* Işık patlaması */
    explosion.classList.add("active");

    /* Partiküller dağılıyor */
    document.querySelectorAll(".gold-particle").forEach((p, i) => {
      const angle  = (Math.PI * 2 / count) * i + Math.random() * .5;
      const dist   = 600 + Math.random() * 800;
      const tx     = Math.cos(angle) * dist;
      const ty     = Math.sin(angle) * dist;
      p.style.transition = `transform ${1.8 + Math.random() * 1}s cubic-bezier(.2,.8,.4,1), opacity 2s ease`;
      p.style.transform  = `translate(${tx}px,${ty}px) scale(0)`;
      p.style.opacity    = "0";
    });

    /* Ekran kararıyor → site açılıyor */
    opening.classList.add("cinematic-reveal");

    setTimeout(() => {
      opening.classList.add("hidden");
      document.body.style.overflow = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      /* Hash varsa yönlendir */
      const hash = location.hash;
      if (hash === "#memory") {
        const btn = document.getElementById("openMemoryBtn") || document.getElementById("heroMemoryBtn");
        if (btn) btn.click();
      }
      if (hash === "#rsvp") {
        const el = document.getElementById("rsvp");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }, 2400);

    /* DOM'dan tamamen kaldır */
    setTimeout(() => {
      opening.remove();
    }, 4400);
  });
});
