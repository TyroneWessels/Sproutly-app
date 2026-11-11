const savedPlantsKey = "sproutly-plants";
const completedTasksKey = "sproutly-tasks";
const storedPlants = localStorage.getItem(savedPlantsKey);
let savedNames = new Set(storedPlants ? JSON.parse(storedPlants) : window.SPROUTLY_DEFAULT_SAVED_PLANTS);
let completedTasks = new Set(JSON.parse(localStorage.getItem(completedTasksKey) || "[]"));
let currentUser = null;
let accountState = {
  savedPlants: [...savedNames],
  plantProfiles: JSON.parse(localStorage.getItem("sproutly-profiles") || "{}"),
  completedTasks: [...completedTasks],
  careOverrides: JSON.parse(localStorage.getItem("sproutly-care-overrides") || "{}")
};
const catalogPlants = window.SPROUTLY_PLANTS || [];

if (!storedPlants) localStorage.setItem(savedPlantsKey, JSON.stringify([...savedNames]));
document.querySelectorAll(".page-year").forEach((element) => { element.textContent = String(new Date().getFullYear()); });

const navCount = document.querySelector("#nav-count");
const savedGrid = document.querySelector("#saved-plants-grid");
const emptyState = document.querySelector("#saved-empty");
const favoritesFilter = document.querySelector("#favorites-filter");
const favoritesEmpty = document.querySelector("#favorites-empty");
const toast = (message, actionLabel, action) => {
  const toastElement = document.querySelector("#page-toast");
  if (!toastElement) return;
  toastElement.replaceChildren();
  const text = document.createElement("span");
  text.textContent = message;
  toastElement.append(text);
  if (actionLabel && action) {
    const button = document.createElement("button");
    button.className = "toast-action";
    button.type = "button";
    button.textContent = actionLabel;
    button.addEventListener("click", async () => {
      button.disabled = true;
      await action();
    }, { once: true });
    toastElement.append(button);
  }
  toastElement.classList.add("show");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => toastElement.classList.remove("show"), action ? 10000 : 2800);
};

function updateNavCount() {
  if (navCount) navCount.textContent = String(savedNames.size);
}

function persistLocalState() {
  if (currentUser) return;
  window.SproutlyPlants.writeLocal({
    "sproutly-profiles": accountState.plantProfiles,
    [savedPlantsKey]: [...savedNames],
    [completedTasksKey]: [...completedTasks],
    "sproutly-care-overrides": accountState.careOverrides
  });
}

async function syncAccountState() {
  if (!currentUser) return true;
  accountState = {
    ...accountState,
    savedPlants: [...savedNames],
    completedTasks: [...completedTasks]
  };
  try {
    await window.SproutlyAccount.saveState(accountState);
    return true;
  } catch (error) {
    console.error("Growify-accountgegevens konden niet worden opgeslagen:", error);
    toast(error.message || "De wijziging kon niet naar je account worden opgeslagen.");
    return false;
  }
}

async function initializePageSession() {
  try {
    const user = await window.SproutlyAccount.getUser();
    if (!user) return true;
    const state = await window.SproutlyAccount.getState();
    accountState = {
      savedPlants: Array.isArray(state.savedPlants) ? state.savedPlants : [],
      plantProfiles: state.plantProfiles && typeof state.plantProfiles === "object" ? state.plantProfiles : {},
      completedTasks: Array.isArray(state.completedTasks) ? state.completedTasks : [],
      careOverrides: state.careOverrides && typeof state.careOverrides === "object" ? state.careOverrides : {}
    };
    currentUser = user;
    savedNames = new Set(accountState.savedPlants);
    completedTasks = new Set(accountState.completedTasks);
    persistLocalState();
    renderSavedPlants();
    updateNavCount();
    if (calendarGrid) renderCalendar();
    return true;
  } catch (error) {
    console.error("Accountgegevens konden niet worden geladen:", error);
    toast("Accountgegevens laden is mislukt. Vernieuw de pagina voordat je wijzigingen maakt.");
    return false;
  }
}

