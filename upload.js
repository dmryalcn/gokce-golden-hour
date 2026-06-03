```js
/* =========================================================
   GÖKÇE & YALÇIN — UPLOAD SYSTEM FINAL
========================================================= */

import "./firebase.js";

const {
collection,
addDoc,
serverTimestamp
} = window.firebaseFns;

const db = window.db;

/* =========================================================
   CLOUDINARY
========================================================= */

const CLOUD_NAME = "dgtscqpny";
const UPLOAD_PRESET = "weddingUploads";

/* =========================================================
   ELEMENTS
========================================================= */

const memoryModal =
document.getElementById("memoryModal");

const rsvpModal =
document.getElementById("rsvpModal");

const memoryForm =
document.getElementById("memoryForm");

const rsvpForm =
document.getElementById("rsvpForm");

const recordBtn =
document.getElementById("recordBtn");

const audioPreview =
document.getElementById("audioPreview");

const recordingStatus =
document.getElementById("recordingStatus");

const backgroundMusic =
document.getElementById("bgMusic");

/* =========================================================
   AUDIO RECORD
========================================================= */

let mediaRecorder = null;

let audioChunks = [];

let recordedAudioBlob = null;

let recordingTimer = null;

let recordingSeconds = 15;

let isRecording = false;

/* =========================================================
   START RECORD
========================================================= */

if(recordBtn){

recordBtn.addEventListener(
"click",
async()=>{

if(isRecording) return;

try{

isRecording = true;

/* MUSIC */

if(backgroundMusic){

backgroundMusic.volume = 0;

backgroundMusic.pause();

}

/* STREAM */

const stream =
await navigator.mediaDevices.getUserMedia({
audio:true
});

/* MIME */

let mimeType = "";

if(
MediaRecorder.isTypeSupported(
"audio/webm;codecs=opus"
)
){

mimeType =
"audio/webm;codecs=opus";

}
else if(
MediaRecorder.isTypeSupported(
"audio/webm"
)
){

mimeType =
"audio/webm";

}

/* RECORDER */

mediaRecorder =
new MediaRecorder(
stream,
mimeType
? { mimeType }
: undefined
);

audioChunks = [];

recordingSeconds = 15;

/* DATA */

mediaRecorder.ondataavailable =
(event)=>{

if(event.data.size > 0){

audioChunks.push(
event.data
);

}

};

/* STOP */

mediaRecorder.onstop = ()=>{

clearInterval(
recordingTimer
);

stream
.getTracks()
.forEach(track=>{

track.stop();

});

/* AUDIO BLOB */

recordedAudioBlob =
new Blob(
audioChunks,
{
type:
mediaRecorder.mimeType ||
"audio/webm"
}
);

/* PREVIEW */

const audioUrl =
URL.createObjectURL(
recordedAudioBlob
);

if(audioPreview){

audioPreview.src =
audioUrl;

audioPreview.style.display =
"block";

}

/* STATUS */

if(recordingStatus){

recordingStatus.innerHTML =
"Sesli mesaj hazır ✨";

}

/* RESET BUTTON */

recordBtn.disabled = false;

recordBtn.innerHTML =
"🎙️ Sesli Mesaj Gönder";

isRecording = false;

/* MUSIC RETURN */

if(backgroundMusic){

backgroundMusic.volume = 0.35;

backgroundMusic.play()
.catch(()=>{});

}

};

/* START */

mediaRecorder.start();

recordBtn.disabled = true;

recordBtn.innerHTML =
"Kaydediliyor...";

/* STATUS */

if(recordingStatus){

recordingStatus.innerHTML =
"15 saniye kaldı";

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

clearInterval(
recordingTimer
);

}

},1000);

}catch(error){

console.error(error);

alert(
"Mikrofon erişimi sağlanamadı 😔"
);

recordBtn.disabled = false;

recordBtn.innerHTML =
"🎙️ Sesli Mesaj Gönder";

isRecording = false;

/* MUSIC RETURN */

if(backgroundMusic){

backgroundMusic.volume = 0.35;

backgroundMusic.play()
.catch(()=>{});

}

}

}
);

}

/* =========================================================
   MODALS
========================================================= */

function openModal(modal){

if(!modal) return;

modal.classList.add(
"active"
);

document.body.style.overflow =
"hidden";

}

function closeAllModals(){

if(memoryModal){

memoryModal.classList.remove(
"active"
);

}

if(rsvpModal){

rsvpModal.classList.remove(
"active"
);

}

document.body.style.overflow =
"auto";

}

/* =========================================================
   OPEN MODALS
========================================================= */

document
.querySelectorAll('[data-open="memory"]')
.forEach(btn=>{

btn.addEventListener(
"click",
(event)=>{

event.preventDefault();

openModal(memoryModal);

}
);

});

document
.querySelectorAll('[data-open="rsvp"]')
.forEach(btn=>{

btn.addEventListener(
"click",
(event)=>{

event.preventDefault();

openModal(rsvpModal);

}
);

});

/* =========================================================
   CLOSE MODALS
========================================================= */

document
.querySelectorAll(
".modal-close,.memory-overlay,.rsvp-close"
)
.forEach(element=>{

element.addEventListener(
"click",
()=>{

closeAllModals();

}
);

});

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
"Dosya yüklenemedi 😔"
);

}

return data.secure_url;

}

/* =========================================================
   MEMORY FORM
========================================================= */

let memorySubmitting = false;

if(memoryForm){

memoryForm.addEventListener(
"submit",
async(event)=>{

event.preventDefault();

if(memorySubmitting) return;

memorySubmitting = true;

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
document.getElementById("memoryName")
?.value || "";

const message =
document.getElementById("memoryMessage")
?.value || "";

const files =
document.getElementById("memoryFile")
?.files || [];

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

/* MESSAGE LIMIT */

if(message.length > 400){

throw new Error(
"Mesaj en fazla 400 karakter olabilir 🤍"
);

}

let mediaItems = [];

let imageCount = 0;

let videoCount = 0;

/* FILES */

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

/* UPLOAD */

const uploadedUrl =
await uploadToCloudinary(
file
);

mediaItems.push({

url:uploadedUrl,

type:file.type

});

}

/* AUDIO */

if(recordedAudioBlob){

const audioFile =
new File(
[recordedAudioBlob],
"voice-message.webm",
{
type:
recordedAudioBlob.type ||
"audio/webm"
}
);

const uploadedAudio =
await uploadToCloudinary(
audioFile
);

mediaItems.push({

url:uploadedAudio,

type:
recordedAudioBlob.type ||
"audio/webm"

});

}

/* SAVE */

await addDoc(
collection(db,"memories"),
{

name,
message,
mediaItems,

hidden:false,

createdAt:
serverTimestamp()

}
);

/* RESET */

memoryForm.reset();

recordedAudioBlob = null;

audioChunks = [];

if(audioPreview){

audioPreview.src = "";

audioPreview.style.display =
"none";

}

if(recordingStatus){

recordingStatus.innerHTML =
"Hazır";

}

closeAllModals();

showPopup(
"Anınız Kaydedildi 🤍",
"Bu güzel an artık hikayemizin bir parçası oldu ✨"
);

}catch(error){

console.error(error);

showPopup(
"Bir Sorun Oluştu 😔",
error.message ||
"Bir hata oluştu"
);

}

/* FINAL */

submitBtn.disabled = false;

submitBtn.innerHTML =
originalText;

memorySubmitting = false;

}
);

}

/* =========================================================
   RSVP FORM
========================================================= */

let rsvpSubmitting = false;

if(rsvpForm){

rsvpForm.addEventListener(
"submit",
async(event)=>{

event.preventDefault();

if(rsvpSubmitting) return;

rsvpSubmitting = true;

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
document.getElementById("rsvpName")
?.value || "";

const status =
document.getElementById("attendanceStatus")
?.value || "";

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

await addDoc(
collection(db,"rsvp"),
{

name,
status,

guestCount:
document.getElementById("guestCount")
?.value || "",

comingMessage:
document.getElementById("comingMessage")
?.value || "",

cannotJoinMessage:
document.getElementById("cannotJoinMessage")
?.value || "",

maybeMessage:
document.getElementById("maybeMessage")
?.value || "",

createdAt:
serverTimestamp()

}
);

rsvpForm.reset();

closeAllModals();

showPopup(
"Katılım Bilginiz Ulaştı 🤍",
"Bu özel günümüzde yanımızda olmanız bizi çok mutlu etti ✨"
);

}catch(error){

console.error(error);

showPopup(
"Bir Sorun Oluştu 😔",
error.message ||
"Bir hata oluştu"
);

}

/* FINAL */

submitBtn.disabled = false;

submitBtn.innerHTML =
originalText;

rsvpSubmitting = false;

}
);

}

/* =========================================================
   POPUP
========================================================= */

function showPopup(
title,
message
){

alert(
`${title}\n\n${message}`
);

}
```
