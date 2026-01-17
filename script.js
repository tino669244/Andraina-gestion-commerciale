// ===== CONFIG =====
const PASSWORD = "1234";

// ===== DOM ELEMENTS =====
const passwordInput = document.getElementById("password");
const loginDiv = document.getElementById("login");
const loginBtn = document.getElementById("loginBtn");
const appDiv = document.getElementById("app");
const produitVenteSelect = document.getElementById("produitVente");

// ===== DATA =====
let produits = JSON.parse(localStorage.getItem("produits")) || [];
let ventes = []; // ventes courantes pour la facture seulement

// ===== SAVE PRODUITS =====
function save() {
  localStorage.setItem("produits", JSON.stringify(produits));
}

// ===== LOGIN =====
loginBtn.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    loginDiv.style.display = "none";
    appDiv.style.display = "block";
    afficher();
  } else {
    alert("Mot de passe incorrect");
  }
});

// ===== PRODUITS =====
function toggleProduits() {
  panelProduits.style.display =
    panelProduits.style.display === "block" ? "none" : "block";
}

function ajouterProduit() {
  if (!nom.value || !achat.value || !vente.value || !stock.value) return;

  produits.push({
    nom: nom.value,
    achat: Number(achat.value),
    vente: Number(vente.value),
    stock: Number(stock.value)
  });

  save();
  afficher();

  nom.value = achat.value = vente.value = stock.value = "";
}

function supprimerProduit(index) {
  if (!confirm("Supprimer ce produit ?")) return;

  produits.splice(index, 1);
  // reset les ventes courantes qui concernent ce produit
  ventes = ventes.filter(v => v.produitIndex !== index);
  save();
  afficher();
}

// ===== VENTE =====
function vendre() {
  const i = produitVente.value;
  const qte = Number(qteVente.value);

  if (i === "" || qte <= 0) return;

  if (produits[i].stock < qte) {
    alert("Stock insuffisant");
    return;
  }

  produits[i].stock -= qte;

  ventes.push({
    produitIndex: Number(i),
    designation: produits[i].nom,
    qte,
    prix: produits[i].vente,
    total: produits[i].vente * qte
  });

  save();
  afficher();
  qteVente.value = "";
}

// ===== AFFICHAGE =====
function afficher() {
  listeProduits.innerHTML = "";
  produitVenteSelect.innerHTML = "<option value=''>-- Produit --</option>";

  produits.forEach((p, i) => {
    listeProduits.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.achat}</td>
        <td>${p.vente}</td>
        <td>${p.stock}</td>
        <td><button onclick="supprimerProduit(${i})">🗑</button></td>
      </tr>`;
    produitVenteSelect.innerHTML += `<option value="${i}">${p.nom}</option>`;
  });

  // total et benefice courants
  let total = 0;
  let benefice = 0;
  ventes.forEach(v => {
    total += v.total;
    const achatProduit = produits[v.produitIndex] ? produits[v.produitIndex].achat : 0;
    benefice += (v.prix - achatProduit) * v.qte;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("benefice").innerText = benefice;
}

// ===== EXPORT / IMPORT =====
function exporter() {
  const data = { produits };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "andraina-service-backup.json";
  a.click();
}

function importer(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    produits = data.produits || [];
    save();
    afficher();
  };
  reader.readAsText(file);
}

// ===== FACTURE =====
function imprimer() {
  factureLignes.innerHTML = "";
  let totalFacture = 0;

  ventes.forEach(v => {
    factureLignes.innerHTML += `
      <tr>
        <td>${v.designation}</td>
        <td>${v.qte}</td>
        <td>${v.prix}</td>
        <td>${v.total}</td>
      </tr>`;
    totalFacture += v.total;
  });

  document.getElementById("totalFacture").innerText = totalFacture;
  document.getElementById("dateFacture").innerText = new Date().toLocaleString();

  window.print();

  // 🔹 remise à zéro ventes courantes après impression
  ventes = [];
  afficher();
}
