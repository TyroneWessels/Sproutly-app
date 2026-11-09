const plants = [
  {
    name: "Monstera", aliases: ["gatenplant"], scientific: "Monstera deliciosa", category: "Binnenplant", filter: "indoor",
    art: "art-monstera",
    description: "Een gulle, makkelijke kamerplant die houdt van helder indirect licht en ruimte om te groeien.",
    facts: ["Helder indirect licht", "Water als de aarde droog is", "Elke 1–2 jaar verpotten"],
    nextCare: "Controleer over 2 dagen of de bovenste aarde droog is.",
    status: "Vandaag water geven", statusClass: "status-today",
    lightLevel: "medium", difficulty: "easy", type: "Kamerplant",
    soil: "Luchtige potgrond met goede drainage", humidity: "Gemiddeld", temperature: "18–27 °C",
    size: "Tot 2 meter", petSafe: "Niet huisdiervriendelijk", planting: "Niet van toepassing",
    pruning: "Verwijder gele bladeren", fertilizing: "Elke 4 weken in lente en zomer",
    harvest: "Groeit het hele jaar door", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Basilicum", aliases: ["basil"], scientific: "Ocimum basilicum", category: "Kruid", filter: "indoor",
    art: "art-herb",
    description: "Een zonliefhebber voor in de keuken. Oogst de blaadjes regelmatig voor nieuwe, volle groei.",
    facts: ["Minimaal 6 uur zon", "Houd de aarde licht vochtig", "Knijp bloemen vroeg uit"],
    nextCare: "Knip de eerste bloemknoppen weg voor vollere groei.",
    status: "Ziet er goed uit", statusClass: "status-good",
    lightLevel: "high", difficulty: "easy", type: "Kruid",
    soil: "Voedzame, vochtige potgrond", humidity: "Gemiddeld", temperature: "18–30 °C",
    size: "30–60 cm", petSafe: "Huisdiervriendelijk", planting: "Vanaf april binnen voorzaaien",
    pruning: "Knijp regelmatig de toppen", fertilizing: "Elke 2 weken in het groeiseizoen",
    harvest: "Oogsten zodra de plant groot genoeg is", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Lavendel", aliases: ["lavender"], scientific: "Lavandula angustifolia", category: "Buitenplant", filter: "outdoor",
    art: "art-lavender",
    description: "Een geurende, sterke favoriet die het goed doet in de zon en in luchtige, goed drainerende aarde.",
    facts: ["Volle zon", "Laat de aarde opdrogen", "Snoei na de bloei"],
    nextCare: "Geef pas water wanneer de potgrond droog aanvoelt.",
    status: "Binnenkort verpotten", statusClass: "status-soon",
    lightLevel: "high", difficulty: "easy", type: "Buitenplant",
    soil: "Luchtige, kalkrijke grond", humidity: "Laag", temperature: "10–28 °C",
    size: "40–80 cm", petSafe: "Huisdiervriendelijk", planting: "Plant in het voorjaar",
    pruning: "Snoei na de bloei", fertilizing: "Eenmaal in het voorjaar",
    harvest: "Bloeit van juni tot augustus", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Sansevieria", aliases: ["vrouwentong", "snake plant"], scientific: "Dracaena trifasciata", category: "Binnenplant", filter: "indoor",
    art: "art-snake",
    description: "Een rustige en vergevingsgezinde plant met sterke bladeren. Het liefst laat je haar grotendeels met rust.",
    facts: ["Weinig tot helder licht", "Geef spaarzaam water", "Goed drainerende aarde"],
    nextCare: "Geef deze plant pas water als de aarde volledig droog is.",
    status: "Ziet er goed uit", statusClass: "status-good",
    lightLevel: "low", difficulty: "easy", type: "Kamerplant",
    soil: "Cactusgrond met extra drainage", humidity: "Laag", temperature: "15–30 °C",
    size: "Tot 1,2 meter", petSafe: "Niet huisdiervriendelijk", planting: "Niet van toepassing",
    pruning: "Niet nodig; verwijder beschadigde bladeren", fertilizing: "Elke 2 maanden in lente en zomer",
    harvest: "Geen oogst", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Aloë vera", aliases: ["aloe", "aloe vera"], scientific: "Aloe barbadensis miller", category: "Binnenplant", filter: "indoor",
    art: "art-aloe",
    description: "Een sterke vetplant met kalme, puntige bladeren. Geef liever te weinig dan te veel water.",
    facts: ["Veel indirect licht", "Laat de aarde volledig drogen", "Elke 2–3 jaar verpotten"],
    nextCare: "Controleer of de potgrond volledig droog is voordat je water geeft.",
    status: "Ziet er goed uit", statusClass: "status-good",
    lightLevel: "medium", difficulty: "easy", type: "Vetplant",
    soil: "Cactusgrond met veel drainage", humidity: "Laag", temperature: "15–30 °C",
    size: "30–60 cm", petSafe: "Niet huisdiervriendelijk", planting: "Niet van toepassing",
    pruning: "Verwijder droge buitenbladeren", fertilizing: "Eenmaal per maand in lente en zomer",
    harvest: "Geen oogst", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Tomaat", aliases: ["tomatenplant", "tomato"], scientific: "Solanum lycopersicum", category: "Buitenplant", filter: "outdoor",
    art: "art-tomato",
    description: "Een zonnige groeier die je beloont met smaakvolle vruchten wanneer hij genoeg warmte en steun krijgt.",
    facts: ["Volle zon", "Houd de aarde gelijkmatig vochtig", "Steun de stengels"],
    nextCare: "Bind nieuwe groei voorzichtig aan een stok of rek.",
    status: "Binnenkort verpotten", statusClass: "status-soon",
    lightLevel: "high", difficulty: "medium", type: "Groente",
    soil: "Voedzame moestuingrond", humidity: "Gemiddeld", temperature: "18–30 °C",
    size: "Tot 2 meter", petSafe: "Niet huisdiervriendelijk", planting: "Vanaf april binnen voorzaaien",
    pruning: "Verwijder dieven bij stamtomaten", fertilizing: "Elke week tijdens vruchtvorming",
    harvest: "Oogsten wanneer de vruchten rood kleuren", sourceUrl: "RHS / moestuingidsen", lastVerified: "5 november 2026"
  },
  {
    name: "Rozemarijn", aliases: ["rosemary"], scientific: "Salvia rosmarinus", category: "Buitenplant", filter: "outdoor",
    art: "art-rosemary",
    description: "Een geurige, mediterrane kruidenplant die houdt van zon, warmte en droge voeten.",
    facts: ["Volle zon", "Laat de aarde opdrogen", "Goed drainerende pot"],
    nextCare: "Knip een paar toppen voor een vollere vorm.",
    status: "Ziet er goed uit", statusClass: "status-good",
    lightLevel: "high", difficulty: "easy", type: "Kruid",
    soil: "Luchtige, zandige grond", humidity: "Laag", temperature: "10–28 °C",
    size: "60–120 cm", petSafe: "Huisdiervriendelijk", planting: "Plant na de laatste nachtvorst",
    pruning: "Licht snoeien na de bloei", fertilizing: "Eenmaal in het voorjaar",
    harvest: "Hele jaar takjes oogsten", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  },
  {
    name: "Pannenkoekenplant", aliases: ["pilea", "pilea peperomioides"], scientific: "Pilea peperomioides", category: "Binnenplant", filter: "indoor",
    art: "art-pilea",
    description: "Een vrolijke kamerplant met ronde bladeren die graag helder staat en nieuwe stekjes maakt.",
    facts: ["Helder indirect licht", "Water als de bovenlaag droog is", "Draai regelmatig"],
    nextCare: "Draai de pot een kwartslag zodat de plant gelijkmatig groeit.",
    status: "Ziet er goed uit", statusClass: "status-good",
    lightLevel: "medium", difficulty: "easy", type: "Kamerplant",
    soil: "Universele potgrond met drainage", humidity: "Gemiddeld", temperature: "15–25 °C",
    size: "20–40 cm", petSafe: "Huisdiervriendelijk", planting: "Niet van toepassing",
    pruning: "Verwijder gele bladeren", fertilizing: "Eenmaal per maand in lente en zomer",
    harvest: "Nieuwe stekjes in lente en zomer", sourceUrl: "RHS / lokale kwekers", lastVerified: "5 november 2026"
  }
];

