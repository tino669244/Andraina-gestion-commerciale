// PASSWORD
const PASS = "1234";

let produits = JSON.parse(localStorage.getItem("produits")) || [];
let ventes = JSON.parse(localStorage.getItem("ventes")) || [];

function save() {
  localStorage.setItem("produits", JSON.stringify(produits));
  localStorage.setItem("ventes", JSON.stringify(ventes));
}

// LOGIN
function login() {
  if (document.getElementById("password").value === PASS) {
    document.getElementById("login").style.display="none";
    document.getElementById("app").style.display="block";
    afficher();
  } else {
    alert("Mot de passe incorrect");
  }
}

// PRODUITS
function toggleProduits() {
  const p = document.getElementById("panelProduits");
  p.style.display = p.style.display==="block" ? "none" : "block";
}

function ajouterProduit() {
  produits.push({
    nom: nom.value,
    achat:+achat.value,
    vente:+vente.value,
    stock:+stock.value
  });
  save();
  afficher();
}

function supprimerProduit(i) {
  if(confirm("Supprimer ?")) {
    produits.splice(i,1);
    save();
    afficher();
  }
}

// VENTE
function vendre() {
  const i = produitVente.value;
  const q = +qteVente.value;
  if(!produits[i] || q<=0) return;

  if(produits[i].stock < q) {
    alert("Stock insuffisant");
    return;
  }

  produits[i].stock -= q;
  ventes.push({
    total: produits[i].vente * q,
    benef: (produits[i].vente - produits[i].achat) * q
  });
  save();
  afficher();
}

// AFFICHAGE
function afficher() {
  listeProduits.innerHTML="";
  produitVente.innerHTML="<option value=''>-- Produit --</option>";

  produits.forEach((p,i)=>{
    listeProduits.innerHTML+=`
      <tr>
        <td>${p.nom}</td>
        <td>${p.achat}</td>
        <td>${p.vente}</td>
        <td>${p.stock}</td>
        <td><button onclick="supprimerProduit(${i})">🗑</button></td>
      </tr>`;
    produitVente.innerHTML+=`<option value="${i}">${p.nom}</option>`;
  });

  let t=0,b=0;
  ventes.forEach(v=>{t+=v.total;b+=v.benef});
  total.innerText=t;
  benefice.innerText=b;
}

// EXPORT / IMPORT
function exporter() {
  const data = {produits, ventes};
  const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup.json";
  a.click();
}

function importer(e) {
  const file = e.target.files[0];
  const r = new FileReader();
  r.onload = ()=>{
    const data = JSON.parse(r.result);
    produits=data.produits;
    ventes=data.ventes;
    save();
    afficher();
  };
  r.readAsText(file);
}

// FACTURE
function imprimer() {
  window.print();
}
