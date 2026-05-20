document.addEventListener("DOMContentLoaded",()=>{

  /* MEMORY SECTION */

  const memorySection =

    document.querySelector(
      ".memory-section"
    );

  if(!memorySection) return;

  /* ADD PREMIUM CLASS */

  memorySection.classList.add(
    "memory-enhanced"
  );

  /* TITLE */

  const title =
    memorySection.querySelector("h2");

  if(title){

    title.classList.add(
      "memory-title"
    );

  }

  /* TEXT */

  const text =
    memorySection.querySelector("p");

  if(text){

    text.classList.add(
      "memory-text"
    );

  }

  /* CTA */

  const buttonWrapper =
    document.createElement("div");

  buttonWrapper.className =
    "memory-cta";

  const tallyButton =
    memorySection.querySelector(
      ".btn"
    );

  if(tallyButton){

    tallyButton.parentNode.insertBefore(
      buttonWrapper,
      tallyButton
    );

    buttonWrapper.appendChild(
      tallyButton
    );

  }

  /* FLOATING HEARTS */

  function createHeart(){

    const heart =
      document.createElement("div");

    heart.className =
      "memory-heart";

    heart.innerHTML = "🤍";

    heart.style.left =
      Math.random() * 100 + "%";

    const duration =
      4 + Math.random() * 4;

    heart.style.animationDuration =
      duration + "s";

    memorySection.appendChild(
      heart
    );

    setTimeout(()=>{

      heart.remove();

    }, duration * 1000);

  }

  setInterval(()=>{

    createHeart();

  },1200);

});
