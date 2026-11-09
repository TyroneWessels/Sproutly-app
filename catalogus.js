const catalogPlants = window.SPROUTLY_PLANTS;

const catalogGrid = document.querySelector("#catalog-grid");
const catalogSearch = document.querySelector("#catalog-search");
const catalogLight = document.querySelector("#catalog-light");
const catalogDifficulty = document.querySelector("#catalog-difficulty");
const catalogSort = document.querySelector("#catalog-sort");
const catalogEmpty = document.querySelector("#catalog-empty");
const catalogResultCount = document.querySelector("#catalog-result-count");
const catalogToast = document.querySelector("#catalog-toast");
let catalogFilter = "all";
const storedPlants = localStorage.getItem("sproutly-plants");
let savedPlants = new Set(storedPlants ? JSON.parse(storedPlants) : window.SPROUTLY_DEFAULT_SAVED_PLANTS);
if (!storedPlants) localStorage.setItem("sproutly-plants", JSON.stringify([...savedPlants]));
let currentUser = null;
let backendAvailable = false;
const navCount = document.querySelector("#nav-count");
let accountState = { savedPlants: [...savedPlants], plantProfiles: {}, completedTasks: [], careOverrides: {} };

function updateNavCount() {
  if (navCount) navCount.textContent = String(savedPlants.size);
}

function escapeCatalogHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function showCatalogToast(message) {
  catalogToast.textContent = message;
  catalogToast.classList.add("show");
  clearTimeout(showCatalogToast.timeout);
  showCatalogToast.timeout = setTimeout(() => catalogToast.classList.remove("show"), 2600);
}

async function syncCatalogState() {
  localStorage.setItem("sproutly-plants", JSON.stringify([...savedPlants]));
  if (!currentUser) {
    return;
  }
  accountState = {
    ...accountState,
    savedPlants: [...savedPlants],
  };
  try {
    const response = await fetch("/api/me/state", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountState)
    });
    if (!response.ok) throw new Error(`Opslaan is mislukt (HTTP ${response.status}).`);
  } catch (error) {
    console.error("Collectie kon niet naar het account worden opgeslagen:", error);
    showCatalogToast("De wijziging kon niet naar je account worden opgeslagen.");
  }
}

async function initializeCatalogSession() {
  try {
    const health = await fetch("/api/health");
    backendAvailable = health.ok;
    if (!backendAvailable) return;
    const response = await fetch("/api/auth/me", { credentials: "same-origin" });
    const session = await response.json();
    currentUser = session.user;
    if (currentUser) {
      const stateResponse = await fetch("/api/me/state", { credentials: "same-origin" });
      if (!stateResponse.ok) throw new Error(`Accountgegevens laden is mislukt (HTTP ${stateResponse.status}).`);
      const state = await stateResponse.json();
      accountState = {
        savedPlants: Array.isArray(state.savedPlants) ? state.savedPlants : [],
        plantProfiles: state.plantProfiles && typeof state.plantProfiles === "object" ? state.plantProfiles : {},
        completedTasks: Array.isArray(state.completedTasks) ? state.completedTasks : [],
        careOverrides: state.careOverrides && typeof state.careOverrides === "object" ? state.careOverrides : {}
      };
      savedPlants = new Set(accountState.savedPlants);
      updateNavCount();
      renderCatalog();
    }
  } catch (error) {
    backendAvailable = false;
  }
}

function renderCatalog() {
  const query = catalogSearch.value.trim().toLowerCase();
  const filtered = catalogPlants.filter((plant) => {
    const text = `${plant.name} ${plant.aliases.join(" ")} ${plant.scientific} ${plant.category} ${plant.type} ${plant.light}`.toLowerCase();
    return (catalogFilter === "all" || plant.filter === catalogFilter)
      && (!query || text.includes(query))
      && (catalogLight.value === "all" || plant.lightLevel === catalogLight.value)
      && (catalogDifficulty.value === "all" || plant.difficulty === catalogDifficulty.value);
  });
  const sorted = [...filtered].sort((first, second) => {
    if (catalogSort.value === "name") return first.name.localeCompare(second.name, "nl");
    if (catalogSort.value === "difficulty") return first.difficulty.localeCompare(second.difficulty, "nl");
    return 0;
  });
  catalogResultCount.textContent = `${sorted.length} ${sorted.length === 1 ? "plant" : "planten"} gevonden`;
  catalogEmpty.hidden = sorted.length > 0;
  updateNavCount();
  catalogGrid.innerHTML = sorted.map((plant) => `
    <article class="plant-card catalog-card">
      <button class="save-plant ${savedPlants.has(plant.name) ? "saved" : ""}" type="button" data-catalog-save="${plant.name}" aria-label="${savedPlants.has(plant.name) ? "Verwijder" : "Voeg toe"} ${plant.name}">
        ${savedPlants.has(plant.name) ? "♥ Opgeslagen" : "♡ Aan mijn planten"}
      </button>
      <a class="plant-art ${plant.art}" href="plant.html?naam=${encodeURIComponent(plant.name)}" aria-label="Bekijk ${plant.name}">
        <img class="plant-photo" src="${plant.image}" alt="${plant.name}" loading="lazy" decoding="async" />
      </a>
      <span class="plant-tag">${plant.category}</span>
      <h3><a href="plant.html?naam=${encodeURIComponent(plant.name)}">${plant.name}</a></h3>
      <p class="scientific-name">${plant.scientific}</p>
      <p class="catalog-card-meta">${plant.light} · ${plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld"}</p>
      <a class="plant-details-link" href="plant.html?naam=${encodeURIComponent(plant.name)}">Bekijk plant en verzorging →</a>
      <div class="plant-card-links"><a class="image-credit" href="${plant.imageSource}" target="_blank" rel="noreferrer">Fotobron en licentie</a></div>
    </article>
  `).join("");
  catalogGrid.querySelectorAll(".plant-photo").forEach((image) => image.addEventListener("error", window.handlePlantImageError, { once: true }));
}

document.querySelectorAll("[data-catalog-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-tab.active")?.classList.remove("active");
    button.classList.add("active");
    catalogFilter = button.dataset.catalogFilter;
    renderCatalog();
  });
});

[catalogSearch, catalogLight, catalogDifficulty, catalogSort].forEach((control) => {
  control.addEventListener(control === catalogSearch ? "input" : "change", renderCatalog);
});

catalogGrid.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-catalog-save]");
  if (!button) return;
  const name = button.dataset.catalogSave;
  if (savedPlants.has(name)) {
    savedPlants.delete(name);
    showCatalogToast(`${name} is verwijderd. Je collectie is bijgewerkt.`);
  } else {
    savedPlants.add(name);
    showCatalogToast(`${name} is toegevoegd aan je planten.`);
  }
  renderCatalog();
  await syncCatalogState();
});

document.querySelector("#catalog-year").textContent = String(new Date().getFullYear());
renderCatalog();
initializeCatalogSession();
