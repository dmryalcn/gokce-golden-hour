document.addEventListener("DOMContentLoaded",()=>{

  /* CREATE PRELOADER */

  const preloader = document.createElement("div");

  preloader.id = "preloader";

  preloader.innerHTML = `

    <div class="preloader-glow"></div>

    <div class="preloader-logo">
      G&Y
    </div>

    <div class="preloader-line"></div>

    <div class="preloader-text">
      yükleniyor
    </div>

  `;

  document.body.prepend(preloader);

  /* HIDE PRELOADER */

  window.addEventListener("load",()=>{

    setTimeout(()=>{

      preloader.classList.add("hide");

      setTimeout(()=>{

        preloader.remove();

      },1000);

    },1600);

  });

});
