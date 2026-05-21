document.addEventListener("DOMContentLoaded",()=>{

/* =========================
   CURSOR GLOW
========================= */

const isMobile =
window.innerWidth < 768;

if(!isMobile){

const glow =
document.createElement("div");

glow.className =
"cursor-glow";

document.body.appendChild(glow);

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

const particleLimit =
isMobile ? 10 : 18;

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
14 + Math.random() * 18;

particle.style.animationDuration =
duration + "s";

/* DELAY */

particle.style.animationDelay =
Math.random() * 3 + "s";

/* OPACITY */

particle.style.opacity =
.18 + Math.random() * .45;

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

},2000);

/* =========================
   IMAGE DEPTH
========================= */

if(!isMobile){

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
((x / rect.width) - .5) * 8;

const rotateX =
((y / rect.height) - .5) * -8;

img.style.transform =

`
perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale(1.025)
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

/* =========================
   SMOOTH SECTION REVEAL
========================= */

const sections =
document.querySelectorAll(
"section"
);

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
"section-visible"
);

}

});

},

{
threshold:.12
}

);

sections.forEach(section=>{

observer.observe(section);

});

});
