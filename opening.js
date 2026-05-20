document.addEventListener("DOMContentLoaded",()=>{

/* =========================
   CHECK OPENED BEFORE
========================= */

if(localStorage.getItem("invitationOpened")){

document.body.style.overflow = "";

return;

}

/* =========================
   CREATE OPENING
========================= */

const opening =
document.createElement("div");

opening.className =
"invitation-opening";

opening.innerHTML = `

<div class="light-burst"></div>

<div class="envelope">

<div class="envelope-body">

<div class="envelope-flap"></div>

<div class="invitation-paper">

<h2>G&Y</h2>

<p>
DAVETİMİZE HOŞ GELDİNİZ
</p>

</div>

</div>

<div class="opening-seal">
G&Y
</div>

</div>

`;

document.body.appendChild(
opening
);

/* =========================
   ELEMENTS
========================= */

const seal =
opening.querySelector(
".opening-seal"
);

const envelope =
opening.querySelector(
".envelope"
);

const lightBurst =
opening.querySelector(
".light-burst"
);

const music =
document.getElementById(
"bgMusic"
);

/* =========================
   OPEN EXPERIENCE
========================= */

seal.addEventListener(
"click",
()=>{

/* SAVE OPENED */

localStorage.setItem(
"invitationOpened",
"true"
);

/* PLAY MUSIC */

if(music){

music.volume = 0.18;

music.play().catch(()=>{});

}

/* BREAK SEAL */

seal.classList.add(
"crack"
);

/* LIGHT EFFECT */

setTimeout(()=>{

lightBurst.classList.add(
"show"
);

},250);

/* OPEN ENVELOPE */

setTimeout(()=>{

envelope.classList.add(
"open"
);

},700);

/* REMOVE OPENING */

setTimeout(()=>{

opening.classList.add(
"hidden"
);

document.body.style.overflow =
"";

setTimeout(()=>{

opening.remove();

},1200);

},4500);

}
);

/* =========================
   LOCK SCROLL
========================= */

document.body.style.overflow =
"hidden";

});
