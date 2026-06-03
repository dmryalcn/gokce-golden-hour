history.scrollRestoration =
"manual";

document.addEventListener(
"DOMContentLoaded",
()=>{

window.scrollTo(0,0);

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

if(
!opening ||
!trigger
) return;

document.body.style.overflow =
"hidden";

/* =========================================================
   PARTICLES
========================================================= */

const particleContainer =
document.querySelector(
".cinematic-particles"
);

for(let i=0;i<28;i++){

const particle =
document.createElement("div");

particle.style.position =
"absolute";

particle.style.width =
Math.random() * 6 + 2 + "px";

particle.style.height =
particle.style.width;

particle.style.borderRadius =
"50%";

particle.style.background =
"rgba(255,255,255,.85)";

particle.style.left =
Math.random() * 100 + "%";

particle.style.top =
Math.random() * 100 + "%";

particle.style.opacity =
Math.random() * .5;

particle.style.filter =
"blur(1px)";

particle.style.animation =

`
floatParticle
${10 + Math.random()*14}s
linear infinite
`;

particleContainer.appendChild(
particle
);

}

/* =========================================================
   PARTICLE STYLE
========================================================= */

const style =
document.createElement("style");

style.innerHTML =

`
@keyframes floatParticle{

0%{

transform:
translateY(0px);

}

50%{

transform:
translateY(-40px);

}

100%{

transform:
translateY(0px);

}

}
`;

document.head.appendChild(
style
);

/* =========================================================
   OPEN
========================================================= */

trigger.addEventListener(
"click",
()=>{

if(music){

music.volume = 0.32;

music.play().catch(()=>{});

}

trigger.style.transform =

"scale(18)";

trigger.style.opacity =
"0";

opening.style.transition =

`
opacity 2s ease,
visibility 2s ease,
filter 2s ease
`;

opening.style.filter =
"blur(20px)";

setTimeout(()=>{

opening.classList.add(
"hidden"
);

document.body.style.overflow =
"auto";

window.scrollTo({
top:0,
left:0
});

},1200);

setTimeout(()=>{

opening.remove();

},3000);

});

});


