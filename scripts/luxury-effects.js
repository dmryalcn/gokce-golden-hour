document.addEventListener("DOMContentLoaded", () => {

  const revealElements =
    document.querySelectorAll(
      ".section-header,.card,.memory-box,.time-box,.gallery-item"
    );

  const observer =
    new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

        }

      });

    }, {
      threshold: 0.12
    });

  revealElements.forEach(el => {

    el.classList.add("reveal");

    observer.observe(el);

  });

  document.body.classList.add("site-ready");

});
