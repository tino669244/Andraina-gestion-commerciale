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
  if (password.value === PASSWORD) {
    login.style.display = "none";
    app.style.display = "block";
    afficher();
  } else {
    alert("Mot de passe incorrect");
  }
}

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
  if (!confirm("Supprimer ce produit et ses ventes associées ?")) return;

  // Supprimer les ventes liées au produit
  ventes = ventes.filter(v => v.produitIndex !== index);

  // Supprimer le produit
  produits.splice(index, 1);

  // Réindexer les ventes restantes
  ventes.forEach(v => {
    if (v.produitIndex > index) v.produitIndex--;
  });

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
    qte,
    total: produits[i].vente * qte,
    benefice: (produits[i].vente - produits[i].achat) * qte
  });

  save();
  afficher();
  qteVente.value = "";
}

// ===== AFFICHAGE & RECALCUL =====
function afficher() {
  listeProduits.innerHTML = "";
  produitVente.innerHTML = "<option value=''>-- Produit --</option>";

  produits.forEach((p, i) => {
    listeProduits.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.achat}</td>
        <td>${p.vente}</td>
        <td>${p.stock}</td>
        <td><button onclick="supprimerProduit(${i})">🗑</button></td>
      </tr>`;
    produitVente.innerHTML += `<option value="${i}">${p.nom}</option>`;
  });

  // 🔁 RECALCUL AUTOMATIQUE
  let total = 0;
  let benef = 0;

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
  a.download = "andraina-gestion-pro.json";
  a.click();
}

function importer(e) {
  const file = e.target.files[0];
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
