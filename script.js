let produits = JSON.parse(localStorage.getItem("produits")) || [];
let facture = [];
let caTotal = Number(localStorage.getItem("caTotal")) || 0;

function init() {
  afficherProduits();
  document.getElementById("caTotal").innerText = caTotal;
}

function save() {
  localStorage.setItem("produits", JSON.stringify(produits));
  localStorage.setItem("caTotal", caTotal);
}

function ajouterProduit() {
  let d = designation.value;
  let a = Number(achat.value);
  let v = Number(vente.value);
  let s = Number(stock.value);

  if (!d) return alert("Désignation obligatoire");

  produits.push({ d, a, v, s });
  save();
  afficherProduits();
}

function afficherProduits() {
  let html = "";
  produits.forEach((p, i) => {
    html += `
      <tr>
        <td>${p.d}</td>
        <td>${p.s}</td>
        <td>${p.v}</td>
        <td>
          <button onclick="vendre(${i})">Vendre</button>
          <button onclick="supprimerProduit(${i})">❌</button>
        </td>
      </tr>`;
  });
  listeProduits.innerHTML = html;
}

function vendre(i) {
  if (produits[i].s <= 0) return alert("Stock insuffisant");
  produits[i].s--;

  let ligne = facture.find(f => f.d === produits[i].d);
  if (ligne) ligne.q++;
  else facture.push({ d: produits[i].d, q: 1, p: produits[i].v });

  afficherFacture();
  save();
}

function afficherFacture() {
  let html = "";
  let total = 0;

  facture.forEach((f, i) => {
    let t = f.q * f.p;
    total += t;
    html += `
      <tr>
        <td>${f.d}</td>
        <td>${f.q}</td>
        <td>${f.p}</td>
        <td>${t}</td>
        <td><button onclick="supprimerLigne(${i})">❌</button></td>
      </tr>`;
  });

  factureBody = document.getElementById("facture");
  factureBody.innerHTML = html;
  totalFacture.innerText = total;
}

function supprimerLigne(i) {
  facture.splice(i, 1);
  afficherFacture();
}

function supprimerProduit(i) {
  produits.splice(i, 1);
  save();
  afficherProduits();
}

function validerFacture() {
  let total = Number(totalFacture.innerText);
  if (total === 0) return alert("Facture vide");

  caTotal += total;
  facture = [];

  document.getElementById("facture").innerHTML = "";
  totalFacture.innerText = 0;
  document.getElementById("caTotal").innerText = caTotal;

  save();
  afficherProduits();
}

function recherche() {
  let q = search.value.toLowerCase();
  document.querySelectorAll("#listeProduits tr").forEach(tr => {
    tr.style.display = tr.innerText.toLowerCase().includes(q) ? "" : "none";
  });
}
