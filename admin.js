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
updateDoc,
addDoc,
serverTimestamp

} = window.firebaseFns;

const db = window.db;
const auth = window.auth;

const {

signInWithEmailAndPassword,
signOut,
onAuthStateChanged

} = window.firebaseFns;

/* =========================================================
   CLOUDINARY
========================================================= */

const CLOUD_NAME = "dgtscqpny";
const UPLOAD_PRESET = "weddingUploads";

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
   GALLERY ELEMENTS
========================================================= */

const galleryUploadInput =
document.getElementById(
"galleryUploadInput"
);

const uploadGalleryBtn =
document.getElementById(
"uploadGalleryBtn"
);

const adminGalleryGrid =
document.getElementById(
"adminGalleryGrid"
);
/* =========================================================
FIREBASE AUTH LOGIN
========================================================= */

async function login(){

const email =
document.getElementById(
"email"
)?.value?.trim();

const password =
document.getElementById(
"password"
)?.value;

if(!email || !password){

alert(
"E-posta ve şifre giriniz 🤍"
);

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

showPanel();

}catch(error){

console.error(error);

alert(
"Giriş başarısız 😔"
);

}

}

window.login = login;

/* =========================================================
LOGOUT
========================================================= */

async function logout(){

await signOut(auth);

location.reload();

}

window.logout = logout;

/* =========================================================
SHOW PANEL
========================================================= */

function showPanel(){

loginScreen.style.display =
"none";

adminPanel.style.display =
"block";

loadGuests();

loadMemories();

loadGalleryImages();

}

/* =========================================================
AUTH CHECK
========================================================= */

onAuthStateChanged(

auth,

(user)=>{

if(user){

showPanel();

}

}

);

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

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

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

const date =
data.createdAt?.toDate
? new Date(
data.createdAt.toDate()
).toLocaleString("tr-TR")
: "-";

const hiddenBadge =
data.hidden === true
? `

<div class="gallery-hidden">

Gizli

</div>

`
: "";

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

<div class="gallery-card-actions">

<button
class="action-btn"
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

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

async function uploadToCloudinary(file){

const formData =
new FormData();

formData.append(
"file",
file
);

formData.append(
"upload_preset",
UPLOAD_PRESET
);

const response =
await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
{
method:"POST",
body:formData
}
);

const data =
await response.json();

if(!response.ok){

throw new Error(
"Fotoğraf yüklenemedi 😔"
);

}

return data.secure_url;

}

/* =========================================================
   GALLERY UPLOAD
========================================================= */

uploadGalleryBtn?.addEventListener(
"click",
async()=>{

const files =
galleryUploadInput.files;

if(!files.length){

alert(
"Lütfen fotoğraf seçin 🤍"
);

return;

}

uploadGalleryBtn.disabled = true;

uploadGalleryBtn.innerText =
"Yükleniyor...";

try{

for(const file of files){

const imageUrl =
await uploadToCloudinary(
file
);

await addDoc(
collection(
db,
"galleryImages"
),
{

imageUrl,

hidden:false,

createdAt:
serverTimestamp()

}
);

}

galleryUploadInput.value = "";

alert(
"Fotoğraflar yüklendi ✨"
);

}catch(error){

console.error(error);

alert(
"Yükleme başarısız 😔"
);

}

uploadGalleryBtn.disabled = false;

uploadGalleryBtn.innerText =
"Fotoğraf Yükle";

}
);

/* =========================================================
   LOAD GALLERY
========================================================= */

function loadGalleryImages(){

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

adminGalleryGrid.innerHTML = "";

if(snapshot.empty){

adminGalleryGrid.innerHTML = `

<div class="empty">

Henüz galeri fotoğrafı yok

</div>

`;

return;

}

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

const hiddenBadge =
data.hidden === true
? `

<div class="gallery-hidden">

Gizli

</div>

`
: "";

const card =
document.createElement("div");

card.className =
"admin-gallery-card";

card.innerHTML = `

${hiddenBadge}

<img src="${data.imageUrl}">

<div class="gallery-card-actions">

<button
class="action-btn"
onclick="toggleGalleryImage('${docSnap.id}',${data.hidden === true})">

${data.hidden === true
? "Yayınla"
: "Gizle"}

</button>

<button
class="action-btn delete"
onclick="deleteGalleryImage('${docSnap.id}')">

Sil

</button>

</div>

`;

adminGalleryGrid.appendChild(
card
);

});

});

}

/* =========================================================
   TOGGLE GALLERY
========================================================= */

async function toggleGalleryImage(id,isHidden){

await updateDoc(

doc(
db,
"galleryImages",
id
),

{
hidden:!isHidden
}

);

}

window.toggleGalleryImage =
toggleGalleryImage;

/* =========================================================
   DELETE GALLERY
========================================================= */

async function deleteGalleryImage(id){

const confirmed =
confirm(
"Bu fotoğrafı silmek istiyor musunuz?"
);

if(!confirmed) return;

await deleteDoc(

doc(
db,
"galleryImages",
id
)

);

}

window.deleteGalleryImage =
deleteGalleryImage;