const sourceDetails = {
  "RHS / lokale kwekers": { label: "Royal Horticultural Society", url: "https://www.rhs.org.uk/" },
  "RHS / moestuingidsen": { label: "Royal Horticultural Society moestuingidsen", url: "https://www.rhs.org.uk/vegetables" }
};
plants.forEach((plant, index) => {
  const source = sourceDetails[plant.sourceUrl];
  const catalogPlant = window.SPROUTLY_PLANTS.find((item) => item.scientific === plant.scientific);
  plant.id = `plant-${index + 1}`;
  plant.imageUrl = catalogPlant.image;
  plant.imageSource = catalogPlant.imageSource;
  plant.scientificName = plant.scientific;
  plant.light = plant.facts[0];
  plant.watering = plant.facts[1];
  plant.repotting = plant.facts[2];
  plant.sourceLabel = source.label;
  plant.sourceUrl = source.url;
  plant.imageLicenseUrl = catalogPlant.imageSource;
});

const plantGrid = document.querySelector("#plant-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#plant-search");
const modal = document.querySelector("#plant-modal");
const toast = document.querySelector("#toast");
const searchForm = document.querySelector("#search-form");
const apiStatus = document.querySelector("#api-status");
const collectionList = document.querySelector("#collection-list");
const collectionCount = document.querySelector("#collection-count");
const lightFilter = document.querySelector("#light-filter");
const difficultyFilter = document.querySelector("#difficulty-filter");
const sortFilter = document.querySelector("#sort-filter");
const locationButton = document.querySelector("#location-button");
const locationStatus = document.querySelector("#location-status");
const calendarGrid = document.querySelector("#calendar-grid");
const calendarMonthLabel = document.querySelector("#calendar-month");
const selectedDateLabel = document.querySelector("#selected-date");
const selectedDayEvents = document.querySelector("#selected-day-events");
const previousMonthButton = document.querySelector("#previous-month");
const nextMonthButton = document.querySelector("#next-month");
const profileForm = document.querySelector("#plant-profile-form");
const profileName = document.querySelector("#profile-name");
const profileLocation = document.querySelector("#profile-location");
const profileDate = document.querySelector("#profile-date");
const profilePhoto = document.querySelector("#profile-photo");
const profileNotes = document.querySelector("#profile-notes");
const profileFavorite = document.querySelector("#profile-favorite");
const seasonTasks = document.querySelector("#season-tasks");
const profileButton = document.querySelector("#profile-button");
const accountNameLabel = document.querySelector(".profile-name");
const accountAvatar = document.querySelector(".avatar");
const authModal = document.querySelector("#auth-modal");
const authClose = document.querySelector("#auth-close");
const authForm = document.querySelector("#auth-form");
const authTitle = document.querySelector("#auth-title");
const authIntro = document.querySelector(".auth-intro");
const authTabs = document.querySelector(".auth-tabs");
const authAccountSummary = document.querySelector("#auth-account-summary");
const authAccountName = document.querySelector("#auth-account-name");
const authAccountEmail = document.querySelector("#auth-account-email");
const authStatus = document.querySelector("#auth-status");
const authSubmit = document.querySelector("#auth-submit");
const authDisplayNameField = document.querySelector("#display-name-field");
const authDisplayName = document.querySelector("#auth-display-name");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const logoutButton = document.querySelector("#logout-button");
const navCount = document.querySelector("#nav-count");
const accountDataActions = document.querySelector("#account-data-actions");
const exportDataButton = document.querySelector("#export-data-button");
const deleteAccountButton = document.querySelector("#delete-account-button");
const clearLocalDataButton = document.querySelector("#clear-local-data-button");
const notificationButton = document.querySelector(".notification-button");
const collectionMoreButton = document.querySelector(".more-button");
let activeFilter = "all";
let gbifRequestNumber = 0;
let activeHemisphere = "north";
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCalendarDate = new Date();
const storedPlants = localStorage.getItem("sproutly-plants");
let savedPlants = new Set(storedPlants ? JSON.parse(storedPlants) : window.SPROUTLY_DEFAULT_SAVED_PLANTS);
if (!storedPlants) localStorage.setItem("sproutly-plants", JSON.stringify([...savedPlants]));
let completedTasks = new Set(JSON.parse(localStorage.getItem("sproutly-tasks") || "[]"));
let plantProfiles = JSON.parse(localStorage.getItem("sproutly-profiles") || "{}");
let careOverrides = JSON.parse(localStorage.getItem("sproutly-care-overrides") || "{}");
let activePlantName = "";
let currentUser = null;
let backendAvailable = false;
let stateSyncTimer = null;
let stateSyncPromise = Promise.resolve(true);
let authMode = "login";
let accountStatus = "loading";
const gbifCache = new Map();

