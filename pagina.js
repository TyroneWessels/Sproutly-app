const savedNames = new Set(JSON.parse(localStorage.getItem("sproutly-plants") || "[]"));
const catalogPlants = window.SPROUTLY_PLANTS || [];

document.querySelectorAll(".page-year").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
const count = document.querySelector("#nav-count");
if (count) count.textContent = String(savedNames.size);

const savedGrid = document.querySelector("#saved-plants-grid");
if (savedGrid) {
  const empty = document.querySelector("#saved-empty");
  empty.hidden = savedNames.size > 0;
  savedGrid.innerHTML = [...savedNames].map((name) => {
    const plant = catalogPlants.find((item) => item.name === name);
    if (!plant) return "";
    return `<article class="plant-card"><div class="plant-art ${plant.art}"><img class="plant-photo" src="${plant.image}" alt="${plant.name}" loading="lazy" decoding="async" /></div><span class="plant-tag">${plant.category}</span><h3>${plant.name}</h3><p class="scientific-name">${plant.scientific}</p><p class="catalog-card-meta">${plant.light} · ${plant.difficulty === "easy" ? "Makkelijk" : "Gemiddeld"}</p><div class="plant-card-links"><a class="image-credit" href="${plant.imageSource}" target="_blank" rel="noreferrer">Fotobron en licentie</a><a class="text-link" href="planten.html">Bekijk in de catalogus <span aria-hidden="true">→</span></a></div></article>`;
  }).join("");
  savedGrid.querySelectorAll(".plant-photo").forEach((image) => image.addEventListener("error", window.handlePlantImageError, { once: true }));
}

const calendarGrid = document.querySelector("#calendar-grid");
if (calendarGrid) {
  let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const renderCalendar = () => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    document.querySelector("#calendar-month").textContent = `${monthNames[month]} ${year}`;
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    calendarGrid.innerHTML = "";
    for (let index = 0; index < firstDay; index += 1) calendarGrid.insertAdjacentHTML("beforeend", "<span class=\"calendar-day empty\" aria-hidden=\"true\"></span>");
    for (let day = 1; day <= daysInMonth; day += 1) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasTask = [3, 8, 14, 21, 28].includes(day);
      calendarGrid.insertAdjacentHTML("beforeend", `<button class="calendar-day ${isToday ? "today" : ""} ${hasTask ? "has-event" : ""}" type="button" data-day="${day}">${day}${hasTask ? "<span class=\"calendar-dot\" aria-hidden=\"true\"></span>" : ""}</button>`);
    }
    calendarGrid.querySelectorAll("[data-day]").forEach((button) => button.addEventListener("click", () => selectDay(Number(button.dataset.day))));
    selectDay(isTodayMonth() ? today.getDate() : 1);
  };
  const isTodayMonth = () => {
    const today = new Date();
    return visibleMonth.getMonth() === today.getMonth() && visibleMonth.getFullYear() === today.getFullYear();
  };
  const selectDay = (day) => {
    document.querySelector("#selected-date").textContent = `${day} ${monthNames[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;
    document.querySelector("#selected-day-events").innerHTML = [3, 8, 14, 21, 28].includes(day) ? "<p class=\"calendar-event\">✦ Controleer de aarde van je planten.</p>" : "<p class=\"calendar-event muted\">Geen gepland moment. Een rustige dag is ook goed voor je planten.</p>";
  };
  document.querySelector("#previous-month").addEventListener("click", () => { visibleMonth.setMonth(visibleMonth.getMonth() - 1); renderCalendar(); });
  document.querySelector("#next-month").addEventListener("click", () => { visibleMonth.setMonth(visibleMonth.getMonth() + 1); renderCalendar(); });
  renderCalendar();
}

document.querySelector("#reminder-button")?.addEventListener("click", () => {
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  alert("Je verzorgingsherinnering staat klaar.");
});
