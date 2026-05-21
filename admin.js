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
"Şifre yanlış"
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

if(data.status === "geliyor"){
yes++;
}

else if(
data.status === "gelmiyor"
){
no++;
}

else{
maybe++;
}

const row =
document.createElement("tr");

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

row.innerHTML = `

<td>
${data.name || "-"}
</td>

<td>
${data.guestCount || "-"}
</td>

<td>

<span class="status ${getStatusClass(data.status)}">

${

data.status === "geliyor"
? "Katılıyor"

:

data.status === "gelmiyor"
? "Katılmıyor"

:

"Kararsız"

}

</span>

</td>

<td>
${data.transportNeed || "-"}
</td>

<td>
${data.comingMessage || data.cannotJoinMessage || data.maybeMessage || "-"}
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

if(status === "geliyor"){
return "yes";
}

if(status === "gelmiyor"){
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

if(data.hidden === true)
return;

const card =
document.createElement("div");

card.className =
"memory-card";

let mediaHTML = "";

const mediaItems =
data.mediaItems || [];

/* =========================================================
   MEDIA
========================================================= */

mediaItems.forEach(item=>{

if(item.type?.includes("image")){

mediaHTML += `

<img
src="${item.url}">

`;

}

else if(
item.type?.includes("video")
){

mediaHTML += `

<video controls>

<source src="${item.url}">

</video>

`;

}

else if(
item.type?.includes("audio")
){

mediaHTML += `

<audio controls>

<source src="${item.url}">

</audio>

`;

}

});

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

/* =========================================================
   CARD
========================================================= */

card.innerHTML = `

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

<button
class="action-btn delete"
onclick="hideMemory('${docSnap.id}')">

Anıyı Gizle

</button>

`;

memoryGallery.appendChild(
card
);

});

});

}

/* =========================================================
   HIDE MEMORY
========================================================= */

async function hideMemory(id){

const confirmed =
confirm(
"Bu anıyı gizlemek istiyor musunuz?"
);

if(!confirmed) return;

await updateDoc(

doc(
db,
"memories",
id
),

{
hidden:true
}

);

}

window.hideMemory =
hideMemory;
