// ===== CONFIG =====
const PASSWORD = "1234";

// ===== DATA =====
let produits = JSON.parse(localStorage.getItem("produits")) || [];
let ventes = JSON.parse(localStorage.getItem("ventes")) || [];

// ===== SAVE =====
function save() {
  localStorage.setItem("produits", JSON.stringify(produits));
  localStorage.setItem("ventes", JSON.stringify(ventes));
}

// ===== LOGIN =====
function login() {
  if (document.getElementById("password").value === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    afficher();
  } else {
    alert("Mot de passe incorrect");
  }
}

// ===== PRODUITS =====
function toggleProduits() {
  const p = document.getElementById("panelProduits");
  p.style.display = (p.style.display === "block") ? "none" : "block";
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
  if (confirm("Supprimer ce produit ?")) {
    produits.splice(index, 1);
    save();
    afficher();
  }
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
    total: produits[i].vente * qte,
    benefice: (produits[i].vente - produits[i].achat) * qte
  });

  save();
  afficher();
  qteVente.value = "";
}

// ===== AFFICHAGE =====
function afficher() {
  listeProduits.innerHTML = "";
  produitVente.innerHTML = "<option value=''>-- Choisir produit --</option>";

  produits.forEach((p, i) => {
    listeProduits.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.achat}</td>
        <td>${p.vente}</td>
        <td>${p.stock}</td>
        <td><button onclick="supprimerProduit(${i})">🗑</button></td>
      </tr>
    `;
    produitVente.innerHTML += `<option value="${i}">${p.nom}</option>`;
  });

  let total = 0, benef = 0;
  ventes.forEach(v => {
    total += v.total;
    benef += v.benefice;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("benefice").innerText = benef;
}

// ===== EXPORT / IMPORT =====
function exporter() {
  const data = { produits, ventes };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "andraina-gestion-backup.json";
  a.click();
}

function importer(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    produits = data.produits || [];
    ventes = data.ventes || [];
    save();
    afficher();
  };
  reader.readAsText(file);
}

// ===== FACTURE =====
function imprimer() {
  window.print();
}
