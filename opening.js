
document.addEventListener("DOMContentLoaded",()=>{

  /* =========================
     CREATE OPENING
  ========================= */

  const opening =
    document.createElement("div");

  opening.className =
    "invitation-opening";

  opening.innerHTML = `

    <div class="opening-bg"></div>

    <div class="opening-card">

      <div class="opening-seal">
        G&Y
      </div>

      <h1>
        Gökçe & Yalçın
      </h1>

      <p>
        Mühre dokunarak
        davetiyemizi açın 🤍
      </p>

    </div>

    <div class="envelope">

      <div class="envelope-body envelope">

        <div class="envelope-flap"></div>

        <div class="invitation-paper">

          <h2>G&Y</h2>

          <span>
            DAVETİMİZE
            HOŞ GELDİNİZ
          </span>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(
    opening
  );

  /* =========================
     BACKGROUND IMAGE
  ========================= */

  const bg =
    opening.querySelector(
      ".opening-bg"
    );

  bg.style.backgroundImage =
    "url('images/gy1.jpeg')";

  /* =========================
     ELEMENTS
  ========================= */

  const seal =
    opening.querySelector(
      ".opening-seal"
    );

  const card =
    opening.querySelector(
      ".opening-card"
    );

  const envelope =
    opening.querySelector(
      ".envelope"
    );

  const envelopeBody =
    opening.querySelector(
      ".envelope-body"
    );

  /* =========================
     OPEN EXPERIENCE
  ========================= */

  seal.addEventListener(
    "click",
    ()=>{

      /* BREAK SEAL */

      seal.classList.add(
        "crack"
      );

      /* HIDE CARD */

      setTimeout(()=>{

        card.style.opacity = "0";

        card.style.transform =
          "scale(.92)";

      },500);

      /* SHOW ENVELOPE */

      setTimeout(()=>{

        envelope.classList.add(
          "show"
        );

      },700);

      /* OPEN ENVELOPE */

      setTimeout(()=>{

        envelopeBody.classList.add(
          "open"
        );

      },1200);

      /* REMOVE OPENING */

      setTimeout(()=>{

        opening.classList.add(
          "hidden"
        );

        document.body.style.overflow =
          "";

      },4200);

    }
  );

  /* LOCK SCROLL */

  document.body.style.overflow =
    "hidden";

});
