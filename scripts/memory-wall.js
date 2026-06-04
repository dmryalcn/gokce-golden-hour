import "../firebase.js";

const {

collection,
query,
orderBy,
getDocs

} = window.firebaseFns;

const db = window.db;

const memoryWall =
document.getElementById(
"memoryWall"
);

/* =========================================================
SECURITY HELPERS
========================================================= */

function escapeHTML(value){

return String(value || "")
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">")
.replace(/"/g,""")
.replace(/'/g,"'");

}

function isSafeCloudinaryUrl(url){

if(!url) return false;

try{

const parsed =
new URL(url);

return (
parsed.protocol === "https:" &&
parsed.hostname.includes("cloudinary.com")
);

}catch{

return false;

}

}

/* =========================================================
LOAD MEMORIES
========================================================= */

async function loadMemories(){

if(!memoryWall) return;

try{

const q =
query(

collection(
db,
"memories"
),

orderBy(
"createdAt",
"desc"
)

);

const snapshot =
await getDocs(q);

/* EMPTY */

if(snapshot.empty){

memoryWall.innerHTML = `

<div class="memory-empty">

Henüz anı bırakılmadı 🤍

</div>

`;

return;

}

memoryWall.innerHTML = "";

/* LOOP */

snapshot.forEach(docSnap=>{

const memory =
docSnap.data() || {};

/* HIDDEN */

if(memory.hidden === true){
return;
}

/* CARD */

const card =
document.createElement("div");

card.className =
"memory-card";

/* MEDIA */

const mediaItems =
Array.isArray(memory.mediaItems)
? memory.mediaItems
: [];

let mediaHTML = "";

/* IMAGE + VIDEO */

mediaItems.forEach(item=>{

if(
!item ||
!item.url ||
!isSafeCloudinaryUrl(item.url)
){
return;
}

if(
item.type?.includes("image")
){

mediaHTML += `

<div class="memory-media-item">

<img
src="${item.url}"
loading="lazy"
decoding="async"
alt="Wedding Memory">

</div>

`;

}

else if(
item.type?.includes("video")
){

mediaHTML += `

<div class="memory-media-item">

<video
controls
preload="metadata">

<source
src="${item.url}">

</video>

</div>

`;

}

});

/* AUDIO */

let audioHTML = "";

const audioItem =
mediaItems.find(item=>

item?.type?.includes("audio") &&
isSafeCloudinaryUrl(item.url)

);

if(audioItem){

audioHTML = `

<div class="memory-audio">

<audio controls>

<source
src="${audioItem.url}">

</audio>

</div>

`;

}

/* DATE */

const createdAt =
memory.createdAt?.toDate
? memory.createdAt.toDate()
: null;

const formattedDate =
createdAt
? createdAt.toLocaleDateString(
"tr-TR"
)
: "";

/* SAFE TEXT */

const safeName =
escapeHTML(
memory.name || "Misafir"
);

const safeMessage =
escapeHTML(
memory.message || ""
);

/* CONTENT */

card.innerHTML = `

<div class="memory-header">

<h3 class="memory-name">

${safeName}

</h3>

<p class="memory-message">

${safeMessage}

</p>

</div>

${mediaHTML
? `

<div class="memory-media">

${mediaHTML}

</div>

`
: ""}

${audioHTML}

<div class="memory-date">

${formattedDate}

</div>

`;

memoryWall.appendChild(
card
);

});

}catch(err){

console.error(
"Memory Wall Error:",
err
);

memoryWall.innerHTML = `

<div class="memory-empty">

Anılar yüklenemedi 😔

</div>

`;

}

}

/* =========================================================
INIT
========================================================= */

loadMemories();
