const plant = window.SPROUTLY_PLANTS.find((item) => item.name === new URLSearchParams(location.search).get("naam"));
const page = document.querySelector("#plant-page");
const statusMessage = document.querySelector("#plant-status");
const addButton = document.querySelector("#add-plant");
const profileFields = document.querySelector("#profile-fields");
const logFields = document.querySelector("#log-fields");
const personalSection = document.querySelector("#personal-section");
const profileForm = document.querySelector("#detail-profile-form");
const logForm = document.querySelector("#care-log-form");
const logList = document.querySelector("#care-log-list");
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

let state;
let signedIn = false;
let ready = false;
let busy = false;

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

function updateControls() {
  const saved = state && state.savedPlants.includes(plant.name);
  addButton.disabled = !ready || busy || saved;
  addButton.textContent = saved ? "Toegevoegd aan Mijn planten" : "Aan Mijn planten toevoegen";
  personalSection.hidden = !saved;
  profileFields.disabled = !ready || busy;
  logFields.disabled = !ready || busy;
  document.querySelector("#nav-count").textContent = String(state ? state.savedPlants.length : 0);
}

function renderLog() {
  logList.replaceChildren();
  const entries = [...(state.plantProfiles[plant.name]?.careLog || [])].sort((a, b) => b.date.localeCompare(a.date));
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
      const profile = state.plantProfiles[plant.name];
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
  const profile = state.plantProfiles[plant.name] || {};
  fields.name.value = profile.customName || "";
  fields.location.value = profile.location || "";
  fields.date.value = profile.date || "";
  fields.notes.value = profile.notes || "";
  fields.favorite.checked = Boolean(profile.favorite);
  const preview = document.querySelector("#personal-photo-preview");
  preview.hidden = !profile.photo;
  if (profile.photo) preview.src = profile.photo;
  else preview.removeAttribute("src");
  document.querySelector("#remove-photo-label").hidden = !profile.photo;
  document.querySelector("#remove-photo").checked = false;
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
      localStorage.setItem("sproutly-plants", JSON.stringify(state.savedPlants));
      localStorage.setItem("sproutly-profiles", JSON.stringify(state.plantProfiles));
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
    ready = true;
    setStatus(signedIn ? "Je gegevens worden bij je account bewaard." : "Je gegevens worden op deze browser bewaard.");
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

  addButton.addEventListener("click", async () => {
    const previousState = JSON.parse(JSON.stringify(state));
    if (!state.savedPlants.includes(plant.name)) state.savedPlants.push(plant.name);
    await save(`${plant.name} is toegevoegd aan Mijn planten. Je kunt nu je gegevens invullen.`, previousState);
  });

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const photo = fields.photo.files[0];
    if (photo && (!photo.type.startsWith("image/") || photo.size > 500000)) {
      setStatus("Kies een afbeelding van maximaal 500 KB.");
      return;
    }
    let photoData = document.querySelector("#remove-photo").checked ? "" : state.plantProfiles[plant.name]?.photo || "";
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
    state.plantProfiles[plant.name] = {
      ...state.plantProfiles[plant.name],
      customName: fields.name.value.trim(), location: fields.location.value.trim(),
      date: fields.date.value, notes: fields.notes.value.trim(), favorite: fields.favorite.checked, photo: photoData
    };
    if (await save("Je plantgegevens zijn opgeslagen.", previousState)) {
      fields.photo.value = "";
      renderProfile();
    }
  });

  logForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const profile = state.plantProfiles[plant.name] || {};
    const entries = profile.careLog || [];
    if (entries.length >= 200) {
      setStatus("Je logboek is vol. Verwijder eerst een oud verzorgingsmoment.");
      return;
    }
    const previousState = JSON.parse(JSON.stringify(state));
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    state.plantProfiles[plant.name] = {
      ...profile,
      careLog: [{ id, date: fields.logDate.value, action: fields.action.value, notes: fields.logNotes.value.trim() }, ...entries]
    };
    if (await save("Het verzorgingsmoment is toegevoegd aan je logboek.", previousState)) {
      fields.action.value = "";
      fields.logNotes.value = "";
    }
  });
  initialize();
}
document.querySelector("#plant-year").textContent = String(new Date().getFullYear());