async function apiRequest(path, options = {}) {
  const account = window.SproutlyAccount;
  if (path === "/api/health") return { ok: true };
  if (path === "/api/auth/me") return { user: await account.getUser() };
  if (path === "/api/auth/logout") return account.logout();
  if (path === "/api/me") return account.deleteAccount();
  if (path === "/api/me/state") {
    return options.method === "PUT" ? account.saveState(JSON.parse(options.body)) : account.getState();
  }
  const body = JSON.parse(options.body);
  if (path === "/api/auth/register") {
    return { user: await account.register(body.email, body.password, body.displayName, getClientState()) };
  }
  if (path === "/api/auth/login") return { user: await account.login(body.email, body.password, getClientState()) };
  throw new Error("Onbekende accountactie.");
}

function getClientState() {
  return {
    savedPlants: [...savedPlants],
    plantProfiles,
    completedTasks: [...completedTasks],
    careOverrides
  };
}

function applyServerState(state) {
  savedPlants = new Set(Array.isArray(state.savedPlants) ? state.savedPlants : []);
  completedTasks = new Set(Array.isArray(state.completedTasks) ? state.completedTasks : []);
  plantProfiles = state.plantProfiles && typeof state.plantProfiles === "object" ? state.plantProfiles : {};
  careOverrides = state.careOverrides && typeof state.careOverrides === "object" ? state.careOverrides : {};
}

function renderAll() {
  renderPlants(searchInput.value);
  renderCollection();
  renderCarePlan();
  renderSeasonalGuidance();
  renderCalendar();
}

async function syncStateToServer() {
  if (!currentUser) return true;
  try {
    await apiRequest("/api/me/state", {
      method: "PUT",
      body: JSON.stringify(getClientState())
    });
    return true;
  } catch (error) {
    console.error("Sproutly-data kon niet worden gesynchroniseerd:", error);
    showToast(error.message || "Je wijzigingen konden niet naar de server worden opgeslagen");
    return false;
  }
}

    exportDataButton.addEventListener("click", async () => {
      if (!currentUser) return;
      try {
        const accountState = await window.SproutlyAccount.getState();
        const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), user: currentUser, state: accountState }, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sproutly-export.json";
        link.click();
        URL.revokeObjectURL(link.href);
        showToast("Je gegevens zijn geëxporteerd");
      } catch (error) {
        authStatus.textContent = error.message;
      }
    });

    deleteAccountButton.addEventListener("click", async () => {
      if (!currentUser || !window.confirm("Weet je zeker dat je account en alle servergegevens wilt verwijderen?")) return;
      try {
        await apiRequest("/api/me", { method: "DELETE" });
        currentUser = null;
        restoreLocalState();
        updateAccountUi();
        renderAll();
        closeAuthModal();
        showToast("Je account en gegevens zijn verwijderd");
      } catch (error) {
        authStatus.textContent = error.message;
      }
    });

    clearLocalDataButton.addEventListener("click", () => {
      if (!window.confirm("Lokale planten en verzorgingsgegevens op deze browser wissen?")) return;
      clearStoredLocalState();
      if (!currentUser) {
        savedPlants = new Set();
        completedTasks = new Set();
        plantProfiles = {};
        careOverrides = {};
        renderAll();
      }
      showToast("Lokale browsergegevens zijn gewist");
    });

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
notificationButton.addEventListener("click", () => document.querySelector("#reminder-button").click());
collectionMoreButton.addEventListener("click", () => {
  document.querySelector("#my-plants").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Je collectie staat hieronder");
});

function updateAccountUi() {
  if (currentUser) {
    const initials = currentUser.displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    accountAvatar.textContent = initials || "SP";
    accountNameLabel.textContent = currentUser.displayName;
    profileButton.setAttribute("aria-label", `Account van ${currentUser.displayName}`);
    accountDataActions.hidden = false;
    return;
  }
  accountAvatar.textContent = "SP";
  accountNameLabel.textContent = "Inloggen";
  profileButton.setAttribute("aria-label", "Inloggen of account maken");
  accountDataActions.hidden = true;
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => tab.classList.toggle("active", tab.dataset.authMode === mode));
  const registering = mode === "register";
  const signedIn = Boolean(currentUser);
  authTitle.textContent = signedIn ? "Jouw groene account." : registering ? "Bewaar je planten overal." : "Welkom terug bij Sproutly.";
  authIntro.hidden = signedIn;
  authTabs.hidden = signedIn;
  authAccountSummary.hidden = !signedIn;
  authAccountName.textContent = signedIn ? currentUser.displayName : "";
  authAccountEmail.textContent = signedIn ? currentUser.email : "";
  authSubmit.textContent = registering ? "Account maken" : "Inloggen";
  authDisplayNameField.hidden = !registering;
  authDisplayName.required = registering;
  authPassword.autocomplete = registering ? "new-password" : "current-password";
  logoutButton.hidden = !signedIn;
  authForm.hidden = signedIn;
  authStatus.textContent = "";
}

