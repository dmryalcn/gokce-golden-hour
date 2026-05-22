import "./firebase.js";

/* =========================================================
   FIREBASE
========================================================= */

const {

collection,
onSnapshot,
query,
orderBy,
deleteDoc,
doc,
updateDoc

} = window.firebaseFns;

const db = window.db;

/* =========================================================
   ELEMENTS
========================================================= */

const loginScreen =
document.getElementById(
"loginScreen"
);

const adminPanel =
document.getElementById(
"adminPanel"
);

const guestTable =
document.getElementById(
"guestTable"
);

const totalCount =
document.getElementById(
"totalCount"
);

const yesCount =
document.getElementById(
"yesCount"
);

const noCount =
document.getElementById(
"noCount"
);

const maybeCount =
document.getElementById(
"maybeCount"
);

const memoryGallery =
document.getElementById(
"memoryGallery"
);

const searchInput =
document.getElementById(
"searchInput"
);

const memoryCount =
document.getElementById(
"memoryCount"
);

/* =========================================================
   LOGIN
========================================================= */

function login(){

const pass =
document.getElementById(
"password"
).value;

if(
pass === "Gokce2026"
){

localStorage.setItem(
"gy_admin",
"true"
);

showPanel();

}else{

alert(
"Şifre yanlış 😔"
);

}

}

window.login = login;

/* =========================================================
   LOGOUT
========================================================= */

function logout(){

localStorage.removeItem(
"gy_admin"
);

location.reload();

}

window.logout = logout;

/* =========================================================
   CHECK LOGIN
========================================================= */

function showPanel(){

loginScreen.style.display =
"none";

adminPanel.style.display =
"block";

loadGuests();

loadMemories();

}

if(
localStorage.getItem(
"gy_admin"
) === "true"
){

showPanel();

}

/* =========================================================
   RSVP
========================================================= */

let allGuests = [];

function loadGuests(){

const q =
query(

collection(
db,
"rsvp"
),

orderBy(
"createdAt",
"desc"
)

);

onSnapshot(q,(snapshot)=>{

allGuests = [];

snapshot.forEach((docSnap)=>{

allGuests.push({

id:docSnap.id,
...docSnap.data()

});

});

renderGuests(
allGuests
);

});

}

/* =========================================================
   RENDER GUESTS
========================================================= */

function renderGuests(dataList){

guestTable.innerHTML = "";

let total = 0;
let yes = 0;
let no = 0;
let maybe = 0;

if(!dataList.length){

guestTable.innerHTML = `

<tr>
<td colspan="7" class="empty">

Henüz veri yok

</td>
</tr>

`;

}

dataList.forEach((data)=>{

total++;

/* STATUS COUNTS */

if(data.status === "yes"){

yes++;

}

else if(
data.status === "no"
){

no++;

}

else{

maybe++;

}

/* DATE */

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

/* STATUS TEXT */

let statusText =
"Kararsız ✨";

if(data.status === "yes"){

statusText =
"Katılıyor 🤍";

}

else if(
data.status === "no"
){

statusText =
"Katılmıyor 😔";

}

/* ROW */

const row =
document.createElement("tr");

row.innerHTML = `

<td>
${data.name || "-"}
</td>

<td>
${data.guestCount || "-"}
</td>

<td>

<span class="status ${getStatusClass(data.status)}">

${statusText}

</span>

</td>

<td>
${data.transportNeed || "-"}
</td>

<td>

${

data.comingMessage ||

data.cannotJoinMessage ||

data.maybeMessage ||

"-"

}

</td>

<td>
${date}
</td>

<td>

<button
class="action-btn delete"
onclick="deleteRSVP('${data.id}')">

Sil

</button>

</td>

`;

guestTable.appendChild(
row
);

});

/* COUNTS */

totalCount.innerText =
total;

yesCount.innerText =
yes;

noCount.innerText =
no;

maybeCount.innerText =
maybe;

}

/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status){

if(status === "yes"){

return "yes";

}

if(status === "no"){

return "no";

}

return "maybe";

}