function renderSavedPlants() {
  if (!savedGrid) return;
  const plants = [...savedNames].map((id) => {
    const name = window.SproutlyPlants.species(id, accountState.plantProfiles);
    const plant = catalogPlants.find((item) => item.name === name);
    return plant ? { ...plant, instanceId: id, profile: accountState.plantProfiles[id] || {}, displayName: window.SproutlyPlants.label(id, savedNames, accountState.plantProfiles) } : null;
  }).filter(Boolean);
  const visiblePlants = favoritesFilter?.checked ? plants.filter((plant) => plant.profile.favorite === true) : plants;
  emptyState.hidden = plants.length > 0;
  if (favoritesEmpty) favoritesEmpty.hidden = !favoritesFilter.checked || plants.length === 0 || visiblePlants.length > 0;
  savedGrid.innerHTML = visiblePlants.map((plant) => `
    <article class="plant-card catalog-card">
      <button class="save-plant saved" type="button" data-remove-plant="${window.SproutlyPlants.escape(plant.instanceId)}" aria-label="Verwijder ${window.SproutlyPlants.escape(plant.displayName)} uit Mijn planten">Verwijderen</button>
      <a class="plant-art ${plant.art}" href="${window.SproutlyPlants.url(plant.name, plant.instanceId)}" aria-label="Bekijk ${window.SproutlyPlants.escape(plant.displayName)}"><img class="plant-photo" src="${window.SproutlyPlants.escape(plant.profile.photo || plant.image)}" alt="${plant.name}" loading="lazy" decoding="async" /></a>
      <span class="plant-tag">${plant.category}</span>
      <h3><a href="${window.SproutlyPlants.url(plant.name, plant.instanceId)}">${window.SproutlyPlants.escape(plant.displayName)}</a></h3>
      ${plant.profile.customName ? `<p class="catalog-card-meta">${window.SproutlyPlants.escape(plant.name)}</p>` : ""}
      ${plant.profile.location ? `<p class="catalog-card-meta">${window.SproutlyPlants.escape(plant.profile.location)}</p>` : ""}
      <p class="scientific-name">${plant.scientific}</p>
      <p class="catalog-card-meta">${plant.light} · ${plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld"}</p>
      <a class="plant-details-link" href="${window.SproutlyPlants.url(plant.name, plant.instanceId)}">Bekijk plant en verzorging</a>
      <div class="plant-card-links"><a class="image-credit" href="${plant.imageSource}" target="_blank" rel="noreferrer">Fotobron en licentie</a></div>
    </article>
  `).join("");
  savedGrid.querySelectorAll(".plant-photo").forEach((image) => image.addEventListener("error", window.handlePlantImageError, { once: true }));
  savedGrid.querySelectorAll("[data-remove-plant]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!await pageSession) return;
      const id = button.dataset.removePlant;
      const name = window.SproutlyPlants.label(id, savedNames, accountState.plantProfiles);
      if (!window.confirm(`Wil je ${name} verwijderen? De gegevens en het verzorgingslogboek van deze plant worden ook verwijderd.`)) return;
      button.disabled = true;
      const previousState = structuredClone(accountState);
      const previousNames = new Set(savedNames);
      const previousTasks = new Set(completedTasks);
      const previousPosition = [...savedNames].indexOf(id);
      const previousProfile = structuredClone(accountState.plantProfiles[id]);
      previousState.savedPlants = [...previousNames];
      previousState.completedTasks = [...previousTasks];
      savedNames.delete(id);
      delete accountState.plantProfiles[id];
      const belongsToPlant = (taskId) => taskId.startsWith(`calendar-${id}-`) || taskId.startsWith(`soil-check-${id}-`);
      const removedTasks = [...completedTasks].filter(belongsToPlant);
      const removedOverrides = Object.fromEntries(
        Object.entries(accountState.careOverrides).filter(([taskId]) => belongsToPlant(taskId))
      );
      completedTasks = new Set([...completedTasks].filter((taskId) => !belongsToPlant(taskId)));
      Object.keys(accountState.careOverrides).filter(belongsToPlant).forEach((taskId) => delete accountState.careOverrides[taskId]);
      try {
        persistLocalState();
      } catch (error) {
        console.error("Plant verwijderen mislukt:", error);
        toast("Verwijderen is mislukt. Controleer de opslagruimte en probeer opnieuw.");
        savedNames = previousNames;
        completedTasks = previousTasks;
        accountState = previousState;
        button.disabled = false;
        return;
      }
      if (!await syncAccountState()) {
        savedNames = previousNames;
        completedTasks = previousTasks;
        accountState = previousState;
        button.disabled = false;
        return;
      }
      updateNavCount();
      renderSavedPlants();
      if (calendarGrid) renderCalendar();
      toast(`${name} is verwijderd uit Mijn planten.`, "Ongedaan maken", async () => {
        if (savedNames.has(id)) {
          toast(`${name} staat alweer in Mijn planten; de eerdere gegevens zijn niet overschreven.`);
          return;
        }
        const deletedState = structuredClone(accountState);
        const deletedNames = new Set(savedNames);
        const deletedTasks = new Set(completedTasks);
        const restoredNames = [...savedNames];
        restoredNames.splice(Math.max(0, Math.min(previousPosition, restoredNames.length)), 0, id);
        savedNames = new Set(restoredNames);
        completedTasks = new Set([...completedTasks, ...removedTasks]);
        if (previousProfile === undefined) delete accountState.plantProfiles[id];
        else accountState.plantProfiles[id] = previousProfile;
        accountState.completedTasks = [...completedTasks];
        accountState.careOverrides = { ...accountState.careOverrides, ...removedOverrides };
        try {
          persistLocalState();
          if (!await syncAccountState()) {
            savedNames = deletedNames;
            completedTasks = deletedTasks;
            accountState = deletedState;
            return;
          }
          updateNavCount();
          renderSavedPlants();
          if (calendarGrid) renderCalendar();
          toast(`${name} en de gegevens zijn hersteld.`);
        } catch (error) {
          savedNames = deletedNames;
          completedTasks = deletedTasks;
          accountState = deletedState;
          console.error("Plant herstellen is mislukt:", error);
          toast("De plant kon niet worden hersteld. Probeer het opnieuw.");
        }
      });
    });
  });
}

