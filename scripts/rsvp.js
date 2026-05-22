/* =========================================================
   RSVP DYNAMIC SYSTEM
========================================================= */

const attendanceSelect =
document.getElementById(
"attendanceStatus"
);

const yesArea =
document.getElementById(
"yesArea"
);

const noArea =
document.getElementById(
"noArea"
);

const maybeArea =
document.getElementById(
"maybeArea"
);

/* =========================================================
   INIT
========================================================= */

function hideAllAreas(){

if(yesArea){

yesArea.style.display =
"none";

}

if(noArea){

noArea.style.display =
"none";

}

if(maybeArea){

maybeArea.style.display =
"none";

}

}

/* =========================================================
   CHANGE EVENT
========================================================= */

if(attendanceSelect){

hideAllAreas();

attendanceSelect.addEventListener(
"change",
()=>{

hideAllAreas();

/* YES */

if(
attendanceSelect.value ===
"yes"
){

if(yesArea){

yesArea.style.display =
"block";

}

}

/* NO */

else if(
attendanceSelect.value ===
"no"
){

if(noArea){

noArea.style.display =
"block";

}

}

/* MAYBE */

else if(
attendanceSelect.value ===
"maybe"
){

if(maybeArea){

maybeArea.style.display =
"block";

}

}

}
);

}

