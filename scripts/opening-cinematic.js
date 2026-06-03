/* =========================================================
   OPENING PARTICLES
========================================================= */

document.addEventListener(
"DOMContentLoaded",
()=>{

const opening =
document.querySelector(
".opening"
);

if(!opening) return;

/* =========================================================
   PARTICLE CONTAINER
========================================================= */

const particles =
document.createElement(
"div"
);

particles.className =
"opening-particles";

opening.appendChild(
particles
);

/* =========================================================
   CREATE PARTICLES
========================================================= */

for(let i=0;i<24;i++){

const particle =
document.createElement(
"span"
);

const size =
Math.random() * 12 + 6;

particle.style.width =
`${size}px`;

particle.style.height =
`${size}px`;

particle.style.left =
`${Math.random()*100}%`;

particle.style.animationDuration =
`${Math.random()*10+10}s`;

particle.style.animationDelay =
`${Math.random()*8}s`;

particle.style.opacity =
Math.random();

particles.appendChild(
particle
);

}

/* =========================================================
   PARALLAX
========================================================= */

window.addEventListener(
"scroll",
()=>{

const scrollY =
window.scrollY;

opening.style.transform =
`translateY(${scrollY * .08}px)`;

}
);

});

