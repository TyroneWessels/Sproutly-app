(() => {
  const projectUrl = "https://bhdcyqpebrzokhjzscor.supabase.co";
  const publishableKey = "sb_publishable_eD4D2PTL96kc6C1lNWMRSA_PWJKr4cG";
  const client = window.createSproutlySupabaseClient(projectUrl, publishableKey);
  const emptyState = () => ({ savedPlants: [], plantProfiles: {}, completedTasks: [], careOverrides: {} });
  let baseline = null;
  let baselineUserId = null;
  let stateExists = false;

  function userDetails(user) {
    return { id: user.id, email: user.email, displayName: user.user_metadata?.display_name || user.email };
  }

  function updateHeader(user) {
    const link = document.querySelector("a.profile-button");
    if (!link) return;
    const name = user?.displayName || "Inloggen";
    link.href = "./?account=1";
    link.setAttribute("aria-label", user ? `Account van ${name}` : "Inloggen of account maken");
    link.querySelector(".profile-name").textContent = name;
    link.querySelector(".avatar").textContent = user ? name.trim().slice(0, 2).toUpperCase() : "SP";
  }

  async function getUser() {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      updateHeader(null);
      return null;
    }
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    const user = userDetails(data.user);
    updateHeader(user);
    return user;
  }

  async function getState() {
    const user = await getUser();
    if (!user) throw new Error("Log opnieuw in om je plantgegevens te laden.");
    const { data, error } = await client.from("sproutly_user_data").select("state").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    baseline = data ? data.state : emptyState();
    baselineUserId = user.id;
    stateExists = Boolean(data);
    return structuredClone(baseline);
  }

  async function saveState(state) {
    const snapshot = structuredClone(state);
    const user = await getUser();
    if (!user) throw new Error("Log opnieuw in om je plantgegevens op te slaan.");
    if (baselineUserId !== user.id) throw new Error("Laad je accountgegevens opnieuw voordat je wijzigingen opslaat.");
    if (stateExists) {
      const { data, error } = await client.rpc("save_sproutly_state", { expected_state: baseline, new_state: snapshot });
      if (error) throw error;
      if (!data) throw new Error("Je gegevens zijn op een andere pagina gewijzigd. Vernieuw deze pagina en probeer opnieuw.");
    } else {
      const { error } = await client.from("sproutly_user_data").insert({ user_id: user.id, state: snapshot });
      if (error) throw error;
      stateExists = true;
    }
    baseline = snapshot;
    return structuredClone(snapshot);
  }

  async function register(email, password, displayName, localState) {
    const { data, error } = await client.auth.signUp({
      email, password, options: { data: { display_name: displayName } }
    });
    if (error) throw error;
    if (!data.session || !data.user) {
      throw new Error("Controleer je e-mail of schakel e-mailbevestiging uit in Supabase. Je browsergegevens zijn niet verwijderd.");
    }
    const user = userDetails(data.user);
    try {
      localStorage.setItem("sproutly-pending-import", user.id);
      await getState();
      await saveState(localState);
      localStorage.removeItem("sproutly-pending-import");
    } catch (saveError) {
      await client.auth.signOut();
      console.error("Browsergegevens konden niet naar het nieuwe account worden gekopieerd:", saveError);
      throw new Error("Je account is aangemaakt, maar je planten konden niet worden overgezet. Je browsergegevens zijn bewaard.");
    }
    return user;
  }

  async function login(email, password, localState) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    try {
      if (localStorage.getItem("sproutly-pending-import") === data.user.id) {
        const { data: row, error: readError } = await client.from("sproutly_user_data").select("user_id").eq("user_id", data.user.id).maybeSingle();
        if (readError) throw readError;
        if (!row) {
          await getState();
          await saveState(localState);
        }
        localStorage.removeItem("sproutly-pending-import");
      }
    } catch (importError) {
      await client.auth.signOut();
      console.error("Browsergegevens overzetten mislukt:", importError);
      throw new Error("Je planten konden nog niet worden overgezet. Je browsergegevens zijn bewaard; probeer opnieuw in te loggen.");
    }
    return userDetails(data.user);
  }

  async function logout() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    baseline = null;
    baselineUserId = null;
    stateExists = false;
  }

  async function requestPasswordReset(email, redirectTo) {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  function onPasswordRecovery(callback) {
    return client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") callback();
    }).data.subscription;
  }

  async function updatePassword(password) {
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
  }

  async function deleteAccount() {
    const { error } = await client.rpc("delete_own_sproutly_account");
    if (error) throw error;
    await client.auth.signOut({ scope: "local" });
  }

  window.SproutlyAccount = { getUser, getState, saveState, register, login, logout, deleteAccount, requestPasswordReset, onPasswordRecovery, updatePassword };
})();
