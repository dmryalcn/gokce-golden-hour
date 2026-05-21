/* =========================================================
   GÖKÇE & YALÇIN — MEMORY EXPERIENCE 2.0
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
   AUDIO RECORDING
========================= */

let mediaRecorder;

let audioChunks = [];

let recordedAudioBlob = null;

let recordingTimer;

let recordingSeconds = 15;



const recordBtn =
document.getElementById(
"recordBtn"
);

const stopRecordBtn =
document.getElementById(
"stopRecordBtn"
);

const audioPreview =
document.getElementById(
"audioPreview"
);

const recordingStatus =
document.getElementById(
"recordingStatus"
);

if(recordBtn){

recordBtn.addEventListener(
"click",
async()=>{

try{

const stream =
await navigator.mediaDevices.getUserMedia({
audio:true
});

mediaRecorder =
new MediaRecorder(stream);

audioChunks = [];

recordingSeconds = 15;

mediaRecorder.ondataavailable =
(e)=>{

audioChunks.push(
e.data
);

};

mediaRecorder.onstop = ()=>{

recordedAudioBlob =
new Blob(
audioChunks,
{
type:"audio/webm"
}
);

const audioUrl =
URL.createObjectURL(
recordedAudioBlob
);

audioPreview.src =
audioUrl;

audioPreview.style.display =
"block";

if(recordingStatus){

recordingStatus.innerHTML =
"Sesli mesaj hazır ✨";

}

clearInterval(
recordingTimer
);

};

mediaRecorder.start();

recordBtn.disabled = true;

stopRecordBtn.disabled = true;

recordBtn.innerHTML =
"Kaydediliyor...";

if(recordingStatus){

recordingStatus.innerHTML =
`15 saniye kaldı`;

}

/* TIMER */

recordingTimer =
setInterval(()=>{

recordingSeconds--;

if(recordingStatus){

recordingStatus.innerHTML =
`${recordingSeconds} saniye kaldı`;

}

if(recordingSeconds <= 0){

mediaRecorder.stop();

recordBtn.disabled = false;

recordBtn.innerHTML =
"🎙️ Sesli Mesaj Gönder";

clearInterval(
recordingTimer
);

}

},1000);

}catch(err){

console.error(err);

alert(
"Mikrofon erişimi sağlanamadı 😔"
);

}

}
);
}


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

memoryModal.classList.add("active");

document.body.style.overflow = "hidden";

}
);

});

/* =========================
   CLOSE MODALS
========================= */

document
.querySelectorAll(
".modal-close,.memory-overlay"
)
.forEach(el=>{

el.addEventListener(
"click",
()=>{

memoryModal.classList.remove(
"active"
);

rsvpModal.classList.remove(
"active"
);

document.body.style.overflow = "auto";

});

});

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

if(rsvpStatus.value ===
"geliyor"){

guestArea.style.display =
"block";

}

if(rsvpStatus.value ===
"gelmiyor"){

cannotArea.style.display =
"block";

}

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

/* MESSAGE LIMIT */

if(message.length > 400){

throw new Error(
"Mesaj en fazla 400 karakter olabilir 🤍"
);

}

/* EMPTY */

if(

!message.trim() &&
files.length === 0 &&
!recordedAudioBlob

){

throw new Error(
"Lütfen bir anı bırakın 🤍"
);

}


   
const files =
document.getElementById(
"memoryFile"
)?.files || [];

let mediaItems = [];

/* =========================
   FILE VALIDATION
========================= */

let imageCount = 0;

let videoCount = 0;

for(const file of files){

/* IMAGE */

if(file.type.startsWith("image")){

imageCount++;

if(imageCount > 5){

throw new Error(
"En fazla 5 fotoğraf yükleyebilirsiniz 🤍"
);

}

if(file.size > 8 * 1024 * 1024){

throw new Error(
"Fotoğraflar maksimum 8MB olabilir 🤍"
);

}

}

/* VIDEO DURATION */

if(file.type.startsWith("video")){

const video =
document.createElement(
"video"
);

video.preload = "metadata";

const objectUrl =
URL.createObjectURL(file);

video.src = objectUrl;

await new Promise((resolve,reject)=>{

video.onloadedmetadata = ()=>{

URL.revokeObjectURL(
objectUrl
);

if(video.duration > 15){

reject(
new Error(
"Video en fazla 15 saniye olabilir 🤍"
)
);

}else{

resolve();

}

};

});

}


   
/* VIDEO */

if(file.type.startsWith("video")){

videoCount++;

if(videoCount > 1){

throw new Error(
"Sadece 1 video yükleyebilirsiniz 🤍"
);

}

if(file.size > 40 * 1024 * 1024){

throw new Error(
"Video maksimum 40MB olabilir 🤍"
);

}

}

/* UNSUPPORTED */

if(

!file.type.startsWith("image") &&
!file.type.startsWith("video")

){

throw new Error(
"Desteklenmeyen dosya formatı 😔"
);

}

}


   
/* =========================
   MULTI FILE UPLOAD
========================= */

for(const file of files){

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

if(response.ok){

mediaItems.push({

url:data.secure_url,

type:file.type

});

}

}

/* =========================
   AUDIO RECORD UPLOAD
========================= */

if(recordedAudioBlob){

const audioFile =
new File(
[recordedAudioBlob],
"voice-message.webm",
{
type:"audio/webm"
}
);

const formData =
new FormData();

formData.append(
"file",
audioFile
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

if(response.ok){

mediaItems.push({

url:data.secure_url,

type:"audio/webm"

});

}

}

/* =========================
   FIRESTORE
========================= */

await addDoc(
collection(db,"memories"),
{

name,
message,
mediaItems,

createdAt:
serverTimestamp()

}
);

/* =========================
   RESET
========================= */

memoryForm.reset();

recordedAudioBlob = null;

audioChunks = [];

if(audioPreview){

audioPreview.style.display =
"none";

audioPreview.src = "";

}

if(recordingStatus){

recordingStatus.innerHTML =
"Hazır";

}

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

const transportNeed =
document.getElementById(
"transportNeed"
)?.value || "";

const comingMessage =
document.getElementById(
"comingMessage"
)?.value || "";

if(!name.trim()){

throw new Error(
"Lütfen adınızı girin 🤍"
);

}

if(!status){

throw new Error(
"Katılım durumunuzu seçin 🤍"
);

}

if(

comingMessage.length > 250 ||
maybeMessage.length > 250 ||
cannotJoinMessage.length > 250

){

throw new Error(
"Mesajlar maksimum 250 karakter olabilir 🤍"
);

}



await addDoc(
collection(db,"rsvp"),
{

name,
status,
guestCount,

transportNeed,
comingMessage,

cannotJoinMessage,
maybeMessage,

createdAt:
serverTimestamp()

}
);


rsvpForm.reset();

closeAllModals();

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