function openAuthModal() {
  setAuthMode(currentUser ? "login" : authMode);
  if (!backendAvailable && !currentUser) {
    authStatus.textContent = "De accountverbinding is niet beschikbaar. Controleer je internetverbinding.";
  }
  authModal.hidden = false;
  (currentUser ? logoutButton : authEmail).focus();
}

function closeAuthModal() {
  authModal.hidden = true;
  authForm.reset();
  authStatus.textContent = "";
}

async function initializeSession() {
  try {
    await apiRequest("/api/health");
    backendAvailable = true;
  } catch (error) {
    backendAvailable = false;
    updateAccountUi();
    return;
  }
  try {
    const session = await apiRequest("/api/auth/me");
    currentUser = session.user;
    if (currentUser) {
      const state = await apiRequest("/api/me/state");
      applyServerState(state);
    }
    updateAccountUi();
    if (currentUser) renderAll();
    accountStatus = "ready";
  } catch (error) {
    if (error.status !== 401) console.error("Accountstatus kon niet worden geladen:", error);
    accountStatus = "failed";
    showToast("Accountgegevens laden mislukt. Vernieuw de pagina voordat je wijzigingen maakt.");
    updateAccountUi();
  }
}

const seasonalGuidance = {
  winter: {
    name: "winter",
    tasks: [
      ["☁", "Geef minder water", "Planten groeien rustiger. Controleer eerst of de aarde droog is.", "water"],
      ["☀", "Maak licht vrij", "Zet planten dichter bij een helder raam voor de korte dagen.", "licht"],
      ["♧", "Houd warmte in de gaten", "Zet planten niet naast een radiator of op de tocht.", "warmte"]
    ]
  },
  spring: {
    name: "lente",
    tasks: [
      ["☀", "Zoek meer licht", "Zet planten die van zon houden dichter bij een helder raam.", "licht"],
      ["♧", "Begin met zaaien", "Een mooi moment om kruiden en zomerbloemen te starten.", "zaaien"],
      ["♢", "Ververs de aarde", "Geef vermoeide potten een boost voor het groeiseizoen.", "aarde"]
    ]
  },
  summer: {
    name: "zomer",
    tasks: [
      ["☀", "Controleer de aarde", "Warmte laat potgrond sneller uitdrogen. Voel regelmatig met je vinger.", "water"],
      ["♧", "Geef in de ochtend water", "Zo kunnen planten rustig drinken voordat de dag warm wordt.", "water-ochtend"],
      ["✦", "Draai je potten", "Geef alle kanten van je planten af en toe wat zon.", "draaien"]
    ]
  },
  autumn: {
    name: "herfst",
    tasks: [
      ["☁", "Geef minder water", "Pas de watergift aan nu de dagen korter en koeler worden.", "water"],
      ["♢", "Haal dorre bladeren weg", "Een kleine opruimbeurt helpt je planten gezond de winter in.", "bladeren"],
      ["☀", "Kies een lichte plek", "Verplaats planten naar hun helderste plek in huis.", "licht"]
    ]
  }
};

function getCurrentSeason(date = new Date(), hemisphere = "north") {
  const month = date.getMonth() + 1;
  let season;
  if (month <= 2 || month === 12) season = "winter";
  else if (month <= 5) season = "spring";
  else if (month <= 8) season = "summer";
  else season = "autumn";
  if (hemisphere === "south") {
    return { winter: "summer", spring: "autumn", summer: "winter", autumn: "spring" }[season];
  }
  return season;
}

function renderSeasonalGuidance() {
  const season = seasonalGuidance[getCurrentSeason(new Date(), activeHemisphere)];
  document.querySelector("#season-name").textContent = season.name;
  seasonTasks.innerHTML = season.tasks.map(([icon, title, description, taskId], index) => `
    <article class="task-card task-card-${["green", "yellow", "peach"][index]}">
      <div class="task-icon">${icon}</div>
      <div><h3>${title}</h3><p>${description}</p></div>
      <button class="task-check ${completedTasks.has(`season-${taskId}`) ? "complete" : ""}" data-task="season-${taskId}" aria-label="Markeer ${title.toLowerCase()} als gedaan">${completedTasks.has(`season-${taskId}`) ? "✓" : "○"}</button>
    </article>
  `).join("");
  seasonTasks.querySelectorAll("[data-task]").forEach((taskButton) => {
    taskButton.addEventListener("click", () => {
      const taskId = taskButton.dataset.task;
      if (completedTasks.has(taskId)) {
        completedTasks.delete(taskId);
        taskButton.classList.remove("complete");
        taskButton.textContent = "○";
      } else {
        completedTasks.add(taskId);
        taskButton.classList.add("complete");
        taskButton.textContent = "✓";
      }
      saveState();
      showToast(completedTasks.has(taskId) ? "Seizoentaak afgerond" : "Taak weer geopend");
    });
  });
}

function updateLocationStatus(message, state = "") {
  locationStatus.textContent = message;
  locationStatus.className = state;
}

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    updateLocationStatus("Locatie wordt niet ondersteund door deze browser.", "location-error");
    return;
  }
  locationButton.disabled = true;
  locationButton.textContent = "Locatie ophalen…";
  updateLocationStatus("Je browser vraagt toestemming voor je locatie.", "location-loading");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      activeHemisphere = position.coords.latitude < 0 ? "south" : "north";
      const hemisphereLabel = activeHemisphere === "south" ? "zuidelijk" : "noordelijk";
      updateLocationStatus(`Seizoensadvies aangepast voor het ${hemisphereLabel} halfrond.`, "location-success");
      locationButton.disabled = false;
      locationButton.textContent = "Locatie bijgewerkt";
      renderSeasonalGuidance();
      showToast("Je seizoensadvies is aangepast");
    },
    (error) => {
      console.error("Locatie ophalen mislukt:", error);
      updateLocationStatus("Locatie niet gebruikt. Het standaardadvies blijft actief.", "location-error");
      locationButton.disabled = false;
      locationButton.textContent = "Opnieuw proberen";
    },
    { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
  );
});

