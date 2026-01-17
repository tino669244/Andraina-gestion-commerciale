let produits = JSON.parse(localStorage.getItem("produits")) || [];
let ventes = JSON.parse(localStorage.getItem("ventes")) || [];

function save() {
  localStorage.setItem("produits", JSON.stringify(produits));
  localStorage.setItem("ventes", JSON.stringify(ventes));
}

function ajouterProduit() {
  const nom = document.getElementById("nom").value;
  const achat = Number(document.getElementById("achat").value);
  const vente = Number(document.getElementById("vente").value);
  const stock = Number(document.getElementById("stock").value);

  if (!nom || stock <= 0) {
    alert("Produit invalide");
    return;
  }

  produits.push({ nom, achat, vente, stock });
  save();
  afficher();
}

function vendre() {
  const index = document.getElementById("produitVente").value;
  const qte = Number(document.getElementById("qteVente").value);

  if (index === "" || qte <= 0) return;

  const p = produits[index];
  if (p.stock < qte) {
    alert("Stock insuffisant");
    return;
  }

  p.stock -= qte;

  ventes.push({
    total: p.vente * qte,
    benefice: (p.vente - p.achat) * qte
  });

  save();
  afficher();
}

function afficher() {
  const tbody = document.getElementById("listeProduits");
  const select = document.getElementById("produitVente");

  tbody.innerHTML = "";
  select.innerHTML = "<option value=''>-- Choisir produit --</option>";

  produits.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.achat}</td>
        <td>${p.vente}</td>
        <td>${p.stock}</td>
      </tr>
    `;

    select.innerHTML += `<option value="${i}">${p.nom}</option>`;
  });

  let total = 0;
  let benef = 0;
  ventes.forEach(v => {
    total += v.total;
    benef += v.benefice;
  });

  document.getElementById("totalVentes").innerText = total;
  document.getElementById("benefice").innerText = benef;
}

afficher();

