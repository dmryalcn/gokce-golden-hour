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

async function loadMemories(){

if(!memoryWall) return;

try{

const q =
query(
collection(db,"memories"),
orderBy("createdAt","desc")
);

const snapshot =
await getDocs(q);

if(snapshot.empty){

memoryWall.innerHTML = `

<div class="memory-empty">

Henüz anı bırakılmadı 🤍

</div>

`;

return;

}

memoryWall.innerHTML = "";

snapshot.forEach(doc=>{

const memory =
doc.data();

const card =
document.createElement(
"div"
);

card.className =
"memory-card";

const mediaItems =
memory.mediaItems || [];

let mediaHTML = "";

mediaItems.forEach(item=>{

if(item.type.includes("image")){

mediaHTML += `

<img
src="${item.url}"
loading="lazy">

`;

}

else if(item.type.includes("video")){

mediaHTML += `

<video
src="${item.url}"
controls>
</video>

`;

}

});

let audioHTML = "";

const audioItem =
mediaItems.find(item=>
item.type.includes("audio")
);

if(audioItem){

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
? `<div class="memory-media">${mediaHTML}</div>`
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

loadMemories();


