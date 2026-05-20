document.addEventListener("DOMContentLoaded",()=>{

const memoryModal =
document.getElementById("memoryModal");

const openButtons =
document.querySelectorAll("[data-open-memory]");

const closeButton =
document.getElementById("closeMemory");

if(!memoryModal){
console.log("memoryModal bulunamadı");
return;
}

openButtons.forEach(button=>{

button.addEventListener("click",()=>{

memoryModal.classList.add("active");

document.body.style.overflow =
"hidden";

});

});

if(closeButton){

closeButton.addEventListener("click",()=>{

memoryModal.classList.remove("active");

document.body.style.overflow =
"auto";

});

}

const overlay =
document.querySelector(".memory-overlay");

if(overlay){

overlay.addEventListener("click",()=>{

memoryModal.classList.remove("active");

document.body.style.overflow =
"auto";

});

}

});
