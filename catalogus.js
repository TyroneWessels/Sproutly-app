const catalogPlants = [
  { name: "Monstera", aliases: ["gatenplant"], scientific: "Monstera deliciosa", category: "Binnenplant", filter: "indoor", art: "art-monstera", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=85", light: "Indirect licht", lightLevel: "medium", difficulty: "easy", type: "Kamerplant" },
  { name: "Basilicum", aliases: ["basil"], scientific: "Ocimum basilicum", category: "Kruid", filter: "indoor", art: "art-herb", image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=85", light: "Veel licht", lightLevel: "high", difficulty: "easy", type: "Kruid" },
  { name: "Lavendel", aliases: ["lavender"], scientific: "Lavandula angustifolia", category: "Buitenplant", filter: "outdoor", art: "art-lavender", image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=85", light: "Veel licht", lightLevel: "high", difficulty: "easy", type: "Buitenplant" },
  { name: "Sansevieria", aliases: ["vrouwentong", "snake plant"], scientific: "Dracaena trifasciata", category: "Binnenplant", filter: "indoor", art: "art-snake", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=85", light: "Weinig licht", lightLevel: "low", difficulty: "easy", type: "Kamerplant" },
  { name: "Aloë vera", aliases: ["aloe", "aloe vera"], scientific: "Aloe barbadensis miller", category: "Binnenplant", filter: "indoor", art: "art-aloe", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85", light: "Indirect licht", lightLevel: "medium", difficulty: "easy", type: "Vetplant" },
  { name: "Tomaat", aliases: ["tomatenplant", "tomato"], scientific: "Solanum lycopersicum", category: "Buitenplant", filter: "outdoor", art: "art-tomato", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=85", light: "Veel licht", lightLevel: "high", difficulty: "medium", type: "Groente" },
  { name: "Rozemarijn", aliases: ["rosemary"], scientific: "Salvia rosmarinus", category: "Buitenplant", filter: "outdoor", art: "art-rosemary", image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=800&q=85", light: "Veel licht", lightLevel: "high", difficulty: "easy", type: "Kruid" },
  { name: "Pannenkoekenplant", aliases: ["pilea", "pilea peperomioides"], scientific: "Pilea peperomioides", category: "Binnenplant", filter: "indoor", art: "art-pilea", image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=85", light: "Indirect licht", lightLevel: "medium", difficulty: "easy", type: "Kamerplant" }
];

const catalogGrid = document.querySelector("#catalog-grid");
const catalogSearch = document.querySelector("#catalog-search");
const catalogLight = document.querySelector("#catalog-light");
const catalogDifficulty = document.querySelector("#catalog-difficulty");
const catalogSort = document.querySelector("#catalog-sort");
const catalogEmpty = document.querySelector("#catalog-empty");
const catalogResultCount = document.querySelector("#catalog-result-count");
const catalogToast = document.querySelector("#catalog-toast");
let catalogFilter = "all";
let savedPlants = new Set(JSON.parse(localStorage.getItem("sproutly-plants") || "[]"));
let currentUser = null;
let backendAvailable = false;

function escapeCatalogHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function imageUrl(image, width) {
  return image.replace(/([?&])w=\d+/, `$1w=${width}`);
}

function showCatalogToast(message) {
  catalogToast.textContent = message;
  catalogToast.classList.add("show");
  clearTimeout(showCatalogToast.timeout);
  showCatalogToast.timeout = setTimeout(() => catalogToast.classList.remove("show"), 2600);
}

async function syncCatalogState() {
  if (!currentUser) {
    localStorage.setItem("sproutly-plants", JSON.stringify([...savedPlants]));
    return;
  }
  const state = {
    savedPlants: [...savedPlants],
    plantProfiles: {},
    completedTasks: [],
    careOverrides: {}
  };
  try {
    await fetch("/api/me/state", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
  } catch (error) {
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
      const state = await stateResponse.json();
      savedPlants = new Set(Array.isArray(state.savedPlants) ? state.savedPlants : []);
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
  catalogGrid.innerHTML = sorted.map((plant) => `
    <article class="plant-card catalog-card">
      <button class="save-plant ${savedPlants.has(plant.name) ? "saved" : ""}" type="button" data-catalog-save="${plant.name}" aria-label="${savedPlants.has(plant.name) ? "Verwijder" : "Voeg toe"} ${plant.name}">
        ${savedPlants.has(plant.name) ? "♥ Opgeslagen" : "♡ Aan mijn planten"}
      </button>
      <div class="plant-art ${plant.art}">
        <img class="plant-photo" src="${plant.image}" srcset="${imageUrl(plant.image, 400)} 400w, ${imageUrl(plant.image, 800)} 800w" sizes="(max-width: 590px) 100vw, (max-width: 850px) 50vw, 260px" alt="${plant.name}" loading="lazy" decoding="async" />
      </div>
      <span class="plant-tag">${plant.category}</span>
      <h3>${plant.name}</h3>
      <p class="scientific-name">${plant.scientific}</p>
      <p class="catalog-card-meta">${plant.light} · ${plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld"}</p>
    </article>
  `).join("");
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
    showCatalogToast(`${name} is verwijderd uit je planten`);
  } else {
    savedPlants.add(name);
    showCatalogToast(`${name} is toegevoegd aan je planten`);
  }
  renderCatalog();
  await syncCatalogState();
});

document.querySelector("#catalog-year").textContent = String(new Date().getFullYear());
renderCatalog();
initializeCatalogSession();