/* =========================================================
   SEARCH
========================================================= */

searchInput?.addEventListener(
"input",
(e)=>{

const val =
e.target.value
.toLowerCase();

const filtered =
allGuests.filter(item=>

(item.name || "")
.toLowerCase()
.includes(val)

);

renderGuests(filtered);

}
);

/* =========================================================
   DELETE RSVP
========================================================= */

async function deleteRSVP(id){

const confirmed =
confirm(
"Bu katılım bilgisini silmek istiyor musunuz?"
);

if(!confirmed) return;

await deleteDoc(

doc(
db,
"rsvp",
id
)

);

}

window.deleteRSVP =
deleteRSVP;

/* =========================================================
   EXPORT CSV
========================================================= */

function exportData(){

let csv =
"İsim,Kişi Sayısı,Durum,Ulaşım,Mesaj,Tarih\n";

document
.querySelectorAll(
"#guestTable tr"
)
.forEach(tr=>{

const cols =
tr.querySelectorAll("td");

if(cols.length){

let row = [];

cols.forEach((td,index)=>{

if(index < 6){

row.push(

td.innerText
.replace(/,/g," ")

);

}

});

csv +=
row.join(",") + "\n";

}

});

const blob =
new Blob([csv],{
type:"text/csv"
});

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"gokce-yalcin-rsvp.csv";

a.click();

URL.revokeObjectURL(url);

}

window.exportData =
exportData;

/* =========================================================
   MEMORIES
========================================================= */

function loadMemories(){

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

onSnapshot(q,(snapshot)=>{

memoryGallery.innerHTML = "";

let totalMemories = 0;

if(snapshot.empty){

memoryGallery.innerHTML = `

<div class="empty">

Henüz anı bırakılmadı

</div>

`;

return;

}

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

totalMemories++;

const card =
document.createElement("div");

card.className =
"memory-card";

let mediaHTML = "";

const mediaItems =
data.mediaItems || [];

/* MEDIA */

mediaItems.forEach(item=>{

if(item.type?.includes("image")){

mediaHTML += `

<img
src="${item.url}"
class="memory-media">

`;

}

else if(
item.type?.includes("video")
){

mediaHTML += `

<video
controls
class="memory-media">

<source src="${item.url}">

</video>

`;

}

else if(
item.type?.includes("audio")
){

mediaHTML += `

<audio
controls
class="memory-audio">

<source src="${item.url}">

</audio>

`;

}

});

/* DATE */

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

/* HIDDEN */

const hiddenBadge =
data.hidden === true
? `

<div class="memory-hidden">

Gizli

</div>

`
: "";

/* CARD */

card.innerHTML = `

${hiddenBadge}

${mediaHTML}

<div class="memory-name">

${data.name || "İsimsiz"}

</div>

<div class="memory-message">

${data.message || "-"}

</div>

<div class="memory-date">

${date}

</div>

<div class="memory-actions">

<button
class="action-btn hide"
onclick="toggleMemory('${docSnap.id}',${data.hidden === true})">

${data.hidden === true
? "Yayınla"
: "Gizle"}

</button>

<button
class="action-btn delete"
onclick="deleteMemory('${docSnap.id}')">

Sil

</button>

</div>

`;

memoryGallery.appendChild(
card
);

});

/* MEMORY COUNT */

if(memoryCount){

memoryCount.innerText =
totalMemories;

}

});

}

/* =========================================================
   TOGGLE MEMORY
========================================================= */

async function toggleMemory(id,isHidden){

await updateDoc(

doc(
db,
"memories",
id
),

{
hidden:!isHidden
}

);

}

window.toggleMemory =
toggleMemory;

/* =========================================================
   DELETE MEMORY
========================================================= */

async function deleteMemory(id){

const confirmed =
confirm(
"Bu anıyı tamamen silmek istiyor musunuz?"
);

if(!confirmed) return;

await deleteDoc(

doc(
db,
"memories",
id
)

);

}

window.deleteMemory =
deleteMemory;