calendarGrid.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-calendar-date]");
  if (!dayButton) return;
  const [year, month, day] = dayButton.dataset.calendarDate.split("-").map(Number);
  selectedCalendarDate = new Date(year, month - 1, day);
  renderCalendar();
});

selectedDayEvents.addEventListener("click", async (event) => {
  const snoozeButton = event.target.closest("[data-snooze-task]");
  if (snoozeButton) {
    const taskId = snoozeButton.dataset.snoozeTask;
    const currentEvent = getCalendarEvents().find((calendarEvent) => calendarEvent.taskId === taskId);
    if (!currentEvent) return;
    const nextDate = addDays(parseDateKey(currentEvent.date), Number(snoozeButton.dataset.snoozeDays));
    careOverrides[taskId] = getDateKey(nextDate);
    saveState();
    renderCalendar();
    showToast(`Taak uitgesteld naar ${nextDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}`);
    return;
  }
  const taskButton = event.target.closest("[data-calendar-task]");
  if (!taskButton) return;
  await recordCareEvent(taskButton.dataset.calendarTask);
});

previousMonthButton.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderCalendar();
});

function renderPlants(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePlants = plants.filter((plant) => {
    const matchesFilter = activeFilter === "all" || plant.filter === activeFilter;
    const searchableText = `${plant.name} ${plant.aliases.join(" ")} ${plant.scientific} ${plant.category} ${plant.type}`.toLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesLight = lightFilter.value === "all" || plant.lightLevel === lightFilter.value;
    const matchesDifficulty = difficultyFilter.value === "all" || plant.difficulty === difficultyFilter.value;
    return matchesFilter && matchesQuery && matchesLight && matchesDifficulty;
  });

  const sortedPlants = [...visiblePlants].sort((first, second) => {
    if (sortFilter.value === "name") return first.name.localeCompare(second.name, "nl");
    if (sortFilter.value === "difficulty") return first.difficulty.localeCompare(second.difficulty, "nl");
    return 0;
  });
  plantGrid.innerHTML = sortedPlants.map((plant) => `
    <article class="plant-card">
      <button class="save-plant" data-save="${plant.name}" aria-label="Voeg een ${plant.name} toe aan Mijn planten">+</button>
      <a class="plant-art ${plant.art}" href="plant/?naam=${encodeURIComponent(plant.name)}" aria-label="Bekijk details van ${plant.name}">
        <img class="plant-photo" src="${plant.imageUrl}" alt="${plant.name}" loading="lazy" decoding="async" />
      </a>
      <span class="plant-tag">${plant.category}</span>
      <h3><a href="plant/?naam=${encodeURIComponent(plant.name)}">${plant.name}</a></h3>
      <p class="scientific-name">${plant.scientific}</p>
      <div class="plant-card-links"><a class="image-credit" href="${plant.imageSource}" target="_blank" rel="noreferrer">Fotobron en licentie</a></div>
    </article>
  `).join("");
  emptyState.hidden = visiblePlants.length > 0;
  plantGrid.querySelectorAll(".plant-photo").forEach((image) => image.addEventListener("error", handleImageError, { once: true }));
}

function setApiStatus(message, state = "info") {
  apiStatus.textContent = message;
  apiStatus.className = `api-status ${state}`;
  apiStatus.hidden = false;
  searchForm.setAttribute("aria-busy", state === "loading" ? "true" : "false");
}

