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
   RSVP CONDITIONAL AREAS
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
   RSVP FORM SUBMIT
========================= */

const rsvpForm =
document.getElementById("rsvpForm");

if(rsvpForm){

rsvpForm.addEventListener("submit",(e)=>{

e.preventDefault();

let message = "";

const status =
document.getElementById(
"rsvpStatus"
).value;

if(status === "geliyor"){

message = `
Sizi yanımızda görecek olmak bizi çok mutlu etti 🤍<br><br>
Bu güzel günü birlikte paylaşacağımız için heyecanlıyız.
`;

}

if(status === "gelmiyor"){

message = `
Mesajınız bizim için çok kıymetli 🤍<br><br>
Gönlünüzün bizimle olduğunu bilmek bile yeterli.
`;

}

if(status === "kararsiz"){

message = `
Umarız o gün birlikte oluruz 🤍<br><br>
Bize bıraktığınız güzel not için teşekkür ederiz.
`;

}

showSuccessMessage(message);

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

});

}

/* =========================
   MEMORY FORM SUBMIT
========================= */

const memoryForm =
document.getElementById("memoryForm");

if(memoryForm){

memoryForm.addEventListener("submit",(e)=>{

e.preventDefault();

showSuccessMessage(`
Bize bıraktığınız bu anı yıllar sonra bile
gülümseyerek hatırlayacağız 🤍
`);

memoryForm.reset();

memoryModal.classList.remove(
"active"
);

document.body.style.overflow =
"auto";

});

}

/* =========================
   SUCCESS POPUP
========================= */

function showSuccessMessage(message){

const success =
document.createElement("div");

success.className =
"success-popup";

success.innerHTML = `

<div class="success-box">

<div class="success-heart">
🤍
</div>

<div class="success-text">
${message}
</div>

</div>

`;

document.body.appendChild(
success
);

setTimeout(()=>{

success.classList.add(
"show"
);

},50);

setTimeout(()=>{

success.classList.remove(
"show"
);

setTimeout(()=>{

success.remove();

},600);

},4200);

}

});
