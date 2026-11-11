(() => {
  const sentRemindersKey = "sproutly-sent-care-reminders";
  const sentDuringSession = new Set();

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function dueToday(events, today = new Date()) {
    const todayKey = dateKey(today);
    return events.filter((event) => event.date === todayKey);
  }

  function reminderKey(event) {
    return `${event.taskId}:${event.date}`;
  }

  function notify(events, today = new Date()) {
    if (!("Notification" in window) || window.Notification.permission !== "granted") return 0;

    const sentReminders = new Set([
      ...JSON.parse(localStorage.getItem(sentRemindersKey) || "[]"),
      ...sentDuringSession
    ]);
    const due = dueToday(events, today).filter((event) => !sentReminders.has(reminderKey(event)));
    if (!due.length) return 0;

    const plants = [...new Set(due.map((event) => event.plantName))];
    const details = due.length === 1
      ? `${plants[0]}: ${due[0].title}.`
      : `${due.length} verzorgingsmomenten voor ${plants.slice(0, 3).join(", ")}${plants.length > 3 ? ` en ${plants.length - 3} andere` : ""}.`;
    new window.Notification("Growify · tijd voor je planten", { body: details, tag: `growify-care-${dateKey(today)}` });
    const newKeys = due.map(reminderKey);
    newKeys.forEach((key) => sentDuringSession.add(key));
    try {
      localStorage.setItem(sentRemindersKey, JSON.stringify([...sentReminders, ...newKeys].slice(-500)));
    } catch (error) {
      console.error("Verstuurde verzorgingsmeldingen konden niet in deze browser worden onthouden:", error);
    }
    return due.length;
  }

  function watch(eventsProvider, onNotification, onError) {
    const check = () => {
      let count;
      try {
        count = notify(eventsProvider());
      } catch (error) {
        onError(error);
        return;
      }
      if (count) onNotification(count);
    };
    const checkWhenVisible = () => {
      if (!document.hidden) check();
    };
    const interval = window.setInterval(check, 60_000);
    document.addEventListener("visibilitychange", checkWhenVisible);
    window.addEventListener("focus", check);
    check();
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      window.removeEventListener("focus", check);
    };
  }

  window.SproutlyReminders = { dueToday, reminderKey, notify, watch };
})();
