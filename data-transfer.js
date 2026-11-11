(() => {
  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function assertRecord(value, label) {
    if (!isRecord(value)) throw new Error(`${label} moet een object zijn.`);
    if (Object.keys(value).some((key) => ["__proto__", "prototype", "constructor"].includes(key))) {
      throw new Error(`${label} bevat een ongeldige sleutel.`);
    }
  }

  function isDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function parseImport(text, speciesForId) {
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (error) {
      throw new Error("Dit bestand bevat geen geldige JSON.");
    }
    assertRecord(payload, "Het importbestand");
    const state = payload.state || payload;
    assertRecord(state, "De plantgegevens");
    if (!Array.isArray(state.savedPlants) || state.savedPlants.length > 2000
      || !state.savedPlants.every((id) => typeof id === "string" && id.length > 0 && id.length <= 160)) {
      throw new Error("De plantenlijst in dit bestand is ongeldig.");
    }
    if (new Set(state.savedPlants).size !== state.savedPlants.length) {
      throw new Error("De plantenlijst bevat dubbele planten.");
    }
    for (const id of state.savedPlants) {
      if (!speciesForId(id, state.plantProfiles || {})) {
        throw new Error(`De plant "${id}" staat niet in de Growify-catalogus.`);
      }
    }
    assertRecord(state.plantProfiles, "De plantprofielen");
    if (!Array.isArray(state.completedTasks) || state.completedTasks.length > 10000
      || !state.completedTasks.every((id) => typeof id === "string" && id.length <= 240)) {
      throw new Error("De lijst met afgeronde taken in dit bestand is ongeldig.");
    }
    assertRecord(state.careOverrides, "De uitgestelde taken");
    for (const [taskId, date] of Object.entries(state.careOverrides)) {
      if (taskId.length > 240 || !isDate(date)) {
        throw new Error("Een uitgesteld verzorgingsmoment in dit bestand is ongeldig.");
      }
    }
    for (const [id, profile] of Object.entries(state.plantProfiles)) {
      if (id.length > 160) throw new Error("Een plantprofiel heeft een ongeldige ID.");
      assertRecord(profile, `Het profiel van ${id}`);
      if (profile.species !== undefined && (typeof profile.species !== "string" || !speciesForId(id, state.plantProfiles))) {
        throw new Error(`Het profiel van ${id} bevat een ongeldige plantsoort.`);
      }
      for (const [key, maxLength] of [["customName", 40], ["location", 60], ["notes", 240]]) {
        if (profile[key] !== undefined && (typeof profile[key] !== "string" || profile[key].length > maxLength)) {
          throw new Error(`Het profiel van ${id} bevat een ongeldig veld.`);
        }
      }
      if (profile.date !== undefined && profile.date !== "" && !isDate(profile.date)) {
        throw new Error(`Het profiel van ${id} bevat een ongeldige datum.`);
      }
      if (profile.favorite !== undefined && typeof profile.favorite !== "boolean") {
        throw new Error(`Het profiel van ${id} bevat een ongeldige favorietstatus.`);
      }
      if (profile.careIntervals !== undefined) {
        assertRecord(profile.careIntervals, `Het verzorgingsschema van ${id}`);
        for (const [type, days] of Object.entries(profile.careIntervals)) {
          if (!["watering", "fertilizing", "repotting"].includes(type)
            || !Number.isInteger(days) || days < 1 || days > 3650) {
            throw new Error(`Het verzorgingsschema van ${id} bevat een ongeldig interval.`);
          }
        }
      }
      if (profile.careLog !== undefined) {
        const validActions = ["Water gegeven", "Aarde gecontroleerd", "Voeding gegeven", "Verpot", "Gesnoeid", "Anders"];
        if (!Array.isArray(profile.careLog) || profile.careLog.length > 200
          || profile.careLog.some((entry) => !isRecord(entry) || typeof entry.id !== "string" || entry.id.length > 200
            || !isDate(entry.date) || !validActions.includes(entry.action)
            || (entry.notes !== undefined && (typeof entry.notes !== "string" || entry.notes.length > 240)))) {
          throw new Error(`Het logboek van ${id} is ongeldig.`);
        }
      }
      if (profile.photo && (typeof profile.photo !== "string" || profile.photo.length > 750000 || !profile.photo.startsWith("data:image/"))) {
        throw new Error(`De eigen foto van ${id} heeft een ongeldig formaat.`);
      }
    }
    return {
      savedPlants: [...state.savedPlants],
      plantProfiles: structuredClone(state.plantProfiles),
      completedTasks: [...state.completedTasks],
      careOverrides: structuredClone(state.careOverrides)
    };
  }

  function preview(current, imported) {
    const currentPlants = new Set(current.savedPlants);
    const importedPlants = new Set(imported.savedPlants);
    return {
      addedPlants: [...importedPlants].filter((id) => !currentPlants.has(id)).length,
      existingPlants: [...importedPlants].filter((id) => currentPlants.has(id)).length,
      importedTasks: imported.completedTasks.filter((task) => !current.completedTasks.includes(task)).length
    };
  }

  function merge(current, imported) {
    const plantProfiles = { ...imported.plantProfiles, ...current.plantProfiles };
    for (const id of Object.keys(imported.plantProfiles)) {
      const currentProfile = current.plantProfiles[id];
      const importedProfile = imported.plantProfiles[id];
      if (!currentProfile) continue;
      const careIntervals = { ...importedProfile.careIntervals, ...currentProfile.careIntervals };
      const careLog = [...(currentProfile.careLog || [])];
      const logIds = new Set(careLog.map((entry) => entry.id));
      for (const entry of importedProfile.careLog || []) {
        if (!logIds.has(entry.id)) careLog.push(entry);
      }
      plantProfiles[id] = {
        ...importedProfile,
        ...currentProfile,
        ...(Object.keys(careIntervals).length ? { careIntervals } : {}),
        ...(careLog.length ? { careLog } : {})
      };
    }
    return {
      savedPlants: [...new Set([...current.savedPlants, ...imported.savedPlants])],
      plantProfiles,
      completedTasks: [...new Set([...current.completedTasks, ...imported.completedTasks])],
      careOverrides: { ...imported.careOverrides, ...current.careOverrides }
    };
  }

  window.SproutlyDataTransfer = { parseImport, preview, merge };
})();
