document.addEventListener("DOMContentLoaded", () => {

const isMobile = window.innerWidth < 768;

/* =========================================================
CURSOR GLOW
========================================================= */

if (!isMobile) {

```
const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;

  glow.style.left = currentX + "px";
  glow.style.top = currentY + "px";

  requestAnimationFrame(animateGlow);
}

animateGlow();
```

}

/* =========================================================
GOLD LIGHT
========================================================= */

const goldLight = document.createElement("div");
goldLight.className = "gold-light";
document.body.appendChild(goldLight);

/* =========================================================
ORBS
========================================================= */

["one", "two"].forEach(name => {
const orb = document.createElement("div");
orb.className = `blur-orb ${name}`;
document.body.appendChild(orb);
});

/* =========================================================
PARTICLES
========================================================= */

const particleContainer = document.createElement("div");
particleContainer.className = "luxury-particles";
document.body.appendChild(particleContainer);

const particleLimit = isMobile ? 10 : 20;

function createParticle() {

```
const particle = document.createElement("div");
particle.className = "luxury-particle";

const sizes = ["small", "medium", "large"];
particle.classList.add(
  sizes[Math.floor(Math.random() * sizes.length)]
);

particle.style.left = Math.random() * 100 + "vw";

const duration = 16 + Math.random() * 18;

particle.style.animationDuration = duration + "s";
particle.style.animationDelay = Math.random() * 4 + "s";
particle.style.opacity = .12 + Math.random() * .45;

particleContainer.appendChild(particle);

setTimeout(() => {
  particle.remove();
}, duration * 1000);
```

}

for (let i = 0; i < particleLimit; i++) {
createParticle();
}

setInterval(() => {
if (particleContainer.children.length < particleLimit) {
createParticle();
}
}, 1800);

/* =========================================================
REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
".section-title, .card, .time-box, .countdown, .memory-card, .gallery-item"
);

const revealObserver = new IntersectionObserver(
(entries) => {

```
  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);

    }

  });

},
{
  threshold: 0.12
}
```

);

revealElements.forEach(el => {
el.classList.add("reveal");
revealObserver.observe(el);
});

/* =========================================================
GOLD LIGHT FOLLOW
========================================================= */

if (!isMobile) {

```
document.addEventListener("mousemove", (e) => {

  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  goldLight.style.transform =
    `translate(${x * 40}px, ${y * 40}px)`;

});
```

}

/* =========================================================
GALLERY HOVER
========================================================= */

if (!isMobile) {

```
document.querySelectorAll(".gallery img").forEach(img => {

  img.addEventListener("mousemove", (e) => {

    const rect = img.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - .5) * 7;
    const rotateX = ((y / rect.height) - .5) * -7;

    img.style.transform =
      `perspective(1200px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       scale(1.02)`;

  });

  img.addEventListener("mouseleave", () => {
    img.style.transform = "";
  });

});
```

}

/* =========================================================
BUTTON MAGNETIC
========================================================= */

if (!isMobile) {

```
document.querySelectorAll(
  ".btn,.btn-gold,.send-btn,.floating-memory"
).forEach(btn => {

  btn.addEventListener("mousemove", (e) => {

    const rect = btn.getBoundingClientRect();

    const moveX =
      (e.clientX - rect.left - rect.width / 2) * .08;

    const moveY =
      (e.clientY - rect.top - rect.height / 2) * .08;

    btn.style.transform =
      `translate(${moveX}px, ${moveY}px)`;

  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });

});
```

}

/* =========================================================
IOS FIX
========================================================= */

document.querySelectorAll(
".hero-content,.card,.memory-card,.gallery img,.time-box"
).forEach(el => {

```
el.style.backfaceVisibility = "hidden";
el.style.transformStyle = "preserve-3d";
```

});

document.body.classList.add("site-ready");

});
