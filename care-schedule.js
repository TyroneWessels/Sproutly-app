(() => {
  const intervals = {
    Monstera: { fertilizing: 28, repotting: 365 },
    Basilicum: { fertilizing: 14, repotting: 180 },
    Lavendel: { fertilizing: 90, repotting: 365 },
    Sansevieria: { fertilizing: 60, repotting: 730 },
    "Aloë vera": { fertilizing: 60, repotting: 730 },
    Tomaat: { fertilizing: 7, repotting: 180 },
    Rozemarijn: { fertilizing: 90, repotting: 365 },
    Pannenkoekenplant: { fertilizing: 28, repotting: 365 }
  };
  const definitions = {
    watering: { title: "Controleer de aarde", action: "Aarde gecontroleerd", actions: ["Aarde gecontroleerd", "Water gegeven"] },
    fertilizing: { title: "Controleer of voeding nodig is", action: "Voeding gegeven", actions: ["Voeding gegeven"] },
    repotting: { title: "Controleer of verpotten nodig is", action: "Verpot", actions: ["Verpot"] }
  };

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function parseDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return dateKey(date) === value ? date : null;
  }

  function addDays(date, days) {
    const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    result.setDate(result.getDate() + days);
    return result;
  }

  function events(saved, profiles, overrides, today = new Date()) {
    const todayKey = dateKey(today);
    const result = [];
    for (const id of saved) {
      const name = window.SproutlyPlants.species(id, profiles);
      const plant = window.SPROUTLY_PLANTS.find((item) => item.name === name);
      if (!plant) continue;
      const schedule = { watering: plant.soilCheckDays, ...intervals[name] };
      const log = profiles[id]?.careLog || [];
      for (const [type, days] of Object.entries(schedule)) {
        const definition = definitions[type];
        const dates = log.filter((entry) => definition.actions.includes(entry.action)
          && parseDate(entry.date) && entry.date <= todayKey).map((entry) => entry.date).sort();
        const latest = dates[dates.length - 1];
        if (!latest && type !== "watering") continue;
        const due = latest ? addDays(parseDate(latest), days) : new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const taskId = `calendar-${id}-${type}-${latest ? dateKey(due) : "onbekend"}`;
        const override = parseDate(overrides[taskId]);
        const planned = override || due;
        const plannedKey = dateKey(planned);
        result.push({
          taskId, plantId: id, type, title: definition.title, action: definition.action,
          plantName: window.SproutlyPlants.label(id, saved, profiles),
          dueDate: plannedKey, date: plannedKey < todayKey ? todayKey : plannedKey,
          overdue: plannedKey < todayKey, unplanned: !latest && !override
        });
      }
    }
    return result;
  }

  function record(profiles, event, today = new Date()) {
    const profile = profiles[event.plantId] || {};
    const entries = profile.careLog || [];
    if (entries.length >= 200) throw new Error("Het logboek is vol. Verwijder eerst een oud verzorgingsmoment.");
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const id = `log-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    profiles[event.plantId] = {
      ...profile,
      careLog: [{ id, date: dateKey(today), action: event.action, notes: "" }, ...entries]
    };
  }

  window.SproutlyCare = { dateKey, parseDate, addDays, events, record };
})();
