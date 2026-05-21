/* =========================================================
   GÖKÇE & YALÇIN — FINAL UPLOAD.JS
========================================================= */

import "./firebase.js";

const {
collection,
addDoc,
serverTimestamp
} = window.firebaseFns;

const db = window.db;

/* =========================
   CLOUDINARY
========================= */

const CLOUD_NAME =
"dgtscqpny";

const UPLOAD_PRESET =
"weddingUploads";

/* =========================
   MODALS
========================= */

const rsvpModal =
document.getElementById(
"rsvpModal"
);

const memoryModal =
document.getElementById(
"memoryModal"
);

/* =========================
   OPEN MODALS
========================= */

document
.querySelectorAll('[data-open="rsvp"]')
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(rsvpModal){

rsvpModal.classList.add(
"active"
);

document.body.style.overflow =
"hidden";

}

}
);

});

document
.querySelectorAll('[data-open="memory"]')
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(memoryModal){

memoryModal.classList.add(
"active"
);

document.body.style.overflow =
"hidden";

}

}
);

});

/* =========================
   CLOSE MODALS
========================= */

document
.querySelectorAll(".modal-close")
.forEach(btn=>{

btn.addEventListener(
"click",
closeAllModals
);

});

document
.querySelectorAll(".memory-modal")
.forEach(modal=>{

modal.addEventListener(
"click",
(e)=>{

if(e.target === modal){

closeAllModals();

}

}
);

});

function closeAllModals(){

document
.querySelectorAll(".memory-modal")
.forEach(modal=>{

modal.classList.remove(
"active"
);

});

document.body.style.overflow =
"auto";

}

/* =========================
   RSVP DYNAMIC AREAS
========================= */

const rsvpStatus =
document.getElementById(
"rsvpStatus"
);

if(rsvpStatus){

rsvpStatus.addEventListener(
"change",
()=>{

const guestArea =
document.getElementById(
"guestCountArea"
);

const cannotArea =
document.getElementById(
"cannotJoinArea"
);

const maybeArea =
document.getElementById(
"maybeArea"
);

guestArea.style.display =
"none";

cannotArea.style.display =
"none";

maybeArea.style.display =
"none";

/* GELIYOR */

if(rsvpStatus.value ===
"geliyor"){

guestArea.style.display =
"block";

}

/* GELMIYOR */

if(rsvpStatus.value ===
"gelmiyor"){

cannotArea.style.display =
"block";

}

/* KARARSIZ */

if(rsvpStatus.value ===
"kararsiz"){

maybeArea.style.display =
"block";

}

}
);

}

/* =========================
   MEMORY FORM
========================= */

const memoryForm =
document.getElementById(
"memoryForm"
);

if(memoryForm){

memoryForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const submitBtn =
memoryForm.querySelector(
".send-btn"
);

const originalText =
submitBtn.innerHTML;

submitBtn.disabled = true;

submitBtn.innerHTML =
"Yükleniyor...";

try{

const name =
document.getElementById(
"memoryName"
)?.value || "";

const message =
document.getElementById(
"memoryMessage"
)?.value || "";

const file =
document.getElementById(
"memoryFile"
)?.files[0];

let fileUrl = "";

let fileType = "";

/* =========================
   CLOUDINARY
========================= */

if(file){

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
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
{
method:"POST",
body:formData
}
);

const data =
await response.json();

if(!response.ok){

console.error(data);

throw new Error(
"Upload failed"
);

}

fileUrl =
data.secure_url || "";

fileType =
file.type || "";

}

/* =========================
   FIRESTORE
========================= */

await addDoc(
collection(db,"memories"),
{

name,
message,
fileUrl,
fileType,

createdAt:
serverTimestamp()

}
);

/* =========================
   RESET
========================= */

memoryForm.reset();

closeAllModals();

/* =========================
   SUCCESS
========================= */

showSuccessPopup({

title:
"Anınız Kaydedildi",

message:
"Bu güzel mesajınız artık hikayemizin bir parçası oldu ✨"

});

}catch(err){

console.error(err);

showErrorPopup(
"Bir hata oluştu 😔"
);

}

submitBtn.disabled = false;

submitBtn.innerHTML =
originalText;

}
);

}

/* =========================
   RSVP FORM
========================= */

const rsvpForm =
document.getElementById(
"rsvpForm"
);

if(rsvpForm){

rsvpForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const submitBtn =
rsvpForm.querySelector(
".send-btn"
);

const originalText =
submitBtn.innerHTML;

submitBtn.disabled = true;

submitBtn.innerHTML =
"Gönderiliyor...";

try{

const name =
document.getElementById(
"rsvpName"
)?.value || "";

const status =
document.getElementById(
"rsvpStatus"
)?.value || "";

const guestCount =
document.getElementById(
"guestCount"
)?.value || "";

const cannotJoinMessage =
document.getElementById(
"cannotJoinMessage"
)?.value || "";

const maybeMessage =
document.getElementById(
"maybeMessage"
)?.value || "";

/* =========================
   FIRESTORE
========================= */

await addDoc(
collection(db,"rsvp"),
{

name,
status,
guestCount,
cannotJoinMessage,
maybeMessage,

createdAt:
serverTimestamp()

}
);

/* =========================
   RESET
========================= */

rsvpForm.reset();

closeAllModals();

/* =========================
   SUCCESS
========================= */

showSuccessPopup({

title:
"Katılım Bilginiz Ulaştı",

message:
"Bu özel günümüzde yanımızda olmanız bizi çok mutlu etti 🤍"

});

}catch(err){

console.error(err);

showErrorPopup(
"Bir hata oluştu 😔"
);

}

submitBtn.disabled = false;

submitBtn.innerHTML =
originalText;

}
);

}

/* =========================
   SUCCESS POPUP
========================= */

function showSuccessPopup({

title,
message

}){

const popup =
document.createElement(
"div"
);

popup.className =
"success-popup";

popup.innerHTML = `

<div class="success-box">

<div class="success-heart">
🤍
</div>

<h2>
${title}
</h2>

<p>
${message}
</p>

<button class="success-btn">

Kapat

</button>

</div>

`;

document.body.appendChild(
popup
);

setTimeout(()=>{

popup.classList.add(
"show"
);

},50);

/* CLOSE */

popup
.querySelector(".success-btn")
.addEventListener(
"click",
()=>{

closePopup(
popup
);

}
);

/* AUTO CLOSE */

setTimeout(()=>{

closePopup(
popup
);

},5000);

}

/* =========================
   ERROR POPUP
========================= */

function showErrorPopup(text){

const popup =
document.createElement(
"div"
);

popup.className =
"success-popup";

popup.innerHTML = `

<div class="success-box">

<div class="success-heart">
😔
</div>

<h2>
Bir Sorun Oluştu
</h2>

<p>
${text}
</p>

<button class="success-btn">

Kapat

</button>

</div>

`;

document.body.appendChild(
popup
);

setTimeout(()=>{

popup.classList.add(
"show"
);

},50);

/* CLOSE */

popup
.querySelector(".success-btn")
.addEventListener(
"click",
()=>{

closePopup(
popup
);

}
);

}

/* =========================
   CLOSE POPUP
========================= */

function closePopup(popup){

if(!popup) return;

popup.classList.remove(
"show"
);

setTimeout(()=>{

popup.remove();

},400);

}
