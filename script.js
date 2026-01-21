const PASSWORD = "1234";

// Simulation des ventes
let ventes = [
  {produit:"Produit A", total:5000, date:"2026-01-05"},
  {produit:"Produit B", total:3000, date:"2026-01-15"},
  {produit:"Produit C", total:2000, date:"2026-02-10"}
];

let caChart;

// LOGIN
function togglePwd() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

function login() {
  if (password.value === PASSWORD) {
    localStorage.setItem("logged", "true");
    showApp();
    updateDashboard();
  } else {
    alert("Mot de passe incorrect");
  }
}

function logout() {
  localStorage.setItem("logged", "false");
  location.reload();
}

// SHOW SECTIONS
function showApp() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

function show(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// DASHBOARD
function updateDashboard() {
  const month = parseInt(document.getElementById("filterMonth").value);
  const ventesMonth = ventes.filter(v => new Date(v.date).getMonth() === month && new Date(v.date).getFullYear() === 2026);

  let caTotal = ventesMonth.reduce((sum, v) => sum + v.total, 0);
  document.getElementById("caTotal").innerText = caTotal + " Ar";
  document.getElementById("portefeuille").innerText = caTotal + " Ar";
  document.getElementById("totalDocs").innerText = ventesMonth.length;

  // Chart
  const ctx = document.getElementById('caChart').getContext('2d');
  if(caChart) caChart.destroy();

  caChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ventesMonth.map(v => v.produit),
      datasets: [{
        data: ventesMonth.map(v => v.total),
        backgroundColor: ['#2563eb','#60a5fa','#93c5fd','#e0f2fe']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'CA par produit (Janvier 2026)' }
      }
    }
  });
}

window.onload = () => {
  if (localStorage.getItem("logged") === "true") {
    showApp();
    updateDashboard();
  }
};
