document.addEventListener("DOMContentLoaded",()=>{

  const images =
    document.querySelectorAll(".gallery img");

  /* =========================
     ADVANCED IMAGE OPTIMIZATION
  ========================= */

  images.forEach((img,index)=>{

    /* LAZY */

    img.loading = "lazy";

    /* ASYNC */

    img.decoding = "async";

    /* FETCH PRIORITY */

    if(index < 4){

      img.fetchPriority = "high";

    }else{

      img.fetchPriority = "low";

    }

    /* INITIAL STATE */

    img.style.opacity = "0";

    img.style.filter =
      "blur(18px) brightness(.92)";

    img.style.transform =
      "scale(1.03)";

    img.style.transition =
      `
      opacity 1s ease,
      filter 1.2s ease,
      transform 1.2s ease
      `;

    /* IMAGE LOADED */

    function revealImage(){

      img.style.opacity = "1";

      img.style.filter =
        "blur(0px) brightness(1)";

      img.style.transform =
        "scale(1)";
    }

    /* CACHE FIX */

    if(img.complete){

      revealImage();

    }else{

      img.addEventListener(
        "load",
        revealImage
      );

    }

    /* SAFARI MEMORY FIX */

    img.style.willChange =
      "transform, opacity, filter";

    img.style.backfaceVisibility =
      "hidden";

    img.style.webkitBackfaceVisibility =
      "hidden";

  });

  /* =========================
     CINEMATIC LAYOUT
  ========================= */

  images.forEach((img,index)=>{

    if(index % 5 === 0){

      img.classList.add("wide");

    }

    if(index % 7 === 0){

      img.classList.add("tall");

    }

  });

  /* =========================
     LIGHTBOX
  ========================= */

  const lightbox =
    document.createElement("div");

  lightbox.className = "lightbox";

  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-image" src="">
  `;

  document.body.appendChild(lightbox);

  const lightboxImg =
    lightbox.querySelector(".lightbox-image");

  const closeBtn =
    lightbox.querySelector(".lightbox-close");

  let currentIndex = 0;

  function openLightbox(index){

    currentIndex = index;

    /* PRELOAD */

    const preloadImage = new Image();

    preloadImage.src =
      images[index].src;

    lightboxImg.src =
      images[index].src;

    lightbox.classList.add("show");

    document.body.style.overflow =
      "hidden";
  }

  function closeLightbox(){

    lightbox.classList.remove("show");

    document.body.style.overflow =
      "";
  }

  function showNext(){

    currentIndex =
      (currentIndex + 1)
      % images.length;

    lightboxImg.src =
      images[currentIndex].src;
  }

  function showPrev(){

    currentIndex =
      (
        currentIndex - 1
        + images.length
      )
      % images.length;

    lightboxImg.src =
      images[currentIndex].src;
  }

  images.forEach((img,index)=>{

    img.addEventListener(
      "click",
      ()=>{

        openLightbox(index);

      }
    );

  });

  closeBtn.addEventListener(
    "click",
    closeLightbox
  );

  lightbox.addEventListener(
    "click",
    (e)=>{

      if(e.target === lightbox){

        closeLightbox();

      }

    }
  );

  document.addEventListener(
    "keydown",
    (e)=>{

      if(
        !lightbox.classList.contains(
          "show"
        )
      ) return;

      if(e.key === "Escape")
        closeLightbox();

      if(e.key === "ArrowRight")
        showNext();

      if(e.key === "ArrowLeft")
        showPrev();

    }
  );

  /* =========================
     SWIPE
  ========================= */

  let startX = 0;

  lightbox.addEventListener(
    "touchstart",
    (e)=>{

      startX =
        e.touches[0].clientX;

    }
  );

  lightbox.addEventListener(
    "touchend",
    (e)=>{

      let endX =
        e.changedTouches[0].clientX;

      let diff =
        startX - endX;

      if(Math.abs(diff) > 50){

        if(diff > 0){

          showNext();

        }else{

          showPrev();

        }

      }

    }
  );

});