function getCareEvents() {
  return window.SproutlyCare.events(savedNames, accountState.plantProfiles, accountState.careOverrides);
}

favoritesFilter?.addEventListener("change", renderSavedPlants);
document.querySelector("#show-all-plants")?.addEventListener("click", () => {
  favoritesFilter.checked = false;
  renderSavedPlants();
  favoritesFilter.focus();
});

const calendarGrid = document.querySelector("#calendar-grid");
if (calendarGrid) {
  let calendarSaving = false;
  let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let selectedDate = new Date();
  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const shortDayNames = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  function dateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function selectDate(date) {
    selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    document.querySelector("#selected-date").textContent = selectedDate.toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const events = getCareEvents().filter((event) => event.date === dateKey(selectedDate));
    const eventContainer = document.querySelector("#selected-day-events");
    eventContainer.innerHTML = events.length ? events.map((event) => `
      <button class="calendar-event" type="button" data-calendar-task="${window.SproutlyPlants.escape(event.taskId)}">
        <span class="calendar-event-check" aria-hidden="true">○</span>
        <span><strong>${window.SproutlyPlants.escape(event.plantName)}</strong><small>${window.SproutlyPlants.escape(event.title)}${event.overdue ? ` · gepland op ${event.dueDate}` : event.unplanned ? " · nog niet geregistreerd" : ""}</small></span>
      </button>
    `).join("") : `<p class="calendar-event muted">${savedNames.size ? "Geen controlemomenten gepland. Een rustige dag voor uw planten." : "Voeg eerst een plant toe aan Mijn planten. Dan ziet u hier de verzorgingsmomenten."}</p>`;
    eventContainer.querySelectorAll("[data-calendar-task]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!await pageSession) return;
        if (calendarSaving) {
          toast("Wacht even tot het vorige moment is opgeslagen.");
          return;
        }
        const event = getCareEvents().find((item) => item.taskId === button.dataset.calendarTask);
        if (!event) {
          toast("Dit verzorgingsmoment is gewijzigd. Vernieuw de pagina.");
          return;
        }
        if (!window.confirm(`Heb je vandaag bij ${event.plantName} de actie "${event.action}" uitgevoerd? Dit wordt in het logboek opgeslagen.`)) return;
        calendarSaving = true;
        button.disabled = true;
        const previous = structuredClone(accountState);
        try {
          window.SproutlyCare.record(accountState.plantProfiles, event);
          persistLocalState();
          if (!await syncAccountState()) {
            accountState = previous;
            button.disabled = false;
            return;
          }
          renderCalendar();
          toast(`${event.action} is voor vandaag in het logboek gezet.`);
        } catch (error) {
          accountState = previous;
          button.disabled = false;
          console.error("Verzorgingsmoment registreren mislukt:", error);
          toast(error.message || "Het verzorgingsmoment kon niet worden opgeslagen.");
        } finally {
          calendarSaving = false;
        }
      });
    });
  }

  function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const events = getCareEvents();
    const monthEvents = events.filter((event) => {
      const date = window.SproutlyCare.parseDate(event.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
    document.querySelector("#calendar-month").textContent = `${monthNames[month]} ${year}`;
    document.querySelector("#calendar-summary").textContent = savedNames.size
      ? `${monthEvents.length} ${monthEvents.length === 1 ? "controlemoment" : "controlemomenten"} deze maand`
      : "Bewaar een plant om verzorgingsmomenten te zien.";
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = dateKey(new Date());
    calendarGrid.innerHTML = "";
    for (let index = 0; index < firstDay; index += 1) {
      calendarGrid.insertAdjacentHTML("beforeend", "<span class=\"calendar-day empty\" aria-hidden=\"true\"></span>");
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = dateKey(date);
      const isToday = key === todayKey;
      const isSelected = key === dateKey(selectedDate);
      const dayEvents = events.filter((event) => event.date === key);
      const eventLabel = dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? "verzorgingsmoment" : "verzorgingsmomenten"}` : ", geen verzorgingsmomenten";
      calendarGrid.insertAdjacentHTML("beforeend", `<button class="calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${dayEvents.length ? "has-event" : ""}" type="button" data-day="${day}" aria-label="${dayNames[date.getDay()]} ${day} ${monthNames[month]}${eventLabel}" aria-pressed="${isSelected}">${day}${dayEvents.length ? "<span class=\"calendar-dot\" aria-hidden=\"true\"></span>" : ""}</button>`);
    }
    calendarGrid.querySelectorAll("[data-day]").forEach((button) => {
      button.addEventListener("click", () => selectDate(new Date(year, month, Number(button.dataset.day))));
    });
    selectDate(selectedDate.getMonth() === month && selectedDate.getFullYear() === year ? selectedDate : new Date(year, month, 1));
  }

  document.querySelector("#previous-month").addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.querySelector("#next-month").addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
}

let stopCareReminderChecks = null;
function startCareReminderChecks() {
  if (stopCareReminderChecks || !("Notification" in window) || Notification.permission !== "granted") return;
  stopCareReminderChecks = window.SproutlyReminders.watch(
    getCareEvents,
    (count) => toast(`Melding verstuurd voor ${count} verzorgingsmomenten`),
    (error) => {
      console.error("Verzorgingsmelding kon niet worden verstuurd:", error);
      toast("Een verzorgingsmelding kon niet worden verstuurd. Bekijk de kalender voor je taken.");
      const status = document.querySelector("#reminder-status");
      if (status) status.textContent = "Een verzorgingsmelding kon niet worden verstuurd. Je kunt de taken in de kalender bekijken.";
    }
  );
}

const reminderButton = document.querySelector("#reminder-button");
reminderButton?.addEventListener("click", async () => {
  const status = document.querySelector("#reminder-status");
  if (!("Notification" in window) || typeof Notification.requestPermission !== "function") {
    status.textContent = "Deze browser ondersteunt geen browsermeldingen. U kunt de kalender wel op elk moment bekijken.";
    return;
  }
  try {
    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") {
      status.textContent = "Meldingen zijn niet ingeschakeld. U kunt verzorgingsmomenten altijd in de kalender bekijken.";
      return;
    }
    const count = window.SproutlyReminders.notify(getCareEvents());
    status.textContent = "Verzorgingsmeldingen staan aan. U krijgt een melding op dagen met taken zolang de homepage, Mijn planten of de kalender open is.";
    if (count) toast(`Melding verstuurd voor ${count} verzorgingsmomenten`);
    startCareReminderChecks();
  } catch (error) {
    console.error("Verzorgingsmeldingen konden niet worden ingesteld:", error);
    status.textContent = "De herinnering kon niet worden ingesteld. U kunt de kalender wel blijven gebruiken.";
  }
});

renderSavedPlants();
updateNavCount();
const pageSession = initializePageSession();
pageSession.then((ready) => {
  if (ready) startCareReminderChecks();
});
