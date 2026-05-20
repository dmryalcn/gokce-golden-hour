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
"dgtscqpnv";

const UPLOAD_PRESET =
"weddingUploads";

/* =========================
   DOM LOADED
========================= */

document.addEventListener("DOMContentLoaded",()=>{

/* =========================
   RSVP MODAL
========================= */

const rsvpModal =
document.getElementById("rsvpModal");

const openRsvpBtns =
document.querySelectorAll("[data-open-rsvp]");

const closeRsvp =
document.getElementById("closeRsvp");

openRsvpBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

rsvpModal.classList.add("active");

document.body.style.overflow =
"hidden";

});

});

if(closeRsvp){

closeRsvp.addEventListener("click",()=>{

rsvpModal.classList.remove("active");

document.body.style.overflow =
"auto";

});

}

/* =========================
   MEMORY MODAL
========================= */

const memoryModal =
document.getElementById("memoryModal");

const openMemoryBtns =
document.querySelectorAll("[data-open-memory]");

const closeMemory =
document.getElementById("closeMemory");

openMemoryBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

memoryModal.classList.add("active");

document.body.style.overflow =
"hidden";

});

});

if(closeMemory){

closeMemory.addEventListener("click",()=>{

memoryModal.classList.remove("active");

document.body.style.overflow =
"auto";

});

}

/* =========================
   OVERLAY CLOSE
========================= */

document
.querySelectorAll(".memory-overlay")
.forEach(overlay=>{

overlay.addEventListener("click",()=>{

document
.querySelectorAll(".memory-modal")
.forEach(modal=>{

modal.classList.remove("active");

});

document.body.style.overflow =
"auto";

});

});

/* =========================
   RSVP CONDITIONAL
========================= */

const rsvpStatus =
document.getElementById("rsvpStatus");

const guestCountArea =
document.getElementById("guestCountArea");

const cannotJoinArea =
document.getElementById("cannotJoinArea");

const maybeArea =
document.getElementById("maybeArea");

if(rsvpStatus){

rsvpStatus.addEventListener("change",()=>{

guestCountArea.style.display =
"none";

cannotJoinArea.style.display =
"none";

maybeArea.style.display =
"none";

if(rsvpStatus.value === "geliyor"){

guestCountArea.style.display =
"block";

}

if(rsvpStatus.value === "gelmiyor"){

cannotJoinArea.style.display =
"block";

}

if(rsvpStatus.value === "kararsiz"){

maybeArea.style.display =
"block";

}

});

}

/* =========================
   RSVP SUBMIT
========================= */

const rsvpForm =
document.getElementById("rsvpForm");

if(rsvpForm){

rsvpForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const status =
document.getElementById(
"rsvpStatus"
).value;

await addDoc(
collection(db,"rsvp"),
{
name:
document.getElementById("rsvpName").value,

status,

guestCount:
document.getElementById("guestCount").value || "",

cannotJoinMessage:
document.getElementById("cannotJoinMessage").value || "",

maybeMessage:
document.getElementById("maybeMessage").value || "",

createdAt:
serverTimestamp()
}
);

let message = "";

if(status === "geliyor"){

message =
"Sizi yanımızda görecek olmak bizi çok mutlu etti 🤍";

}

if(status === "gelmiyor"){

message =
"Mesajınız bizim için çok kıymetli 🤍";

}

if(status === "kararsiz"){

message =
"Umarız o gün birlikte oluruz 🤍";

}

showSuccessPopup(message);

rsvpForm.reset();

guestCountArea.style.display =
"none";

cannotJoinArea.style.display =
"none";

maybeArea.style.display =
"none";

rsvpModal.classList.remove(
"active"
);

document.body.style.overflow =
"auto";

}catch(err){

console.error(err);

showSuccessPopup(
"Bir hata oluştu 😔"
);

}

});

}

/* =========================
   MEMORY SUBMIT
========================= */

const memoryForm =
document.getElementById("memoryForm");

if(memoryForm){

memoryForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const file =
document.getElementById(
"memoryFile"
).files[0];

let fileUrl = "";
let fileType = "";

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

throw new Error(
data.error?.message || "Upload failed"
);

}

fileUrl =
data.secure_url;

fileType =
file.type;

}

await addDoc(
collection(db,"memories"),
{
name:
document.getElementById("memoryName").value,

message:
document.getElementById("memoryMessage").value,

fileUrl,
fileType,

createdAt:
serverTimestamp()
}
);

showSuccessPopup(
"Bu güzel anıyı bizimle paylaştığınız için teşekkür ederiz 🤍"
);

memoryForm.reset();

memoryModal.classList.remove(
"active"
);

document.body.style.overflow =
"auto";

}catch(err){

console.error(err);

showSuccessPopup(
"Bir hata oluştu 😔"
);

}

});

}

/* =========================
   SUCCESS POPUP
========================= */

function showSuccessPopup(message){

const popup =
document.createElement("div");

popup.className =
"success-popup";

popup.innerHTML = `

<div class="success-popup-box">

<div class="success-heart">
🤍
</div>

<p>${message}</p>

</div>

`;

document.body.appendChild(
popup
);

setTimeout(()=>{

popup.classList.add("show");

},50);

setTimeout(()=>{

popup.classList.remove("show");

setTimeout(()=>{

popup.remove();

},500);

},3500);

}

});
