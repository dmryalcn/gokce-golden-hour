document.addEventListener("DOMContentLoaded",()=>{

  const quotes = [

    "Bir ömür aynı manzaraya bakmak 🤍",

    "Seninle her an güzel.",

    "Bazı insanlar eve benzer.",

    "İyi ki sen.",

    "Sonsuza kadar.",

    "Birlikte daha güzel.",

    "Aşk küçük anlarda saklıdır.",

    "Kalbim sende.",

    "En güzel hikayemiz.",

    "Seninle tüm mevsimler güzel.",

    "Yanımda olman yeter.",

    "Aşk bazen bir bakışta başlar."

  ];

  const container = document.createElement("div");

  container.className = "floating-quotes";

  document.body.appendChild(container);

  function createQuote(){

    const quote = document.createElement("div");

    quote.className = "floating-quote";

    /* RANDOM SIZE */

    const sizes = [
      "small",
      "medium",
      "large"
    ];

    quote.classList.add(

      sizes[
        Math.floor(
          Math.random() * sizes.length
        )
      ]

    );

    /* RANDOM GOLD */

    if(Math.random() > 0.5){

      quote.classList.add("gold");

    }

    /* RANDOM TEXT */

    quote.textContent =

      quotes[
        Math.floor(
          Math.random() * quotes.length
        )
      ];

    /* POSITION */

    quote.style.left =
      Math.random() * 100 + "vw";

    /* SPEED */

    const duration =
      18 + Math.random() * 16;

    quote.style.animationDuration =
      duration + "s";

    /* DELAY */

    quote.style.animationDelay =
      Math.random() * 3 + "s";

    container.appendChild(quote);

    /* REMOVE */

    setTimeout(()=>{

      quote.remove();

    }, duration * 1000);

  }

  /* INITIAL */

  for(let i=0;i<6;i++){

    createQuote();

  }

  /* LOOP */

  setInterval(()=>{

    createQuote();

  },5000);

});
