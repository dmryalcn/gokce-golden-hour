document.addEventListener(
"DOMContentLoaded",
()=>{

/* =========================================================
   CREATE DYNAMIC GLOW
========================================================= */

const glow =
document.createElement("div");

glow.className =
"dynamic-dominant-glow";

document.body.appendChild(
glow
);

/* =========================================================
   IMAGE DETECTION
========================================================= */

const images =
document.querySelectorAll(
".gallery img"
);

/* =========================================================
   RGB EXTRACT
========================================================= */

function getAverageColor(img){

const canvas =
document.createElement(
"canvas"
);

const ctx =
canvas.getContext("2d");

canvas.width = 60;
canvas.height = 60;

ctx.drawImage(
img,
0,
0,
60,
60
);

const data =
ctx.getImageData(
0,
0,
60,
60
).data;

let r = 0;
let g = 0;
let b = 0;

let count = 0;

for(let i=0;i<data.length;i+=4){

r += data[i];

g += data[i+1];

b += data[i+2];

count++;

}

r =
Math.floor(r / count);

g =
Math.floor(g / count);

b =
Math.floor(b / count);

return { r,g,b };

}

/* =========================================================
   UPDATE GLOW
========================================================= */

function updateGlow(img){

const color =
getAverageColor(img);

glow.style.background =

`
radial-gradient(
circle,

rgba(
${color.r},
${color.g},
${color.b},
0.24
),

transparent 70%
)
`;

}

/* =========================================================
   INTERSECTION
========================================================= */

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

updateGlow(
entry.target
);

}

});

},

{
threshold:.55
}

);

/* =========================================================
   OBSERVE
========================================================= */

images.forEach(img=>{

if(img.complete){

observer.observe(img);

}else{

img.addEventListener(
"load",
()=>{

observer.observe(img);

}
);

}

});

/* =========================================================
   MOUSE REACTION
========================================================= */

let mouseX =
window.innerWidth / 2;

let mouseY =
window.innerHeight / 2;

document.addEventListener(
"mousemove",
(e)=>{

mouseX =
e.clientX;

mouseY =
e.clientY;

}
);

function animateGlow(){

glow.style.left =
mouseX + "px";

glow.style.top =
mouseY + "px";

requestAnimationFrame(
animateGlow
);

}

animateGlow();

});

