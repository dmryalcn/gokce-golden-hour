document.addEventListener("DOMContentLoaded",()=>{

  /* =========================
     CREATE OPENING
  ========================= */

  const opening =
    document.createElement("div");

  opening.className =
    "invitation-opening";

  opening.innerHTML = `

    <div class="light-burst"></div>

    <div class="envelope">

      <div class="envelope-body">

        <div class="envelope-flap"></div>

        <div class="invitation-paper">

          <h2>G&Y</h2>

          <p>
            DAVETİMİZE HOŞ GELDİNİZ
          </p>

        </div>

      </div>

      <div class="opening-seal">
        G&Y
      </div>

    </div>

  `;

  document.body.appendChild(
    opening
  );

  /* =========================
     ELEMENTS
  ========================= */

  const seal =
    opening.querySelector(
      ".opening-seal"
    );

  const envelope =
    opening.querySelector(
      ".envelope"
    );

  const lightBurst =
    opening.querySelector(
      ".light-burst"
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

      /* LIGHT */

      setTimeout(()=>{

        lightBurst.classList.add(
          "show"
        );

      },300);

      /* OPEN ENVELOPE */

      setTimeout(()=>{

        envelope.classList.add(
          "open"
        );

      },700);

      /* REMOVE OPENING */

      setTimeout(()=>{

        opening.classList.add(
          "hidden"
        );

        document.body.style.overflow =
          "";

      },4500);

    }
  );

  /* LOCK SCROLL */

  document.body.style.overflow =
    "hidden";

});
