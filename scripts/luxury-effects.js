document.addEventListener(
"DOMContentLoaded",
()=>{

/* =========================================================
   DEVICE CHECK
========================================================= */

const isMobile =
window.innerWidth < 768;

/* =========================================================
   CURSOR GLOW
========================================================= */

if(!isMobile){

const glow =
document.createElement("div");

glow.className =
"cursor-glow";

document.body.appendChild(
glow
);

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

document.addEventListener(
"mousemove",
(e)=>{

mouseX = e.clientX;
mouseY = e.clientY;

}
);

function animateGlow(){

currentX +=
(mouseX - currentX) * 0.12;

currentY +=
(mouseY - currentY) * 0.12;

glow.style.left =
currentX + "px";

glow.style.top =
currentY + "px";

requestAnimationFrame(
animateGlow
);

}

animateGlow();

}

/* =========================================================
   GOLD ATMOSPHERE
========================================================= */

const goldLight =
document.createElement("div");

goldLight.className =
"gold-light";

document.body.appendChild(
goldLight
);

/* =========================================================
   BLUR ORBS
========================================================= */

const orbOne =
document.createElement("div");

orbOne.className =
"blur-orb one";

document.body.appendChild(
orbOne
);

const orbTwo =
document.createElement("div");

orbTwo.className =
"blur-orb two";

document.body.appendChild(
orbTwo
);

/* =========================================================
   PARTICLE SYSTEM
========================================================= */

const particleContainer =
document.createElement("div");

particleContainer.className =
"luxury-particles";

document.body.appendChild(
particleContainer
);

const particleLimit =
isMobile ? 10 : 22;

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
16 + Math.random() * 18;

particle.style.animationDuration =
duration + "s";

/* DELAY */

particle.style.animationDelay =
Math.random() * 4 + "s";

/* OPACITY */

particle.style.opacity =
.12 + Math.random() * .45;

particleContainer.appendChild(
particle
);

/* REMOVE */

setTimeout(()=>{

particle.remove();

}, duration * 1000);

}

/* INITIAL */

for(let i=0;i<particleLimit;i++){

createParticle();

}

/* LOOP */

setInterval(()=>{

if(
particleContainer.children.length
< particleLimit
){

createParticle();

}

},1800);

/* =========================================================
   CINEMATIC REVEAL
========================================================= */

const revealElements =
document.querySelectorAll(

`
.section-header,
.card,
.memory-box,
.time-box,
.gallery-item
`

);

const revealObserver =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
"visible"
);

}

});

},

{
threshold:.12
}

);

revealElements.forEach(el=>{

el.classList.add("reveal");

revealObserver.observe(el);

});

/* =========================================================
   IMAGE DEPTH
========================================================= */

if(!isMobile){

document.addEventListener(
"mousemove",
(e)=>{

const x =
e.clientX /
window.innerWidth;

const y =
e.clientY /
window.innerHeight;

goldLight.style.transform =

`
translate(
${x * 40}px,
${y * 40}px
)
`;

}
);

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
((x / rect.width) - .5) * 7;

const rotateX =
((y / rect.height) - .5) * -7;

img.style.transform =

`
perspective(1200px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale(1.02)
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

}

/* =========================================================
   BUTTON MAGNETIC FEEL
========================================================= */

if(!isMobile){

const buttons =
document.querySelectorAll(
".btn,.btn-gold,.send-btn"
);

buttons.forEach(btn=>{

btn.addEventListener(
"mousemove",
(e)=>{

const rect =
btn.getBoundingClientRect();

const x =
e.clientX - rect.left;

const y =
e.clientY - rect.top;

const moveX =
(x - rect.width/2) * .08;

const moveY =
(y - rect.height/2) * .08;

btn.style.transform =

`
translate(
${moveX}px,
${moveY}px
)
`;

}
);

btn.addEventListener(
"mouseleave",
()=>{

btn.style.transform = "";

}
);

});

}

/* =========================================================
   IOS PERFORMANCE FIX
========================================================= */

document.querySelectorAll(

`
.hero-content,
.card,
.memory-box,
.gallery img,
.time-box
`

).forEach(el=>{

el.style.backfaceVisibility =
"hidden";

el.style.transformStyle =
"preserve-3d";

});

/* =========================================================
   PAGE READY
========================================================= */

document.body.classList.add(
"site-ready"
);

});

   
   

