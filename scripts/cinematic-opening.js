/* ==========================================================
   GÖKÇE & YALÇIN — CİNEMATİK OPENING JS
   scripts/cinematic-opening.js
========================================================== */

(function () {
  "use strict";

  /* ── Particle factory ── */
  function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${40 + Math.random() * 55}%;
        --dur: ${6 + Math.random() * 10}s;
        --delay: ${Math.random() * 8}s;
        --drift: ${(Math.random() - 0.5) * 60}px;
        width: ${1 + Math.random() * 2.5}px;
        height: ${1 + Math.random() * 2.5}px;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }

  /* ── Close opening ── */
  function closeOpening() {
    const opening = document.getElementById("cinematic-opening");
    if (!opening) return;
    opening.classList.add("hidden");
    setTimeout(() => {
      opening.remove();
      document.body.style.overflow = "";
    }, 1300);
  }

  /* ── Init ── */
  function init() {
    const opening = document.getElementById("cinematic-opening");
    if (!opening) return;

    /* Lock scroll */
    document.body.style.overflow = "hidden";

    /* Create particles */
    const particleContainer = opening.querySelector(".opening-particles");
    if (particleContainer) {
      createParticles(particleContainer, 28);
    }

    /* CTA button */
    const btn = opening.querySelector(".opening-btn");
    if (btn) {
      btn.addEventListener("click", closeOpening);
    }

    /* Keyboard: Enter / Space / Escape */
    document.addEventListener("keydown", function handler(e) {
      if (["Enter", " ", "Escape"].includes(e.key)) {
        closeOpening();
        document.removeEventListener("keydown", handler);
      }
    });

    /* Auto-close after 12s */
    setTimeout(closeOpening, 12000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
    });

});
