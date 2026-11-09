const plant = window.SPROUTLY_PLANTS.find((item) => item.name === new URLSearchParams(location.search).get("naam"));
const page = document.querySelector("#plant-page");
const statusMessage = document.querySelector("#plant-status");
const addButton = document.querySelector("#add-plant");
const profileFields = document.querySelector("#profile-fields");
const logFields = document.querySelector("#log-fields");
const personalSection = document.querySelector("#personal-section");
const profileForm = document.querySelector("#detail-profile-form");
const profileSummary = document.querySelector("#profile-summary");
const editProfile = document.querySelector("#edit-profile");
const cancelProfile = document.querySelector("#cancel-profile");
const logForm = document.querySelector("#care-log-form");
const logList = document.querySelector("#care-log-list");
const plantPicker = document.querySelector("#plant-instance-picker");
const plantSelect = document.querySelector("#plant-instance");
const fields = {
  name: document.querySelector("#detail-name"),
  location: document.querySelector("#detail-location"),
  date: document.querySelector("#detail-date"),
  photo: document.querySelector("#detail-photo"),
  notes: document.querySelector("#detail-notes"),
  favorite: document.querySelector("#detail-favorite"),
  logDate: document.querySelector("#log-date"),
  action: document.querySelector("#log-action"),
  logNotes: document.querySelector("#log-notes")
};

const requestedId = new URLSearchParams(location.search).get("id");
let selectedId = null;
let state;
let signedIn = false;
let ready = false;
let busy = false;
let profileDirty = false;
let logDirty = false;
let editingProfile = false;

