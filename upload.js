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
"button"
);

submitBtn.disabled = true;

submitBtn.innerText =
"Yükleniyor...";

try{

const name =
document.getElementById(
"memoryName"
).value;

const message =
document.getElementById(
"memoryMessage"
).value;

const file =
document.getElementById(
"memoryFile"
).files[0];

let fileUrl = "";

let fileType = "";

/* =========================
   CLOUDINARY UPLOAD
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

fileUrl =
data.secure_url;

fileType =
file.type;

}

/* =========================
   FIRESTORE SAVE
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
   SUCCESS
========================= */

memoryForm.reset();

document
.getElementById("memoryModal")
.classList.remove("active");

showUploadPopup(
"Anınız bize ulaştı 🤍"
);

}catch(err){

console.error(err);

showUploadPopup(
"Bir hata oluştu 😔"
);

}

submitBtn.disabled = false;

submitBtn.innerText =
"Gönder";

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
"button"
);

submitBtn.disabled = true;

submitBtn.innerText =
"Gönderiliyor...";

try{

const name =
document.getElementById(
"rsvpName"
).value;

const status =
document.getElementById(
"rsvpStatus"
).value;

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

rsvpForm.reset();

document
.getElementById("rsvpModal")
.classList.remove("active");

showUploadPopup(
"Katılım bilginiz bize ulaştı 🤍"
);

}catch(err){

console.error(err);

showUploadPopup(
"Bir hata oluştu 😔"
);

}

submitBtn.disabled = false;

submitBtn.innerText =
"Gönder";

}
);

}

/* =========================
   POPUP
========================= */

function showUploadPopup(text){

const popup =
document.createElement("div");

popup.innerHTML = `

<div style="
position:fixed;
inset:0;
background:rgba(0,0,0,.45);
display:flex;
align-items:center;
justify-content:center;
z-index:999999;
backdrop-filter:blur(8px);
">

<div style="
background:white;
padding:40px;
border-radius:26px;
max-width:420px;
width:90%;
text-align:center;
font-size:18px;
line-height:1.8;
box-shadow:0 20px 80px rgba(0,0,0,.18);
">

<div style="
font-size:46px;
margin-bottom:18px;
">
🤍
</div>

${text}

</div>

</div>

`;

document.body.appendChild(
popup
);

setTimeout(()=>{

popup.remove();

},3000);

}
