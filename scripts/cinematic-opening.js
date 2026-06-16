/* ==========================================================
   GÖKÇE & YALÇIN — CİNEMATİK OPENING JS
========================================================== */

(function () {
  "use strict";

  function createParticles(container, count) {

    for (let i = 0; i < count; i++) {

      const p = document.createElement("span");

      p.className = "particle";

      p.style.cssText = `
        left:${Math.random() * 100}%;
        top:${40 + Math.random() * 55}%;
        --dur:${6 + Math.random() * 10}s;
        --delay:${Math.random() * 8}s;
        --drift:${(Math.random() - 0.5) * 60}px;
        width:${1 + Math.random() * 2.5}px;
        height:${1 + Math.random() * 2.5}px;
      `;

      container.appendChild(p);
    }
  }

  /* ==========================================================
     HASH'E GÖRE MODAL AÇ
  ========================================================== */

  function openTargetModal() {

    const hash = window.location.hash.toLowerCase();

    if (hash === "#rsvp") {

      const modal =
        document.getElementById("rsvp-modal");

      if (modal) {
        modal.classList.add("open");
      }
    }

    if (hash === "#memory") {

      const modal =
        document.getElementById("memory-modal");

      if (modal) {
        modal.classList.add("open");
      }
    }
  }

  /* ==========================================================
     OPENING KAPAT
  ========================================================== */

  function closeOpening() {

    const opening =
      document.getElementById("cinematic-opening");

    if (!opening) return;

    opening.classList.add("hidden");

    setTimeout(() => {

      opening.remove();

      document.body.style.overflow = "";

      openTargetModal();

    }, 1300);
  }

  /* ==========================================================
     INIT
  ========================================================== */

  function init() {

    const opening =
      document.getElementById("cinematic-opening");

    if (!opening) return;

    const hash =
      window.location.hash.toLowerCase();

    /* ==========================================================
       QR LİNKLERİNDE OPENING ATLANSIN
    ========================================================== */

    if (
      hash === "#rsvp" ||
      hash === "#memory"
    ) {

      opening.remove();

      document.body.style.overflow = "";

      setTimeout(() => {

        openTargetModal();

      }, 100);

      return;
    }

    /* Normal ziyaretçiler için opening devam etsin */

    document.body.style.overflow = "hidden";

    const tag =
      opening.querySelector(".opening-tag");

    const btn =
      opening.querySelector(".opening-btn");

    /* RSVP QR */

    if (hash === "#rsvp") {

      if (tag) {
        tag.textContent =
          "Katılım Durumunuzu Bildirin";
      }

      if (btn) {
        btn.textContent =
          "Katılım Formuna Geç";
      }
    }

    /* MEMORY QR */

    if (hash === "#memory") {

      if (tag) {
        tag.textContent =
          "Bize Bir Anı Bırakın";
      }

      if (btn) {
        btn.textContent =
          "Anı Bırak";
      }
    }

    const particleContainer =
      opening.querySelector(".opening-particles");

    if (particleContainer) {

      createParticles(
        particleContainer,
        28
      );
    }

    if (btn) {

      btn.addEventListener(
        "click",
        closeOpening
      );
    }

    document.addEventListener(
      "keydown",
      function handler(e) {

        if (
          ["Enter", " ", "Escape"]
          .includes(e.key)
        ) {

          closeOpening();

          document.removeEventListener(
            "keydown",
            handler
          );
        }
      }
    );

    setTimeout(
      closeOpening,
      12000
    );
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
