(() => {
  function species(id, profiles) {
    return profiles[id]?.species || id;
  }

  function create(name, profiles) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const id = `plant-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    profiles[id] = { species: name };
    return id;
  }

  function url(name, id) {
    return `plant.html?naam=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
  }

  function label(id, saved, profiles) {
    const profile = profiles[id] || {};
    if (profile.customName) return profile.customName;
    const name = species(id, profiles);
    const matches = [...saved].filter((item) => species(item, profiles) === name);
    return matches.length > 1 ? `${name} ${matches.indexOf(id) + 1}` : name;
  }

  function escape(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  function writeLocal(values) {
    const previous = Object.entries(values).map(([key]) => [key, localStorage.getItem(key)]);
    try {
      for (const [key, value] of Object.entries(values)) localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      try {
        for (const [key, value] of previous) {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        }
      } catch (restoreError) {
        console.error("Eerdere browsergegevens herstellen is mislukt:", restoreError);
        throw new Error("Opslaan en herstellen van browsergegevens is mislukt. Controleer je gegevens.");
      }
      throw error;
    }
  }

  window.SproutlyPlants = { species, create, label, url, escape, writeLocal };
})();
