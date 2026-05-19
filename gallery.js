document.addEventListener("DOMContentLoaded",()=>{

  const images = document.querySelectorAll(".gallery img");

  images.forEach(img=>{

    img.loading = "lazy";
    img.decoding = "async";

  });

  const lightbox = document.createElement("div");

  lightbox.className = "lightbox";

  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-image" src="">
  `;

  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-image");

  const closeBtn = lightbox.querySelector(".lightbox-close");

  let currentIndex = 0;

  function openLightbox(index){

    currentIndex = index;

    lightboxImg.src = images[index].src;

    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){

    lightbox.classList.remove("show");

    document.body.style.overflow = "";
  }

  function showNext(){

    currentIndex = (currentIndex + 1) % images.length;

    lightboxImg.src = images[currentIndex].src;
  }

  function showPrev(){

    currentIndex =
      (currentIndex - 1 + images.length) % images.length;

    lightboxImg.src = images[currentIndex].src;
  }

  images.forEach((img,index)=>{

    img.addEventListener("click",()=>{

      openLightbox(index);

    });

  });

  closeBtn.addEventListener("click",closeLightbox);

  lightbox.addEventListener("click",(e)=>{

    if(e.target === lightbox){

      closeLightbox();

    }

  });

  document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("show")) return;

    if(e.key === "Escape") closeLightbox();

    if(e.key === "ArrowRight") showNext();

    if(e.key === "ArrowLeft") showPrev();

  });

  let startX = 0;

  lightbox.addEventListener("touchstart",(e)=>{

    startX = e.touches[0].clientX;

  });

  lightbox.addEventListener("touchend",(e)=>{

    let endX = e.changedTouches[0].clientX;

    let diff = startX - endX;

    if(Math.abs(diff) > 50){

      if(diff > 0){

        showNext();

      }else{

        showPrev();

      }

    }

  });

});
