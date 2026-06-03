history.scrollRestoration =
"manual";

document.addEventListener(
"DOMContentLoaded",
()=>{

window.scrollTo(0,0);

/* =========================================================
   ELEMENTS
========================================================= */

const opening =
document.getElementById(
"openingScreen"
);

const trigger =
document.getElementById(
"openSiteBtn"
);

const music =
document.getElementById(
"bgMusic"
);

const particlesLayer =
document.querySelector(
".cinematic-particles"
);

if(
!opening ||
!trigger
) return;

/* =========================================================
   LOCK SCROLL
========================================================= */

document.body.style.overflow =
"hidden";

/* =========================================================
   PARTICLES
========================================================= */

const particleCount =
window.innerWidth < 768
? 22
: 45;

for(let i=0;i<particleCount;i++){

const particle =
document.createElement("span");

particle.className =
"gold-particle";

const size =
Math.random() * 5 + 2;

particle.style.width =
size + "px";

particle.style.height =
size + "px";

particle.style.left =
Math.random() * 100 + "%";

particle.style.top =
Math.random() * 100 + "%";

particle.style.animationDuration =
10 + Math.random() * 18 + "s";

particle.style.animationDelay =
Math.random() * 8 + "s";

particle.style.opacity =
.15 + Math.random() * .6;

particlesLayer.appendChild(
particle
);

}

/* =========================================================
   LIGHT EXPLOSION
========================================================= */

const explosion =
document.createElement("div");

explosion.className =
"light-explosion";

opening.appendChild(
explosion
);

/* =========================================================
   CINEMATIC OPEN
========================================================= */

let opened = false;

trigger.addEventListener(
"click",
()=>{

if(opened) return;

opened = true;

/* MUSIC */

if(music){

music.volume = 0.35;

music.play().catch(()=>{});

}

/* BUTTON */

trigger.classList.add(
"opening-triggered"
);

/* EXPLOSION */

explosion.classList.add(
"active"
);

/* PARTICLES BURST */

document.querySelectorAll(
".gold-particle"
).forEach((particle,index)=>{

particle.style.transition =
`
transform 2.5s ease,
opacity 2.5s ease
`;

const x =
(Math.random() - .5)
* 1200;

const y =
(Math.random() - .5)
* 1200;

particle.style.transform =
`
translate(${x}px,${y}px)
scale(0)
`;

particle.style.opacity =
"0";

});

/* BACKGROUND */

opening.classList.add(
"cinematic-reveal"
);

/* REMOVE */

setTimeout(()=>{

opening.classList.add(
"hidden"
);

document.body.style.overflow =
"auto";

window.scrollTo({
top:0,
left:0,
behavior:"instant"
});

},2200);

/* CLEANUP */

setTimeout(()=>{

opening.remove();

},4200);

});

});