const descriptions = {
  "Monstera": "De monstera, ook wel gatenplant genoemd, is een kamerplant met grote bladeren waarin op latere leeftijd gaten kunnen ontstaan.",
  "Basilicum": "Basilicum is een geurig keukenkruid. De bladeren kunnen worden gebruikt in bijvoorbeeld sauzen en salades.",
  "Lavendel": "Lavendel is een geurende buitenplant met paarse bloemen die bijen en andere bestuivers aantrekken.",
  "Sansevieria": "Sansevieria, ook wel vrouwentong genoemd, is een kamerplant met stevige, rechtopstaande bladeren.",
  "Aloë vera": "Aloë vera is een vetplant met dikke bladeren waarin de plant vocht opslaat.",
  "Tomaat": "De tomatenplant is een groenteplant die bij voldoende licht en warmte vruchten kan dragen.",
  "Rozemarijn": "Rozemarijn is een geurig kruid met smalle bladeren, geliefd in de keuken.",
  "Pannenkoekenplant": "De pannenkoekenplant dankt haar naam aan de ronde bladeren en kan kleine stekjes vormen.",
  "Olifantspoot": "De olifantspoot is een langzaam groeiende plant met een verdikte stam en lange, smalle bladeren.",
  "Goudrank": "De goudrank is een klimmende of hangende kamerplant met hartvormige bladeren, vaak met een lichte tekening.",
  "Lepelplant": "De lepelplant heeft glanzende groene bladeren en kan witte, lepelvormige schutbladeren vormen.",
  "ZZ-plant": "De ZZ-plant heeft stevige stelen met glanzende bladeren en slaat vocht op in ondergrondse wortelstokken.",
  "Graslelie": "De graslelie heeft lange, smalle bladeren en vormt vaak uitlopers met kleine nieuwe plantjes.",
  "Rubberplant": "De rubberplant is een ficus met grote, stevige en glanzende bladeren.",
  "Vioolbladplant": "De vioolbladplant is een ficus met grote bladeren die aan de vorm van een viool doen denken.",
  "Klimmende philodendron": "Deze philodendron heeft hartvormige bladeren en kan langs een steun klimmen of naar beneden hangen.",
  "Drakenbloedboom": "De drakenbloedboom heeft smalle bladeren die in een rozet aan de uiteinden van de stam groeien.",
  "Chinese evergreen": "De Chinese evergreen is een aglaonema met decoratieve, vaak getekende bladeren.",
  "Calathea": "Deze calathea valt op door haar opvallend getekende bladeren, die in de loop van de dag kunnen bewegen.",
  "Pachira": "De pachira, ook wel geldboom genoemd, heeft bladeren die uit meerdere deelblaadjes bestaan.",
  "Goudpalm": "De goudpalm is een kamerplant met gebogen, geveerde bladeren en meerdere stengels.",
  "Hoya": "De hoya of wasbloem is een klimmende plant met stevige bladeren en kan trosjes wasachtige bloemen vormen.",
  "Erwtenplant": "De erwtenplant is een hangende vetplant met ronde blaadjes die op kleine erwten lijken.",
  "Tradescantia": "Deze tradescantia is een hangende plant met langwerpige bladeren en een zilverachtige en paarse tekening.",
  "Kamerlinde": "Deze plant, Chamaedorea elegans, is een kleine palm met fijne, geveerde bladeren.",
  "Kwartjesplant": "De kwartjesplant is een peperomia met ronde tot ovale, stevige bladeren.",
  "Geldboom": "Deze geldboom, ook jadeplant genoemd, is een vetplant met dikke bladeren en vertakte stengels.",
  "Vlinderorchidee": "De vlinderorchidee heeft brede bladeren en bloemen die op lange bloemstelen verschijnen.",
  "Varen": "Deze varen heeft lange, sierlijk overhangende bladveren en vormt geen bloemen.",
  "Kroton": "De kroton heeft stevige bladeren die afhankelijk van de plant verschillende kleuren en tekeningen kunnen hebben.",
  "Flamingoplant": "De flamingoplant heeft glanzende bladeren en opvallende gekleurde schutbladeren rond de bloeikolf.",
  "Ficus benjamina": "De Ficus benjamina, of treurvijg, is een vertakkende kamerplant met kleine, puntige bladeren."
};

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function updatePlantSelector() {
  const matches = state.savedPlants.filter((id) => window.SproutlyPlants.species(id, state.plantProfiles) === plant.name);
  plantPicker.hidden = matches.length === 0;
  plantSelect.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Kies een plant";
  plantSelect.append(placeholder);
  matches.forEach((id) => {
    const profile = state.plantProfiles[id] || {};
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${window.SproutlyPlants.label(id, state.savedPlants, state.plantProfiles)}${profile.location ? ` · ${profile.location}` : ""}`;
    plantSelect.append(option);
  });
  plantSelect.value = selectedId || "";
}

function updateControls() {
  const saved = state && selectedId && state.savedPlants.includes(selectedId);
  addButton.disabled = !ready || busy;
  plantSelect.disabled = !ready || busy;
  addButton.textContent = saved ? "Nog een plant toevoegen" : "Een plant toevoegen";
  personalSection.hidden = !saved;
  profileFields.disabled = !ready || busy;
  editProfile.disabled = !ready || busy;
  cancelProfile.disabled = !ready || busy;
  logFields.disabled = !ready || busy;
  document.querySelector("#nav-count").textContent = String(state ? state.savedPlants.length : 0);
}

function renderLog() {
  logList.replaceChildren();
  const entries = [...(state.plantProfiles[selectedId]?.careLog || [])].sort((a, b) => b.date.localeCompare(a.date));
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "Je hebt nog geen verzorging toegevoegd.";
    logList.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const row = document.createElement("article");
    row.className = "care-log-entry";
    const title = document.createElement("strong");
    title.textContent = entry.action;
    const date = document.createElement("time");
    date.dateTime = entry.date;
    const [year, month, day] = entry.date.split("-");
    date.textContent = `${day}-${month}-${year}`;
    const notes = document.createElement("p");
    notes.textContent = entry.notes;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "text-button";
    remove.textContent = "Verwijderen";
    remove.setAttribute("aria-label", `Verwijder ${entry.action} van ${date.textContent} uit het logboek`);
    remove.disabled = busy || !ready;
    remove.addEventListener("click", async () => {
      const previousState = JSON.parse(JSON.stringify(state));
      const profile = state.plantProfiles[selectedId];
      profile.careLog = profile.careLog.filter((item) => item.id !== entry.id);
      await save("De verzorging is uit het logboek verwijderd.", previousState);
    });
    row.append(title, date);
    if (entry.notes) row.append(notes);
    row.append(remove);
    logList.append(row);
  });
}

function renderProfile() {
  const profile = state.plantProfiles[selectedId] || {};
  document.querySelector("#profile-title").textContent = `Gegevens van ${selectedId ? window.SproutlyPlants.label(selectedId, state.savedPlants, state.plantProfiles) : plant.name}`;
  const date = window.SproutlyCare.parseDate(profile.date);
  document.querySelector("#summary-name").textContent = profile.customName || "Niet ingevuld";
  document.querySelector("#summary-location").textContent = profile.location || "Niet ingevuld";
  document.querySelector("#summary-date").textContent = date ? date.toLocaleDateString("nl-NL") : "Niet ingevuld";
  document.querySelector("#summary-notes").textContent = profile.notes || "Niet ingevuld";
  document.querySelector("#summary-favorite").textContent = profile.favorite ? "Ja" : "Nee";
  profileSummary.hidden = editingProfile;
  profileForm.hidden = !editingProfile;
  document.querySelector("#profile-help").textContent = editingProfile
    ? "Vul in wat je wilt onthouden. Alle velden zijn optioneel."
    : "Bekijk de gegevens die je over deze plant hebt bewaard.";
  fields.name.value = editingProfile ? profile.customName || "" : "";
  fields.location.value = editingProfile ? profile.location || "" : "";
  fields.date.value = editingProfile ? profile.date || "" : "";
  fields.notes.value = editingProfile ? profile.notes || "" : "";
  fields.favorite.checked = editingProfile && Boolean(profile.favorite);
  fields.photo.value = "";
  const preview = document.querySelector("#personal-photo-preview");
  preview.hidden = !profile.photo;
  if (profile.photo) preview.src = profile.photo;
  else preview.removeAttribute("src");
  document.querySelector("#remove-photo-label").hidden = !profile.photo;
  document.querySelector("#remove-photo").checked = false;
  updatePlantSelector();
  renderLog();
  updateControls();
}

async function save(message, previousState) {
  busy = true;
  updateControls();
  renderLog();
  try {
    if (signedIn) {
      state = await window.SproutlyAccount.saveState(state);
    } else {
      window.SproutlyPlants.writeLocal({
        "sproutly-profiles": state.plantProfiles,
        "sproutly-plants": state.savedPlants
      });
    }
    setStatus(message);
    return true;
  } catch (error) {
    console.error("Plantgegevens opslaan mislukt:", error);
    state = previousState;
    setStatus(signedIn
      ? error.message || "Opslaan bij je account is mislukt. Controleer je verbinding en probeer het opnieuw."
      : "Opslaan op deze browser is mislukt. Controleer of er voldoende opslagruimte beschikbaar is.");
    return false;
  } finally {
    busy = false;
    renderLog();
    updateControls();
  }
}

async function initialize() {
  try {
    const storedPlants = localStorage.getItem("sproutly-plants");
    state = {
      savedPlants: storedPlants ? JSON.parse(storedPlants) : [...window.SPROUTLY_DEFAULT_SAVED_PLANTS],
      plantProfiles: JSON.parse(localStorage.getItem("sproutly-profiles") || "{}"),
      completedTasks: JSON.parse(localStorage.getItem("sproutly-tasks") || "[]"),
      careOverrides: JSON.parse(localStorage.getItem("sproutly-care-overrides") || "{}")
    };
    if (!Array.isArray(state.savedPlants) || !state.plantProfiles || typeof state.plantProfiles !== "object"
      || Array.isArray(state.plantProfiles) || !Array.isArray(state.completedTasks)
      || !state.careOverrides || typeof state.careOverrides !== "object" || Array.isArray(state.careOverrides)) {
      throw new Error("Ongeldige lokale plantgegevens.");
    }
  } catch (error) {
    console.error("Lokale plantgegevens laden mislukt:", error);
    setStatus("De gegevens in deze browser konden niet worden gelezen. Ze zijn niet verwijderd of aangepast.");
    return;
  }

  try {
    const user = await window.SproutlyAccount.getUser();
    if (user) {
      state = await window.SproutlyAccount.getState();
      signedIn = true;
    }
    const matches = state.savedPlants.filter((id) => window.SproutlyPlants.species(id, state.plantProfiles) === plant.name);
    selectedId = requestedId && matches.includes(requestedId) ? requestedId : !requestedId && matches.length === 1 ? matches[0] : null;
    if (requestedId && !selectedId) {
      setStatus("Deze plant staat niet in Mijn planten. Kies een plant via Mijn planten of voeg een nieuwe toe.");
    } else {
      setStatus(signedIn ? "Je gegevens worden bij je account bewaard." : "Je gegevens worden op deze browser bewaard.");
    }
    ready = true;
    renderProfile();
  } catch (error) {
    console.error("Plantgegevens laden mislukt:", error);
    setStatus("Je accountgegevens konden niet worden gecontroleerd of geladen. Controleer je verbinding en laad de pagina opnieuw; er is niets overschreven.");
  }
}

if (!plant) {
  document.querySelector("#plant-not-found").hidden = false;
} else {
  page.hidden = false;
  document.title = `${plant.name} | Sproutly`;
  document.querySelector("#plant-title").textContent = plant.name;
  document.querySelector("#plant-category").textContent = plant.category;
  document.querySelector("#plant-scientific").textContent = plant.scientific;
  document.querySelector("#plant-description").textContent = descriptions[plant.name]
    || `${plant.name} (${plant.scientific}) is een ${plant.type.toLowerCase()} uit de Sproutly-collectie.`;
  document.querySelector("#plant-light").textContent = plant.light;
  document.querySelector("#plant-interval").textContent = `Ongeveer elke ${plant.soilCheckDays} dagen; vaker als de omstandigheden daarom vragen.`;
  document.querySelector("#plant-difficulty").textContent = plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld";
  const dryPlants = ["Sansevieria", "Aloë vera", "ZZ-plant", "Erwtenplant", "Olifantspoot", "Geldboom"];
  const moistPlants = ["Basilicum", "Tomaat", "Varen"];
  document.querySelector("#plant-water").textContent = dryPlants.includes(plant.name)
    ? "Laat de aarde eerst goed opdrogen voordat je opnieuw water geeft."
    : moistPlants.includes(plant.name)
      ? "Controleer de aarde regelmatig en laat deze niet langdurig uitdrogen."
      : plant.name === "Vlinderorchidee"
        ? "Controleer de wortels en het orchideeënschors; laat na het water geven overtollig water goed weglopen."
        : "Voel regelmatig aan de aarde en pas de hoeveelheid water aan de behoefte van de plant aan.";
  const image = document.querySelector("#plant-image");
  image.alt = plant.name;
  image.addEventListener("error", window.handlePlantImageError, { once: true });
  image.src = plant.image;
  document.querySelector("#plant-image-source").href = plant.imageSource;
  fields.logDate.value = localDate();
  fields.logDate.max = localDate();

  profileForm.addEventListener("input", () => { profileDirty = true; });
  profileForm.addEventListener("change", () => { profileDirty = true; });
  editProfile.addEventListener("click", () => {
    if (!ready || busy) return;
    editingProfile = true;
    renderProfile();
    fields.name.focus();
  });
  cancelProfile.addEventListener("click", () => {
    if (busy) return;
    if (profileDirty && !window.confirm("Je hebt niet-opgeslagen wijzigingen. Wil je stoppen met bewerken?")) return;
    profileDirty = false;
    editingProfile = false;
    renderProfile();
    editProfile.focus();
  });
  logForm.addEventListener("input", () => { logDirty = true; });
  logForm.addEventListener("change", () => { logDirty = true; });
  plantSelect.addEventListener("change", () => {
    if (!plantSelect.value) {
      plantSelect.value = selectedId || "";
      return;
    }
    if ((profileDirty || logDirty) && !window.confirm("Je hebt niet-opgeslagen wijzigingen. Wil je toch een andere plant kiezen?")) {
      plantSelect.value = selectedId || "";
      return;
    }
    location.href = window.SproutlyPlants.url(plant.name, plantSelect.value);
  });

  addButton.addEventListener("click", async () => {
    if (!ready || busy) return;
    if ((profileDirty || logDirty) && !window.confirm("Je hebt niet-opgeslagen wijzigingen. Wil je toch een nieuwe plant toevoegen?")) return;
    const previousState = JSON.parse(JSON.stringify(state));
    const previousId = selectedId;
    selectedId = window.SproutlyPlants.create(plant.name, state.plantProfiles);
    state.savedPlants.push(selectedId);
    if (await save(`${plant.name} is toegevoegd aan Mijn planten. Geef deze plant hieronder een eigen naam.`, previousState)) {
      history.replaceState(null, "", window.SproutlyPlants.url(plant.name, selectedId));
      fields.photo.value = "";
      fields.action.value = "";
      fields.logNotes.value = "";
      profileDirty = false;
      logDirty = false;
      editingProfile = true;
      renderProfile();
      profileForm.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      selectedId = previousId;
      updateControls();
      renderLog();
    }
  });

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const photo = fields.photo.files[0];
    if (photo && (!photo.type.startsWith("image/") || photo.size > 500000)) {
      setStatus("Kies een afbeelding van maximaal 500 KB.");
      return;
    }
    let photoData = document.querySelector("#remove-photo").checked ? "" : state.plantProfiles[selectedId]?.photo || "";
    if (photo) {
      try {
        photoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(photo);
        });
      } catch (error) {
        console.error("Foto lezen mislukt:", error);
        setStatus("De foto kon niet worden gelezen. Kies een andere foto.");
        return;
      }
    }
    const previousState = JSON.parse(JSON.stringify(state));
    state.plantProfiles[selectedId] = {
      ...state.plantProfiles[selectedId],
      customName: fields.name.value.trim(), location: fields.location.value.trim(),
      date: fields.date.value, notes: fields.notes.value.trim(), favorite: fields.favorite.checked, photo: photoData
    };
    if (await save("Je plantgegevens zijn opgeslagen.", previousState)) {
      fields.photo.value = "";
      profileDirty = false;
      editingProfile = false;
      renderProfile();
      editProfile.focus();
    }
  });

  logForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!window.SproutlyCare.parseDate(fields.logDate.value) || fields.logDate.value > localDate()) {
      setStatus("Kies een geldige datum die niet in de toekomst ligt.");
      return;
    }
    const profile = state.plantProfiles[selectedId] || {};
    const entries = profile.careLog || [];
    if (entries.length >= 200) {
      setStatus("Je logboek is vol. Verwijder eerst een oud verzorgingsmoment.");
      return;
    }
    const previousState = JSON.parse(JSON.stringify(state));
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    state.plantProfiles[selectedId] = {
      ...profile,
      careLog: [{ id, date: fields.logDate.value, action: fields.action.value, notes: fields.logNotes.value.trim() }, ...entries]
    };
    if (await save("Het verzorgingsmoment is toegevoegd aan je logboek.", previousState)) {
      fields.action.value = "";
      fields.logNotes.value = "";
      logDirty = false;
    }
  });
  initialize();
}
document.querySelector("#plant-year").textContent = String(new Date().getFullYear());
