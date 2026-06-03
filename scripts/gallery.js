import "../firebase.js";

/* =========================================================
   FIREBASE
========================================================= */

const {

collection,
query,
orderBy,
onSnapshot

} = window.firebaseFns;

const db = window.db;

/* =========================================================
   ELEMENTS
========================================================= */

const gallery =
document.getElementById(
"gallery"
);

/* =========================================================
   LOAD GALLERY
========================================================= */

function loadGallery(){

const q =
query(

collection(
db,
"galleryImages"
),

orderBy(
"createdAt",
"desc"
)

);

onSnapshot(q,(snapshot)=>{

gallery.innerHTML = "";

const visibleImages = [];

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

if(data.hidden === true)
return;

visibleImages.push(data);

});

if(!visibleImages.length){

gallery.innerHTML = `

<div class="gallery-loading">

Henüz fotoğraf yok 🤍

</div>

`;

return;

}

visibleImages.forEach((data,index)=>{

const img =
document.createElement("img");

img.src =
data.imageUrl;

img.loading =
"lazy";

img.decoding =
"async";

if(index < 4){

img.fetchPriority =
"high";

}else{

img.fetchPriority =
"low";

}

/* INITIAL */

img.style.opacity =
"0";

img.style.filter =
"blur(18px) brightness(.92)";

img.style.transform =
"scale(1.03)";

img.style.transition = `
opacity 1s ease,
filter 1.2s ease,
transform 1.2s ease
`;

/* REVEAL */

function revealImage(){

img.style.opacity =
"1";

img.style.filter =
"blur(0px) brightness(1)";

img.style.transform =
"scale(1)";

}

if(img.complete){

revealImage();

}else{

img.addEventListener(
"load",
revealImage
);

}

/* MEMORY FIX */

img.style.willChange =
"transform, opacity, filter";

img.style.backfaceVisibility =
"hidden";

img.style.webkitBackfaceVisibility =
"hidden";

/* =========================================================
   SMART LAYOUT
========================================================= */

img.addEventListener(
"load",
()=>{

const width =
img.naturalWidth;

const height =
img.naturalHeight;

const ratio =
width / height;

/* LANDSCAPE */

if(ratio > 1.25){

img.classList.add(
"wide"
);

}

/* PORTRAIT */

else if(ratio < 0.8){

img.classList.add(
"tall"
);

}

}
);



/* LIGHTBOX */

initializeLightbox();

});

}

/* =========================================================
   LIGHTBOX
========================================================= */

function initializeLightbox(){

const images =
document.querySelectorAll(
".gallery img"
);

const oldLightbox =
document.querySelector(
".lightbox"
);

if(oldLightbox){

oldLightbox.remove();

}

const lightbox =
document.createElement(
"div"
);

lightbox.className =
"lightbox";

lightbox.innerHTML = `

<span class="lightbox-close">

&times;

</span>

<img
class="lightbox-image"
src="">

`;

document.body.appendChild(
lightbox
);

const lightboxImg =
lightbox.querySelector(
".lightbox-image"
);

const closeBtn =
lightbox.querySelector(
".lightbox-close"
);

let currentIndex = 0;

/* OPEN */

function openLightbox(index){

currentIndex = index;

const preloadImage =
new Image();

preloadImage.src =
images[index].src;

lightboxImg.src =
images[index].src;

lightbox.classList.add(
"show"
);

document.body.style.overflow =
"hidden";

}

/* CLOSE */

function closeLightbox(){

lightbox.classList.remove(
"show"
);

document.body.style.overflow =
"";

}

/* NEXT */

function showNext(){

currentIndex =
(currentIndex + 1)
% images.length;

lightboxImg.src =
images[currentIndex].src;

}

/* PREV */

function showPrev(){

currentIndex =
(
currentIndex - 1
+ images.length
)
% images.length;

lightboxImg.src =
images[currentIndex].src;

}

/* CLICK */

images.forEach((img,index)=>{

img.addEventListener(
"click",
()=>{

openLightbox(index);

}
);

});

/* CLOSE BTN */

closeBtn.addEventListener(
"click",
closeLightbox
);

/* OVERLAY */

lightbox.addEventListener(
"click",
(e)=>{

if(e.target === lightbox){

closeLightbox();

}

}
);

/* KEYBOARD */

document.addEventListener(
"keydown",
(e)=>{

if(
!lightbox.classList.contains(
"show"
)
) return;

if(e.key === "Escape")
closeLightbox();

if(e.key === "ArrowRight")
showNext();

if(e.key === "ArrowLeft")
showPrev();

}
);

/* SWIPE */

let startX = 0;

lightbox.addEventListener(
"touchstart",
(e)=>{

startX =
e.touches[0].clientX;

}
);

lightbox.addEventListener(
"touchend",
(e)=>{

let endX =
e.changedTouches[0].clientX;

let diff =
startX - endX;

if(Math.abs(diff) > 50){

if(diff > 0){

showNext();

}else{

showPrev();

}

}

}
);

}

/* =========================================================
   START
========================================================= */

document.addEventListener(
"DOMContentLoaded",
()=>{

loadGallery();

}
);

