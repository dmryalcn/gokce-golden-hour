import "./firebase-config.js";

const {
collection,
addDoc,
serverTimestamp
} = window.firebaseFns;

const db = window.db;

document.addEventListener("DOMContentLoaded",()=>{

const memoryModal =
document.getElementById("memoryModal");

const openMemoryBtns =
document.querySelectorAll("[data-open-memory]");

const closeMemory =
document.getElementById("closeMemory");

if(memoryModal){

openMemoryBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

memoryModal.classList.add("active");

document.body.style.overflow =
"hidden";

});

});

}

if(closeMemory){

closeMemory.addEventListener("click",()=>{

memoryModal.classList.remove("active");

document.body.style.overflow =
"auto";

});

}

if(memoryModal){

memoryModal.addEventListener("click",(e)=>{

if(e.target.classList.contains("memory-overlay")){

memoryModal.classList.remove("active");

document.body.style.overflow =
"auto";

}

});

}

const form =
document.getElementById("memoryForm");

if(form){

form.addEventListener("submit",async(e)=>{

e.preventDefault();

const submitBtn =
document.getElementById("submitMemory");

submitBtn.disabled = true;

submitBtn.innerText =
"Gönderiliyor...";

const data = {

name:
document.getElementById("name").value,

phone:
document.getElementById("phone").value,

people:
document.getElementById("count").value,

status:
document.getElementById("status").value,

note:
document.getElementById("note").value,

createdAt:
serverTimestamp()

};

try{

await addDoc(
collection(db,"guests"),
data
);

submitBtn.innerText =
"Gönderildi 🤍";

form.reset();

}catch(err){

console.error(err);

submitBtn.innerText =
"Hata oluştu";

}

setTimeout(()=>{

submitBtn.disabled = false;

submitBtn.innerText =
"Gönder";

},2500);

});

}

});