async function checkGbifName(query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    apiStatus.hidden = true;
    searchForm.removeAttribute("aria-busy");
    return;
  }
  const requestNumber = ++gbifRequestNumber;
  const cachedResult = gbifCache.get(normalizedQuery.toLowerCase());
  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    setApiStatus(cachedResult.message, cachedResult.state);
    return;
  }
  setApiStatus("Plantnaam controleren via GBIF…", "loading");
  const url = `https://api.gbif.org/v1/species/search?query=${encodeURIComponent(normalizedQuery)}&highertaxon_key=6&limit=5`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GBIF gaf HTTP ${response.status}`);
    const payload = await response.json();
    if (requestNumber !== gbifRequestNumber) return;
    const plantResults = (payload.results || []).filter((result) => !result.kingdom || result.kingdom === "Plantae");
    if (plantResults.length) {
      const message = `GBIF heeft ${plantResults.length} taxonomische match${plantResults.length === 1 ? "" : "es"} gevonden. De verzorging komt uit Sproutly.`;
      gbifCache.set(normalizedQuery.toLowerCase(), { message, state: "success", expiresAt: Date.now() + 10 * 60 * 1000 });
      setApiStatus(message, "success");
    } else {
      const message = "Geen aanvullende GBIF-match gevonden. De lokale resultaten blijven beschikbaar.";
      gbifCache.set(normalizedQuery.toLowerCase(), { message, state: "info", expiresAt: Date.now() + 10 * 60 * 1000 });
      setApiStatus(message, "info");
    }
  } catch (error) {
    if (requestNumber !== gbifRequestNumber) return;
    console.error("GBIF-plantnaamcontrole mislukt:", error);
    setApiStatus("GBIF is tijdelijk niet beschikbaar. De lokale plantinformatie blijft beschikbaar.", "error");
  }
}

function handleImageError(event) {
  window.handlePlantImageError(event);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function saveState() {
  if (currentUser) {
    window.clearTimeout(stateSyncTimer);
    stateSyncTimer = window.setTimeout(() => {
      stateSyncTimer = null;
      stateSyncPromise = stateSyncPromise.then((ok) => ok ? syncStateToServer() : false);
    }, 150);
    return true;
  }
  try {
    window.SproutlyPlants.writeLocal({
      "sproutly-plants": [...savedPlants],
      "sproutly-tasks": [...completedTasks],
      "sproutly-profiles": plantProfiles,
      "sproutly-care-overrides": careOverrides
    });
    return true;
  } catch (error) {
    console.error("Browsergegevens opslaan mislukt:", error);
    showToast("Opslaan is mislukt. Controleer de beschikbare opslagruimte.");
    return false;
  }
}

function clearStoredLocalState() {
  ["sproutly-plants", "sproutly-tasks", "sproutly-profiles", "sproutly-care-overrides"].forEach((key) => localStorage.removeItem(key));
}

function restoreLocalState() {
  const stored = localStorage.getItem("sproutly-plants");
  savedPlants = new Set(stored ? JSON.parse(stored) : window.SPROUTLY_DEFAULT_SAVED_PLANTS);
  completedTasks = new Set(JSON.parse(localStorage.getItem("sproutly-tasks") || "[]"));
  plantProfiles = JSON.parse(localStorage.getItem("sproutly-profiles") || "{}");
  careOverrides = JSON.parse(localStorage.getItem("sproutly-care-overrides") || "{}");
}

function renderCollection() {
  const saved = [...savedPlants].map((id) => {
    const name = window.SproutlyPlants.species(id, plantProfiles);
    const plant = window.SPROUTLY_PLANTS.find((item) => item.name === name);
    return plant ? { ...plant, ...plants.find((item) => item.name === name), imageUrl: plant.image, instanceId: id, displayName: window.SproutlyPlants.label(id, savedPlants, plantProfiles) } : null;
  }).filter(Boolean);
  collectionCount.textContent = `${saved.length} ${saved.length === 1 ? "groene vriend" : "groene vrienden"}`;
  navCount.textContent = String(savedPlants.size);
  if (!saved.length) {
    collectionList.innerHTML = `<div class="collection-empty"><p>Je collectie is nog leeg. Voeg je eerste plant toe.</p><button class="primary-button" data-empty-action>Plant zoeken</button></div>`;
    collectionList.querySelector("[data-empty-action]").addEventListener("click", () => {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return;
  }
  collectionList.innerHTML = saved.map((plant) => `
    <a class="collection-item" href="${window.SproutlyPlants.url(plant.name, plant.instanceId)}" aria-label="Bekijk ${escapeHtml(plant.displayName)}">
      <img class="mini-plant" src="${escapeHtml(plantProfiles[plant.instanceId]?.photo || plant.imageUrl)}" alt="" loading="lazy" decoding="async" />
      <span><strong>${escapeHtml(plant.displayName)}</strong><small>${escapeHtml(plantProfiles[plant.instanceId]?.location || plant.scientific)}</small></span>
      <span class="status-pill ${plant.statusClass || "status-good"}">${plant.status || "Bekijk je plant"}</span>
    </a>
  `).join("");
  collectionList.querySelectorAll(".mini-plant").forEach((image) => image.addEventListener("error", handleImageError, { once: true }));
}

function renderCarePlan() {
  const today = new Date();
  const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const shortDayNames = ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"];
  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  document.querySelector("#today-label").textContent = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}`;
  const todayKey = getDateKey(today);
  const events = getCalendarEvents();
  const todayTasks = events.filter((event) => event.date === todayKey);
  document.querySelector("#today-task-count").textContent = `${todayTasks.length} ${todayTasks.length === 1 ? "taak" : "taken"}`;
  document.querySelector("#today-tasks").innerHTML = todayTasks.length ? todayTasks.map((plant) => {
    return `<button class="care-task ${plant.done ? "complete" : ""}" data-care-task="${plant.taskId}">
      <span class="care-task-check">${plant.done ? "✓" : "○"}</span>
      <span><strong>${escapeHtml(plant.plantName)}</strong><small>${escapeHtml(plant.title)}</small></span>
    </button>`;
  }).join("") : `<p class="care-empty">Geen dringende taken. Je planten doen het goed.</p>`;
  const monday = addDays(today, (today.getDay() + 6) % 7);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  const weekDateKeys = new Set(weekDates.map(getDateKey));
  const weekEvents = events.filter((event) => weekDateKeys.has(event.date));
  document.querySelector("#week-task-count").textContent = `${weekEvents.length} ${weekEvents.length === 1 ? "moment" : "momenten"}`;
  const weekDays = document.querySelector("#week-days");
  weekDays.innerHTML = weekDates.map((date) => {
    const dateKey = getDateKey(date);
    const dayEvents = weekEvents.filter((event) => event.date === dateKey);
    const isToday = dateKey === todayKey;
    const label = `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`;
    const eventLabel = dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? "verzorgingsmoment" : "verzorgingsmomenten"}` : ", geen verzorgingsmomenten";
    return `<button class="week-day ${isToday ? "active" : ""} ${dayEvents.length ? "has-events" : ""}" type="button" data-week-date="${dateKey}" aria-label="${label}${eventLabel}" ${isToday ? 'aria-current="date"' : ""}><small>${shortDayNames[date.getDay()]}</small><span class="week-dot" aria-hidden="true"></span></button>`;
  }).join("");
  weekDays.querySelectorAll("[data-week-date]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCalendarDate = parseDateKey(button.dataset.weekDate);
      calendarMonth = new Date(selectedCalendarDate.getFullYear(), selectedCalendarDate.getMonth(), 1);
      renderCalendar();
      document.querySelector("#calendar-view").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function getCalendarEvents() {
  return window.SproutlyCare.events(savedPlants, plantProfiles, careOverrides);
}

async function recordCareEvent(taskId) {
  if (accountStatus !== "ready") return;
  accountStatus = "saving";
  try {
    if (currentUser) {
      const pending = Boolean(stateSyncTimer);
      if (pending) {
        window.clearTimeout(stateSyncTimer);
        stateSyncTimer = null;
      }
      if (!await stateSyncPromise || (pending && !await syncStateToServer())) {
        showToast("Eerdere wijzigingen zijn niet opgeslagen. Vernieuw de pagina.");
        return;
      }
    }
    const event = getCalendarEvents().find((item) => item.taskId === taskId);
    if (!event) {
      showToast("Dit verzorgingsmoment is gewijzigd. Vernieuw de pagina.");
      return;
    }
    if (!window.confirm(`Heb je vandaag bij ${event.plantName} de actie "${event.action}" uitgevoerd? Dit wordt in het logboek opgeslagen.`)) return;
    const previousProfiles = structuredClone(plantProfiles);
    try {
      window.SproutlyCare.record(plantProfiles, event);
      if (currentUser) {
        if (!await syncStateToServer()) {
          plantProfiles = previousProfiles;
          return;
        }
      } else if (!saveState()) {
        plantProfiles = previousProfiles;
        return;
      }
      renderCarePlan();
      renderCalendar();
      showToast(`${event.action} is voor vandaag in het logboek gezet.`);
    } catch (error) {
      plantProfiles = previousProfiles;
      console.error("Verzorgingsmoment registreren mislukt:", error);
      showToast(error.message || "Het verzorgingsmoment kon niet worden opgeslagen.");
    }
  } finally {
    accountStatus = "ready";
  }
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function renderSelectedCalendarDay(events) {
  const selectedKey = getDateKey(selectedCalendarDate);
  const selectedEvents = events.filter((event) => event.date === selectedKey);
  selectedDateLabel.textContent = selectedCalendarDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  selectedDayEvents.innerHTML = selectedEvents.length ? selectedEvents.map((event) => `
    <button class="calendar-event ${event.done ? "complete" : ""}" data-calendar-task="${event.taskId}">
      <span class="calendar-event-check">${event.done ? "✓" : "○"}</span>
      <span><strong>${escapeHtml(event.plantName)}</strong><small>${escapeHtml(event.title)}${event.overdue ? ` · gepland op ${escapeHtml(event.dueDate)}` : event.unplanned ? " · nog niet geregistreerd" : ""}</small></span>
    </button>
    <div class="calendar-event-actions">
      <button type="button" data-snooze-task="${event.taskId}" data-snooze-days="1">+1 dag</button>
      <button type="button" data-snooze-task="${event.taskId}" data-snooze-days="7">+1 week</button>
    </div>
  `).join("") : `<p class="care-empty">Geen verzorging gepland voor deze dag.</p>`;
}

function renderCalendar() {
  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getDateKey(new Date());
  const events = getCalendarEvents();
  calendarMonthLabel.textContent = `${monthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";
  for (let index = 0; index < firstDay; index += 1) {
    calendarGrid.insertAdjacentHTML("beforeend", '<span class="calendar-day empty" aria-hidden="true"></span>');
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    const dayEvents = events.filter((event) => event.date === dateKey);
    const classes = ["calendar-day"];
    if (dateKey === todayKey) classes.push("today");
    if (dateKey === getDateKey(selectedCalendarDate)) classes.push("selected");
    calendarGrid.insertAdjacentHTML("beforeend", `
      <button class="${classes.join(" ")}" data-calendar-date="${dateKey}" aria-label="${date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}">
        <span>${day}</span>
        ${dayEvents.length ? `<i class="${dayEvents.every((event) => event.done) ? "done" : ""}">${dayEvents.length}</i>` : ""}
      </button>
    `);
  }
  renderSelectedCalendarDay(events);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function openPlant(plant) {
  const matches = [...savedPlants].filter((id) => window.SproutlyPlants.species(id, plantProfiles) === plant.name);
  activePlantName = matches.length === 1 ? matches[0] : "";
  const profile = plantProfiles[activePlantName] || {};
  document.querySelector("#modal-category").textContent = plant.category;
  document.querySelector("#modal-title").textContent = plant.name;
  document.querySelector("#modal-scientific").textContent = plant.scientific;
  document.querySelector("#modal-description").textContent = plant.description;
  document.querySelector("#modal-facts").innerHTML = plant.facts.map((fact) => `<span class="care-fact">${fact}</span>`).join("");
  document.querySelector("#modal-info").innerHTML = [
    ["Licht", plant.facts[0]],
    ["Aarde", plant.soil],
    ["Luchtvochtigheid", plant.humidity],
    ["Temperatuur", plant.temperature],
    ["Grootte", plant.size],
    ["Huisdieren", plant.petSafe],
    ["Moeilijkheid", plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld"],
    ["Zaaien / planten", plant.planting],
    ["Snoeien", plant.pruning],
    ["Bemesten", plant.fertilizing],
    ["Oogst / bloei", plant.harvest]
  ].map(([label, value]) => `<div class="info-item"><small>${label}</small><strong>${value}</strong></div>`).join("");
  document.querySelector("#modal-source").innerHTML = `Bron: <a href="${plant.sourceUrl}" target="_blank" rel="noreferrer">${plant.sourceLabel}</a> · gecontroleerd op ${plant.lastVerified} · foto: <a href="${plant.imageLicenseUrl}" target="_blank" rel="noreferrer">bron en licentie op Wikimedia Commons</a>`;
  document.querySelector("#modal-next-care").textContent = plant.nextCare;
  profileName.value = profile.customName || "";
  profileLocation.value = profile.location || "";
  profileDate.value = profile.date || "";
  profileNotes.value = profile.notes || "";
  profileFavorite.checked = Boolean(profile.favorite);
  profilePhoto.value = "";
  profileForm.hidden = !activePlantName;
  document.querySelector("#modal-add").hidden = false;
  const illustration = document.querySelector("#modal-illustration");
  illustration.className = `modal-illustration ${plant.art}`;
  illustration.innerHTML = `<img class="plant-photo" src="${plant.imageUrl}" alt="${plant.name}" decoding="async" />`;
  illustration.querySelector(".plant-photo").addEventListener("error", handleImageError, { once: true });
  modal.hidden = false;
  document.querySelector("#modal-close").focus();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value;
  renderPlants(query);
  checkGbifName(query);
  document.querySelector("#popular-title").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-search]").forEach((button) => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.search;
    renderPlants(searchInput.value);
    checkGbifName(searchInput.value);
    document.querySelector("#popular-title").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-tab.active").classList.remove("active");
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderPlants(searchInput.value);
  });
});

