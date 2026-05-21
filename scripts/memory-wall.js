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

/* =========================================================
   EMPTY
========================================================= */

if(snapshot.empty){

memoryWall.innerHTML = `

<div class="memory-empty">

Henüz anı bırakılmadı 🤍

</div>

`;

return;

}

memoryWall.innerHTML = "";

/* =========================================================
   LOOP
========================================================= */

snapshot.forEach(doc=>{

const memory =
doc.data();

/* =========================================================
   HIDDEN MEMORY
========================================================= */

if(memory.hidden === true){
return;
}

/* =========================================================
   CARD
========================================================= */

const card =
document.createElement(
"div"
);

card.className =
"memory-card";

/* =========================================================
   MEDIA
========================================================= */

const mediaItems =
memory.mediaItems || [];

let mediaHTML = "";

/* =========================================================
   RENDER MEDIA
========================================================= */

mediaItems.forEach(item=>{

if(!item?.url) return;

/* IMAGE */

if(
item.type?.includes("image")
){

mediaHTML += `

<div class="memory-media-item">

<img
src="${item.url}"
loading="lazy"
alt="Wedding Memory">

</div>

`;

}

/* VIDEO */

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

/* =========================================================
   AUDIO
========================================================= */

let audioHTML = "";

const audioItem =
mediaItems.find(item=>

item.type?.includes("audio")

);

if(audioItem?.url){

audioHTML = `

<div class="memory-audio">

<audio controls>

<source
src="${audioItem.url}"
type="audio/webm">

</audio>

</div>

`;

}

/* =========================================================
   DATE
========================================================= */

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

/* =========================================================
   CONTENT
========================================================= */

card.innerHTML = `

<div class="memory-header">

<h3 class="memory-name">

${memory.name || "Misafir"}

</h3>

<p class="memory-message">

${memory.message || ""}

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

console.error(err);

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

