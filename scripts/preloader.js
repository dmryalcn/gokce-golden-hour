window.addEventListener("load", () => {

const preloader =
document.getElementById("preloader");

if(preloader){

preloader.style.opacity = "0";

setTimeout(()=>{

preloader.style.display = "none";

document.body.style.overflow = "auto";

},600);

}

});
