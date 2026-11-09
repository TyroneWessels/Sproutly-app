(() => {
  const steps = [
    { title: "Zoek een plant", description: "Gebruik de zoekbalk of bekijk alle planten. Open een plant om te lezen wat die nodig heeft." },
    { title: "Voeg je plant toe", description: "Kies Een plant toevoegen. Geef elk exemplaar een eigen naam, zodat je ze makkelijk herkent in Mijn planten." },
    { title: "Houd verzorging bij", description: "Noteer op de plantpagina wat je hebt gedaan. In de verzorgingskalender zie je wanneer je de aarde weer kunt controleren." }
  ];
  const start = document.querySelector("#tour-start");
  const modal = document.querySelector("#tour-modal");
  const close = document.querySelector("#tour-close");
  const skip = document.querySelector("#tour-skip");
  const previous = document.querySelector("#tour-back");
  const next = document.querySelector("#tour-next");
  const title = document.querySelector("#tour-title");
  const description = document.querySelector("#tour-description");
  const progress = document.querySelector("#tour-progress");
  let step = 0;

  function render() {
    title.textContent = steps[step].title;
    description.textContent = steps[step].description;
    progress.textContent = `Stap ${step + 1} van ${steps.length}`;
    previous.hidden = step === 0;
    next.textContent = step === steps.length - 1 ? "Afronden" : "Volgende";
  }

  function finish() {
    modal.hidden = true;
    start.focus();
  }

  start.addEventListener("click", () => {
    step = 0;
    render();
    modal.hidden = false;
    close.focus();
  });
  close.addEventListener("click", finish);
  skip.addEventListener("click", finish);
  previous.addEventListener("click", () => { if (step > 0) { step -= 1; render(); } });
  next.addEventListener("click", () => {
    if (step === steps.length - 1) finish();
    else { step += 1; render(); }
  });
  modal.addEventListener("click", (event) => { if (event.target === modal) finish(); });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); finish(); return; }
    if (event.key !== "Tab") return;
    const buttons = [close, previous, next, skip].filter((button) => !button.hidden && !button.disabled);
    if (event.shiftKey && document.activeElement === buttons[0]) {
      event.preventDefault();
      buttons[buttons.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {
      event.preventDefault();
      buttons[0].focus();
    }
  });
})();
