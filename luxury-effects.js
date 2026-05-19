document.addEventListener("DOMContentLoaded",()=>{

  /* =========================
     CURSOR GLOW
  ========================= */

  const glow = document.createElement("div");

  glow.className = "cursor-glow";

  document.body.appendChild(glow);

  document.addEventListener("mousemove",(e)=>{

    glow.style.left = e.clientX + "px";

    glow.style.top = e.clientY + "px";

  });

  /* =========================
     LUXURY PARTICLES
  ========================= */

  const particleContainer =
    document.createElement("div");

  particleContainer.className =
    "luxury-particles";

  document.body.appendChild(
    particleContainer
  );

  function createParticle(){

    const particle =
      document.createElement("div");

    particle.className =
      "luxury-particle";

    /* RANDOM SIZE */

    const sizes = [
      "small",
      "medium",
      "large"
    ];

    particle.classList.add(

      sizes[
        Math.floor(
          Math.random() * sizes.length
        )
      ]

    );

    /* POSITION */

    particle.style.left =
      Math.random() * 100 + "vw";

    /* SPEED */

    const duration =
      12 + Math.random() * 18;

    particle.style.animationDuration =
      duration + "s";

    /* DELAY */

    particle.style.animationDelay =
      Math.random() * 3 + "s";

    /* OPACITY */

    particle.style.opacity =
      .25 + Math.random() * .45;

    particleContainer.appendChild(
      particle
    );

    /* REMOVE */

    setTimeout(()=>{

      particle.remove();

    }, duration * 1000);

  }

  /* INITIAL PARTICLES */

  for(let i=0;i<18;i++){

    createParticle();

  }

  /* LOOP */

  setInterval(()=>{

    createParticle();

  },1800);

  /* =========================
     IMAGE DEPTH
  ========================= */

  const galleryImages =
    document.querySelectorAll(
      ".gallery img"
    );

  galleryImages.forEach(img=>{

    img.addEventListener(
      "mousemove",
      (e)=>{

        const rect =
          img.getBoundingClientRect();

        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;

        const rotateY =
          ((x / rect.width) - .5) * 10;

        const rotateX =
          ((y / rect.height) - .5) * -10;

        img.style.transform =
          `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.03)
          `;
      }
    );

    img.addEventListener(
      "mouseleave",
      ()=>{

        img.style.transform = "";

      }
    );

  });

});
