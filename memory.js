document.addEventListener("DOMContentLoaded",()=>{

/* RSVP MODAL */

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

/* MEMORY MODAL */

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

/* OVERLAY CLOSE */

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

/* RSVP CONDITIONAL AREAS */

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

});