[lightFilter, difficultyFilter, sortFilter].forEach((filter) => {
  filter.addEventListener("change", () => renderPlants(searchInput.value));
});

plantGrid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const name = saveButton.dataset.save;
    const id = window.SproutlyPlants.create(name, plantProfiles);
    savedPlants.add(id);
    if (!saveState()) {
      savedPlants.delete(id);
      delete plantProfiles[id];
      return;
    }
    showToast(`${name} is toegevoegd. Geef je plant een naam via Mijn planten.`);
    renderPlants(searchInput.value);
    renderCollection();
    renderCarePlan();
    renderCalendar();
    return;
  }
  const plantButton = event.target.closest("[data-plant]");
  if (plantButton) openPlant(plants.find((plant) => plant.name === plantButton.dataset.plant));
});

document.querySelector("#modal-close").addEventListener("click", () => { modal.hidden = true; });
modal.addEventListener("click", (event) => { if (event.target === modal) modal.hidden = true; });

document.querySelector("#modal-add").addEventListener("click", () => {
  const name = document.querySelector("#modal-title").textContent;
  activePlantName = window.SproutlyPlants.create(name, plantProfiles);
  savedPlants.add(activePlantName);
  saveState();
  renderPlants(searchInput.value);
  renderCollection();
  renderCarePlan();
  renderCalendar();
  profileForm.hidden = false;
  profileName.value = "";
  profileLocation.value = "";
  profileDate.value = "";
  profileNotes.value = "";
  profileFavorite.checked = false;
  profilePhoto.value = "";
  showToast(`${name} is toegevoegd — vul nu je eigen gegevens in`);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = {
    ...plantProfiles[activePlantName],
    customName: profileName.value.trim(),
    location: profileLocation.value.trim(),
    date: profileDate.value,
    notes: profileNotes.value.trim(),
    favorite: profileFavorite.checked,
    photo: plantProfiles[activePlantName]?.photo || ""
  };
  const selectedPhoto = profilePhoto.files[0];
  const finishSave = () => {
    plantProfiles[activePlantName] = profile;
    savedPlants.add(activePlantName);
    saveState();
    renderPlants(searchInput.value);
    renderCollection();
    renderCarePlan();
    renderCalendar();
    showToast("Je plantprofiel is opgeslagen");
  };
  if (!selectedPhoto) {
    finishSave();
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    profile.photo = reader.result;
    finishSave();
  }, { once: true });
  reader.readAsDataURL(selectedPhoto);
});

