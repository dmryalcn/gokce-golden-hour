document.addEventListener("DOMContentLoaded",()=>{

const opening =
document.getElementById(
"openingScreen"
);

const openBtn =
document.getElementById(
"openSiteBtn"
);

const music =
document.getElementById(
"bgMusic"
);

if(!opening || !openBtn) return;

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

/* OPEN ANIMATION */

opening.classList.add(
"opening-hide"
);

/* ENABLE SCROLL */

document.body.style.overflow =
"auto";

/* REMOVE */

setTimeout(()=>{

opening.remove();

},1400);

}
);

});
