document.addEventListener("DOMContentLoaded",()=>{

/* =========================
   CHECK OPENED BEFORE
========================= */

const alreadyOpened =


/* =========================
   IF OPENED BEFORE
========================= */

if(alreadyOpened){

document.body.style.overflow =
"auto";

const oldOpening =
document.querySelector(
".invitation-opening"
);

if(oldOpening){

oldOpening.remove();

}

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
   LOCK SCROLL
========================= */

document.body.style.overflow =
"hidden";

/* =========================
   OPEN EXPERIENCE
========================= */

seal.addEventListener(
"click",
()=>{

/* PREVENT DOUBLE CLICK */

if(seal.classList.contains(
"opened"
)) return;

seal.classList.add(
"opened"
);

/* SAVE STATE */

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

/* REMOVE INTRO */

setTimeout(()=>{

opening.classList.add(
"hidden"
);

document.body.style.overflow =
"auto";

setTimeout(()=>{

opening.remove();

},1000);

},4200);

}
);

});
