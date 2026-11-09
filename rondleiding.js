(() => {
  const steps = [
    { path: "./", title: "Welkom bij Sproutly", description: "In deze rondleiding bezoeken we de belangrijkste pagina's. Je kunt op elk moment stoppen." },
    { path: "planten/", title: "Zoek een plant", description: "Op Alle planten kun je zoeken en filteren. Open een plant om meer te lezen of deze toe te voegen." },
    { path: "plant/?naam=Monstera", title: "Bekijk en voeg een plant toe", description: "Dit is de pagina van de Monstera als voorbeeld. Met Een plant toevoegen bewaar je een exemplaar. Daarna kun je op de plantpagina gegevens en verzorgingsmomenten bijhouden." },
    { path: "mijn-planten/", title: "Bekijk jouw planten", description: "Hier vind je jouw opgeslagen planten. Open een plant om de gegevens en het verzorgingslogboek te bekijken of te bewerken." },
    { path: "kalender/", title: "Bekijk de verzorgingskalender", description: "Hier zie je welke verzorgingsmomenten gepland staan. Controleer eerst de aarde: een controle betekent niet automatisch water geven." }
  ];
  const start = document.querySelector("#tour-start");
  let modal = document.querySelector("#tour-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "tour-modal";
    modal.className = "modal-backdrop";
    modal.hidden = true;
    modal.innerHTML = `
      <section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description">
        <button class="modal-close" id="tour-close" type="button" aria-label="Sluit rondleiding">×</button>
        <p class="eyebrow">Een goede start</p>
        <p class="tour-progress" id="tour-progress" aria-live="polite"></p>
        <h2 id="tour-title"></h2>
        <p id="tour-description"></p>
        <div class="tour-actions">
          <button class="outline-button" type="button" id="tour-back">Vorige</button>
          <button class="primary-button" type="button" id="tour-next">Volgende</button>
          <button class="text-button" type="button" id="tour-skip">Rondleiding sluiten</button>
        </div>
      </section>`;
    document.body.appendChild(modal);
  }
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
    const focusTarget = start || document.querySelector("main h1");
    if (focusTarget) {
      if (!start) focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus();
    }
  }

  function navigate(index) {
    const destination = new URL(steps[index].path, document.baseURI);
    destination.searchParams.set("rondleiding", String(index));
    window.location.assign(destination.href);
  }

  if (start) start.addEventListener("click", () => {
    step = 0;
    render();
    modal.hidden = false;
    close.focus();
  });
  close.addEventListener("click", finish);
  skip.addEventListener("click", finish);
  previous.addEventListener("click", () => { if (step > 0) navigate(step - 1); });
  next.addEventListener("click", () => {
    if (step === steps.length - 1) finish();
    else navigate(step + 1);
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

  const url = new URL(window.location.href);
  const requested = url.searchParams.get("rondleiding");
  if (requested !== null) {
    url.searchParams.delete("rondleiding");
    window.history.replaceState(window.history.state, "", url.href);
    const index = Number(requested);
    if (/^[0-9]+$/.test(requested) && index < steps.length) {
      const expected = new URL(steps[index].path, document.baseURI);
      if (url.pathname === expected.pathname && [...expected.searchParams].every(([key, value]) => url.searchParams.get(key) === value)) {
        step = index;
        render();
        modal.hidden = false;
        close.focus();
      }
    }
  }
})();
