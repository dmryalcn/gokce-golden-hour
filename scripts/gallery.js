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
   CREATE IMAGE
========================================================= */

function createImage(src,index){

const img =
document.createElement("img");

img.src = src;

/* PERFORMANCE */

img.loading = "lazy";

img.decoding = "async";

if(index < 4){

img.fetchPriority =
"high";

}else{

img.fetchPriority =
"low";

}

/* INITIAL EFFECT */

img.style.opacity = "0";

img.style.transform =
"translateY(20px) scale(1.02)";

img.style.filter =
"blur(16px) brightness(.95)";

/* REVEAL */

function reveal(){

img.style.opacity = "1";

img.style.transform =
"translateY(0) scale(1)";

img.style.filter =
"blur(0px) brightness(1)";

}

if(img.complete){

reveal();

}else{

img.addEventListener(
"load",
reveal
);

}

/* APPEND */

gallery.appendChild(
img
);

return img;

}

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

const imageList = [];

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

if(data.hidden === true)
return;

imageList.push(data);

});

/* EMPTY */

if(!imageList.length){

gallery.innerHTML = `

<div class="gallery-loading">

Henüz fotoğraf yok 🤍

</div>

`;

return;

}

/* RENDER */

imageList.forEach((item,index)=>{

createImage(
item.imageUrl,
index
);

});

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

/* REMOVE OLD */

const old =
document.querySelector(
".lightbox"
);

if(old){

old.remove();

}

/* CREATE */

const lightbox =
document.createElement(
"div"
);

lightbox.className =
"lightbox";

lightbox.innerHTML = `

<button class="lightbox-close">

×

</button>

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

function open(index){

currentIndex = index;

lightboxImg.src =
images[index].src;

lightbox.classList.add(
"show"
);

document.body.style.overflow =
"hidden";

}

/* CLOSE */

function close(){

lightbox.classList.remove(
"show"
);

document.body.style.overflow =
"";

}

/* NEXT */

function next(){

currentIndex =
(currentIndex + 1)
% images.length;

lightboxImg.src =
images[currentIndex].src;

}

/* PREV */

function prev(){

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

open(index);

}
);

});

/* CLOSE */

closeBtn.addEventListener(
"click",
close
);

/* OVERLAY */

lightbox.addEventListener(
"click",
(e)=>{

if(e.target === lightbox){

close();

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
close();

if(e.key === "ArrowRight")
next();

if(e.key === "ArrowLeft")
prev();

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

const endX =
e.changedTouches[0].clientX;

const diff =
startX - endX;

if(Math.abs(diff) > 50){

if(diff > 0){

next();

}else{

prev();

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

