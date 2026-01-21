const PASSWORD = "1234";

function togglePwd() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

function login() {
  if (password.value === PASSWORD) {
    localStorage.setItem("logged", "true");
    showApp();
  } else {
    alert("Mot de passe incorrect");
  }
}

function logout() {
  localStorage.setItem("logged", "false");
  location.reload();
}

function showApp() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

function show(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

window.onload = () => {
  if (localStorage.getItem("logged") === "true") {
    showApp();
  }
};
