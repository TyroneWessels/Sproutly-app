const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "care-reminders.js"), "utf8");

function createContext(permission = "granted") {
  const notifications = [];
  const values = new Map();
  class NotificationMock {
    constructor(title, options) {
      notifications.push({ title, options });
    }
  }
  NotificationMock.permission = permission;
  const context = {
    window: { Notification: NotificationMock },
    localStorage: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value)
    }
  };
  vm.runInNewContext(source, context);
  return { reminders: context.window.SproutlyReminders, notifications, values };
}

const events = [
  { taskId: "calendar-monstera-watering-2026-11-11", date: "2026-11-11", plantName: "Monstera", title: "Controleer de aarde" },
  { taskId: "calendar-basilicum-fertilizing-2026-11-11", date: "2026-11-11", plantName: "Basilicum", title: "Controleer of voeding nodig is" },
  { taskId: "calendar-varen-watering-2026-11-12", date: "2026-11-12", plantName: "Varen", title: "Controleer de aarde" }
];

test("dueToday returns only care events scheduled for the current local date", () => {
  const { reminders } = createContext();
  assert.deepEqual(
    reminders.dueToday(events, new Date(2026, 10, 11)).map((event) => event.plantName),
    ["Monstera", "Basilicum"]
  );
});

test("notify sends one summary for today's tasks and does not send duplicates", () => {
  const { reminders, notifications, values } = createContext();
  const today = new Date(2026, 10, 11);

  assert.equal(reminders.notify(events, today), 2);
  assert.equal(notifications.length, 1);
  assert.match(notifications[0].options.body, /2 verzorgingsmomenten/);
  assert.equal(reminders.notify(events, today), 0);
  assert.equal(notifications.length, 1);
  assert.ok(values.has("sproutly-sent-care-reminders"));
});

test("notify does nothing without permission and can notify again after a task is postponed", () => {
  const denied = createContext("denied");
  assert.equal(denied.reminders.notify(events, new Date(2026, 10, 11)), 0);
  assert.equal(denied.notifications.length, 0);

  const { reminders, notifications } = createContext();
  const event = events[0];
  assert.equal(reminders.notify([event], new Date(2026, 10, 11)), 1);
  assert.equal(reminders.notify([{ ...event, date: "2026-11-12" }], new Date(2026, 10, 12)), 1);
  assert.equal(notifications.length, 2);
});
