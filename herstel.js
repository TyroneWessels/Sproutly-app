const account = window.SproutlyAccount;
const requestForm = document.querySelector("#recovery-request");
const updateForm = document.querySelector("#recovery-update");
const status = document.querySelector("#recovery-status");
const intro = document.querySelector("#recovery-intro");
const email = document.querySelector("#recovery-email");
const password = document.querySelector("#recovery-password");
const confirmation = document.querySelector("#recovery-confirm");
const callbackParams = new URLSearchParams(location.hash.slice(1));

if (callbackParams.has("error")) {
  status.textContent = "Deze herstellink is ongeldig of verlopen. Vraag hieronder een nieuwe link aan.";
  history.replaceState(null, "", location.pathname);
}

const subscription = account.onPasswordRecovery(() => {
  requestForm.hidden = true;
  updateForm.hidden = false;
  intro.textContent = "Kies een nieuw wachtwoord van minimaal 8 tekens.";
  status.textContent = "";
  password.focus();
});

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = requestForm.querySelector("button");
  button.disabled = true;
  status.textContent = "Je aanvraag wordt verwerkt…";
  try {
    await account.requestPasswordReset(email.value.trim(), new URL("herstel.html", document.baseURI).href);
    status.textContent = "Als er een account bestaat voor dit adres, ontvang je een herstellink. Controleer ook je ongewenste e-mail.";
  } catch (error) {
    console.error("Wachtwoordherstel aanvragen mislukt:", error);
    status.textContent = "De herstellink kon niet worden aangevraagd. Controleer je verbinding en probeer opnieuw.";
  } finally {
    button.disabled = false;
  }
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (password.value !== confirmation.value) {
    status.textContent = "De wachtwoorden zijn niet hetzelfde. Controleer ze en probeer opnieuw.";
    confirmation.focus();
    return;
  }
  const button = updateForm.querySelector("button");
  button.disabled = true;
  status.textContent = "Je wachtwoord wordt opgeslagen…";
  try {
    await account.updatePassword(password.value);
    updateForm.reset();
    updateForm.hidden = true;
    subscription.unsubscribe();
    intro.textContent = "Je wachtwoord is gewijzigd.";
    status.textContent = "Je kunt terug naar Sproutly.";
  } catch (error) {
    console.error("Wachtwoord wijzigen mislukt:", error);
    status.textContent = "Het wachtwoord kon niet worden gewijzigd. Probeer opnieuw of vraag een nieuwe herstellink aan.";
  } finally {
    button.disabled = false;
  }
});
