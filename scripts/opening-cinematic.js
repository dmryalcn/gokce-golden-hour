history.scrollRestoration = "manual";

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  const opening = document.getElementById("openingScreen");
  const trigger = document.getElementById("openSiteBtn");
  const music   = document.getElementById("bgMusic");
  const particlesLayer = document.querySelector(".cinematic-particles");

  if (!opening || !trigger) return;

  /* Scroll kilitle */
  document.body.style.overflow = "hidden";

  /* ── Partiküller ── */
  const count = window.innerWidth < 768 ? 28 : 55;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const isLarge = i < Math.floor(count * 0.22);
    p.className = "gold-particle" + (isLarge ? " large" : "");

    const size = isLarge
      ? Math.random() * 5 + 4
      : Math.random() * 3 + 1.5;

    const op = 0.12 + Math.random() * (isLarge ? 0.55 : 0.38);

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      top:${85 + Math.random() * 25}%;
      animation-duration:${12 + Math.random() * 20}s;
      animation-delay:${Math.random() * 10}s;
      --op:${op};
    `;
    particlesLayer.appendChild(p);
  }

  /* ── Işık patlaması elementi ── */
  const explosion = document.createElement("div");
  explosion.className = "light-explosion";
  opening.appendChild(explosion);

  /* ── Açılış butonu ── */
  let opened = false;

  trigger.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    /* Müzik */
    if (music) {
      music.volume = 0.32;
      music.play().catch(() => {});
    }

    /* Buton gizle */
    trigger.classList.add("opening-triggered");

    /* Patlama */
    explosion.classList.add("active");

    /* Partiküller saç */
    document.querySelectorAll(".gold-particle").forEach(p => {
      const x = (Math.random() - 0.5) * 1400;
      const y = (Math.random() - 0.5) * 1000 - 300;
      p.style.transition = "transform 2.8s cubic-bezier(.22,.68,0,1.2), opacity 2.4s ease";
      p.style.transform  = `translate(${x}px,${y}px) scale(0)`;
      p.style.opacity    = "0";
    });

    /* Arka plan karart */
    opening.classList.add("cinematic-reveal");

    /* Kapat */
    setTimeout(() => {
      opening.classList.add("hidden");
      document.body.style.overflow = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      /* Hash yönlendirme (QR kodlar için) */
      const hash = window.location.hash;
      if (hash === "#memory") {
        document.getElementById("memoryModal")?.classList.add("active");
      } else if (hash === "#rsvp") {
        document.getElementById("rsvpModal")?.classList.add("active");
      }
    }, 2400);

    /* Temizle */
    setTimeout(() => {
      opening.remove();
    }, 4000);
  });
});
