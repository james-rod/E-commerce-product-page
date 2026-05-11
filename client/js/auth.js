import { apiFetch, getToken, setToken, clearToken } from "./api.js";

export function initAuth() {
  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setLoggedInState(payload.email || "Account");
    } catch {
      clearToken();
    }
  }

  document.getElementById("auth-login-btn").addEventListener("click", () => openModal("login"));
  document.getElementById("auth-logout-btn").addEventListener("click", logout);
  document.getElementById("auth-modal-close").addEventListener("click", closeModal);
  document.getElementById("auth-tab-login").addEventListener("click", () => switchTab("login"));
  document.getElementById("auth-tab-register").addEventListener("click", () => switchTab("register"));
  document.getElementById("login-form").addEventListener("submit", onLogin);
  document.getElementById("register-form").addEventListener("submit", onRegister);
}

function openModal(tab = "login") {
  switchTab(tab);
  document.getElementById("auth-modal").classList.remove("invisible");
}

function closeModal() {
  document.getElementById("auth-modal").classList.add("invisible");
  clearFormErrors();
}

function switchTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("login-form").classList.toggle("hidden", !isLogin);
  document.getElementById("register-form").classList.toggle("hidden", isLogin);
  document.getElementById("auth-tab-login").classList.toggle("active-tab", isLogin);
  document.getElementById("auth-tab-register").classList.toggle("active-tab", !isLogin);
}

async function onLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    const { token, user } = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(token);
    setLoggedInState(user.name);
    closeModal();
  } catch (err) {
    showFormError("login-error", err.message);
  }
}

async function onRegister(e) {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const name = document.getElementById("register-name").value;
  const password = document.getElementById("register-password").value;
  try {
    const { token, user } = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    });
    setToken(token);
    setLoggedInState(user.name);
    closeModal();
  } catch (err) {
    showFormError("register-error", err.message);
  }
}

function logout() {
  clearToken();
  document.getElementById("auth-logged-out").classList.remove("hidden");
  document.getElementById("auth-logged-in").classList.add("hidden");
  window.location.reload();
}

function setLoggedInState(name) {
  document.getElementById("auth-user-name").textContent = name;
  document.getElementById("auth-logged-out").classList.add("hidden");
  document.getElementById("auth-logged-in").classList.remove("hidden");
}

function showFormError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.remove("hidden");
}

function clearFormErrors() {
  ["login-error", "register-error"].forEach((id) => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.add("hidden");
  });
}
