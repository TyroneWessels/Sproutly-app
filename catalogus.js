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
let catalogSaving = false;
const storedPlants = localStorage.getItem("sproutly-plants");
let savedPlants = new Set(storedPlants ? JSON.parse(storedPlants) : window.SPROUTLY_DEFAULT_SAVED_PLANTS);
if (!storedPlants) localStorage.setItem("sproutly-plants", JSON.stringify([...savedPlants]));
let currentUser = null;
let backendAvailable = false;
const navCount = document.querySelector("#nav-count");
let accountState = { savedPlants: [...savedPlants], plantProfiles: JSON.parse(localStorage.getItem("sproutly-profiles") || "{}"), completedTasks: [], careOverrides: {} };

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
  if (!currentUser) {
    try {
      window.SproutlyPlants.writeLocal({
        "sproutly-profiles": accountState.plantProfiles,
        "sproutly-plants": [...savedPlants]
      });
      return true;
    } catch (error) {
      console.error("Collectie kon niet op deze browser worden opgeslagen:", error);
      showCatalogToast("De plant kon niet worden opgeslagen. Controleer de beschikbare opslagruimte.");
      return false;
    }
  }
  accountState = {
    ...accountState,
    savedPlants: [...savedPlants],
  };
  try {
    await window.SproutlyAccount.saveState(accountState);
    return true;
  } catch (error) {
    console.error("Collectie kon niet naar het account worden opgeslagen:", error);
    showCatalogToast(error.message || "De wijziging kon niet naar je account worden opgeslagen.");
    return false;
  }
}

async function initializeCatalogSession() {
  try {
    const user = await window.SproutlyAccount.getUser();
    backendAvailable = true;
    if (user) {
      const state = await window.SproutlyAccount.getState();
      accountState = {
        savedPlants: Array.isArray(state.savedPlants) ? state.savedPlants : [],
        plantProfiles: state.plantProfiles && typeof state.plantProfiles === "object" ? state.plantProfiles : {},
        completedTasks: Array.isArray(state.completedTasks) ? state.completedTasks : [],
        careOverrides: state.careOverrides && typeof state.careOverrides === "object" ? state.careOverrides : {}
      };
      currentUser = user;
      savedPlants = new Set(accountState.savedPlants);
      updateNavCount();
      renderCatalog();
    }
    return true;
  } catch (error) {
    backendAvailable = false;
    console.error("Accountgegevens laden mislukt:", error);
    showCatalogToast("Accountgegevens laden is mislukt. Vernieuw de pagina voordat je wijzigingen maakt.");
    return false;
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
      <button class="save-plant" type="button" data-catalog-save="${plant.name}" aria-label="Voeg een ${plant.name} toe aan Mijn planten">
        + Toevoegen
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
  if (!await catalogSession) return;
  if (catalogSaving) {
    showCatalogToast("Wacht even tot de vorige plant is opgeslagen.");
    return;
  }
  catalogSaving = true;
  const name = button.dataset.catalogSave;
  button.disabled = true;
  const id = window.SproutlyPlants.create(name, accountState.plantProfiles);
  savedPlants.add(id);
  if (await syncCatalogState()) {
    showCatalogToast(`${name} is toegevoegd. Bekijk en geef je plant een naam via Mijn planten.`);
  } else {
    savedPlants.delete(id);
    delete accountState.plantProfiles[id];
  }
  catalogSaving = false;
  renderCatalog();
});

document.querySelector("#catalog-year").textContent = String(new Date().getFullYear());
renderCatalog();
const catalogSession = initializeCatalogSession();
