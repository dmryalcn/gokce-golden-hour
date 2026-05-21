/* =========================
   IMAGE PROTECTION SYSTEM
========================= */

document.addEventListener("DOMContentLoaded",()=>{

  /* RIGHT CLICK BLOCK */

  document.addEventListener("contextmenu",(e)=>{

    e.preventDefault();

  });

  /* IMAGE DRAG BLOCK */

  document.querySelectorAll("img").forEach(img=>{

    img.setAttribute("draggable","false");

    img.addEventListener("dragstart",(e)=>{

      e.preventDefault();

    });

  });

  /* TEXT SELECT BLOCK */

  document.addEventListener("selectstart",(e)=>{

    e.preventDefault();

  });

  /* LONG PRESS BLOCK (iPhone) */

  document.querySelectorAll("img").forEach(img=>{

    img.style.webkitTouchCallout = "none";

    img.style.webkitUserSelect = "none";

    img.style.userSelect = "none";

    img.style.pointerEvents = "auto";

  });

  /* KEY SHORTCUTS */

  document.addEventListener("keydown",(e)=>{

    /* CTRL + S */

    if(
      (e.ctrlKey || e.metaKey)
      &&
      e.key.toLowerCase() === "s"
    ){

      e.preventDefault();

    }

    /* CTRL + U */

    if(
      (e.ctrlKey || e.metaKey)
      &&
      e.key.toLowerCase() === "u"
    ){

      e.preventDefault();

    }

    /* CTRL + SHIFT + I */

    if(
      (e.ctrlKey || e.metaKey)
      &&
      e.shiftKey
      &&
      e.key.toLowerCase() === "i"
    ){

      e.preventDefault();

    }

    /* F12 */

    if(e.key === "F12"){

      e.preventDefault();

    }

  });

});
