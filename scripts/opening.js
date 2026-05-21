document.addEventListener(
"DOMContentLoaded",
()=>{

const opening =
document.getElementById(
"openingScreen"
);

const openBtn =
document.getElementById(
"openSiteBtn"
);

const envelope =
document.querySelector(
".envelope"
);

const seal =
document.querySelector(
".opening-seal"
);

const lightBurst =
document.querySelector(
".light-burst"
);

const music =
document.getElementById(
"bgMusic"
);

if(
!opening ||
!openBtn ||
!envelope
) return;

document.body.style.overflow =
"hidden";

let opened = false;

openBtn.addEventListener(
"click",
()=>{

if(opened) return;

opened = true;

/* MUSIC */

if(music){

music.volume = 0.18;

music.play().catch(()=>{});

}

/* SEAL BREAK */

seal.classList.add(
"crack"
);

/* LIGHT BURST */

setTimeout(()=>{

lightBurst.classList.add(
"show"
);

},250);

/* ENVELOPE OPEN */

setTimeout(()=>{

envelope.classList.add(
"open"
);

},500);

/* SITE REVEAL */

setTimeout(()=>{

opening.classList.add(
"hidden"
);

document.body.style.overflow =
"auto";

},2600);

/* REMOVE */

setTimeout(()=>{

opening.remove();

},4200);

});

});