document.querySelector("#today-tasks").addEventListener("click", async (event) => {
  const task = event.target.closest("[data-care-task]");
  if (!task) return;
  await recordCareEvent(task.dataset.careTask);
});

document.querySelector("#add-plant-button").addEventListener("click", () => {
  searchInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Zoek een plant om deze aan je collectie toe te voegen");
});

document.querySelector("#reminder-button").addEventListener("click", async () => {
  if (typeof Notification === "undefined" || typeof Notification.requestPermission !== "function") {
    showToast("Meldingen worden niet ondersteund door deze browser");
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      showToast("Meldingen zijn niet ingeschakeld");
      return;
    }
    new Notification("Sproutly", {
      body: "Je seizoensherinnering staat klaar."
    });
    showToast("Je seizoensherinnering staat klaar");
  } catch (error) {
    console.error("Browsermelding kon niet worden ingesteld:", error);
    showToast("De herinnering kon niet worden ingesteld");
  }
});

profileButton.addEventListener("click", openAuthModal);
authClose.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});
document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (accountStatus !== "ready") {
    authStatus.textContent = "De accountgegevens zijn nog niet beschikbaar. Vernieuw de pagina en probeer opnieuw.";
    return;
  }
  authStatus.textContent = authMode === "register" ? "Account wordt gemaakt…" : "Je wordt ingelogd…";
  authSubmit.disabled = true;
  try {
    const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
    const body = {
      email: authEmail.value,
      password: authPassword.value
    };
    if (authMode === "register") body.displayName = authDisplayName.value;
    const result = await apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) });
    currentUser = result.user;
    backendAvailable = true;
    applyServerState(await apiRequest("/api/me/state"));
    updateAccountUi();
    setAuthMode("login");
    renderAll();
    authStatus.textContent = "Je account is klaar.";
    window.setTimeout(closeAuthModal, 500);
  } catch (error) {
    authStatus.textContent = error.message;
  } finally {
    authSubmit.disabled = false;
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    let pendingChange = false;
    if (stateSyncTimer) {
      window.clearTimeout(stateSyncTimer);
      stateSyncTimer = null;
      pendingChange = true;
    }
    if (!await stateSyncPromise || (pendingChange && !await syncStateToServer())) {
      authStatus.textContent = "Niet alle wijzigingen zijn opgeslagen. Vernieuw de pagina voordat je uitlogt.";
      return;
    }
    if (backendAvailable) await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Uitloggen mislukt:", error);
    authStatus.textContent = "Uitloggen is mislukt. Controleer je verbinding en probeer opnieuw.";
    return;
  }
  currentUser = null;
  restoreLocalState();
  updateAccountUi();
  renderAll();
  closeAuthModal();
  showToast("Je bent uitgelogd");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.hidden) closeAuthModal();
  if (event.key === "Escape" && !modal.hidden) modal.hidden = true;
});

function trapModalFocus(event, activeModal) {
  if (event.key !== "Tab" || activeModal.hidden) return;
  const focusable = [...activeModal.querySelectorAll("button, input, textarea, select, a")].filter((element) => !element.disabled && element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("keydown", (event) => {
  if (!modal.hidden) trapModalFocus(event, modal);
  if (!authModal.hidden) trapModalFocus(event, authModal);
});

document.addEventListener("click", (event) => {
  if (accountStatus === "ready") return;
  if (!event.target.closest("[data-save], [data-task], [data-calendar-task], [data-snooze-task], [data-care-task], #modal-add, #clear-local-data-button")) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showToast(accountStatus === "loading" ? "Je accountgegevens worden nog geladen." : "Accountgegevens laden mislukt. Vernieuw de pagina.");
}, true);

profileForm.addEventListener("submit", (event) => {
  if (accountStatus === "ready") return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showToast("Accountgegevens zijn niet beschikbaar. Vernieuw de pagina.");
}, true);

renderPlants();
renderCollection();
renderCarePlan();
renderSeasonalGuidance();
renderCalendar();
updateAccountUi();
initializeSession().then(() => {
  if (new URLSearchParams(location.search).has("account")) openAuthModal();
});
