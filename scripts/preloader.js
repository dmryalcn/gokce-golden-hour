window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
      // overflow'a dokunma — cinematic-opening.js yönetiyor
    }, 600);
  }
});
