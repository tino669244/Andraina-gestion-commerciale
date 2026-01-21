const PASSWORD = "1234";

let produits = JSON.parse(localStorage.getItem("produits") || "[]");
let ca = Number(localStorage.getItem("ca") || 0);
let benefice = Number(localStorage.getItem("benefice") || 0);
let facture = [];
let caisse = Number(localStorage.getItem("caisse") || 0);

function login() {
  if (document.getElementById("password").value === PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    init();
  } else alert("Mot de passe incorrect");
}

function show(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function init() {
  document.getElementById("ca").textContent = ca;
  document.getElementById("benefice").textContent = benefice;
  document.getElementById("soldeCaisse").textContent = caisse;
  document.getElementById("dateFacture").textContent = new Date().toLocaleString();
  afficherProduits();
}

function ajouterProduit() {
  produits.push({
    nom: pNom.value,
    achat: +pAchat.value,
    vente: +pVente.value,
    qte: +pQte.value
  });
  save();
}

function afficherProduits(liste = produits) {
  listeProduits.innerHTML = "";
  venteProduit.innerHTML = "";
  liste.forEach((p, i) => {
    listeProduits.innerHTML += `
      <tr>
        <td>${p.nom}</td><td>${p.achat}</td><td>${p.vente}</td>
        <td>${p.qte}</td>
        <td><button onclick="supprimer(${i})">X</button></td>
      </tr>`;
    venteProduit.innerHTML += `<option value="${i}">${p.nom}</option>`;
  });
}

function supprimer(i) {
  produits.splice(i,1);
  save();
}

function vendre() {
  let p = produits[venteProduit.value];
  let q = +venteQte.value;
  if (q > p.qte) return alert("Stock insuffisant");

  p.qte -= q;
  let total = q * p.vente;
  ca += total;
  benefice += q * (p.vente - p.achat);
  caisse += total;

  facture.push({nom:p.nom,qte:q,pu:p.vente,total});
  afficherFacture();
  save();
}

function afficherFacture() {
  factureBody.innerHTML="";
  let t=0;
  facture.forEach(f=>{
    t+=f.total;
    factureBody.innerHTML+=`
      <tr><td>${f.nom}</td><td>${f.qte}</td><td>${f.pu}</td><td>${f.total}</td></tr>`;
  });
  totalFacture.textContent=t;
}

function viderFacture() {
  facture=[];
  afficherFacture();
}

function rechercheProduit(txt) {
  afficherProduits(produits.filter(p=>p.nom.toLowerCase().includes(txt.toLowerCase())));
}

function save() {
  localStorage.setItem("produits",JSON.stringify(produits));
  localStorage.setItem("ca",ca);
  localStorage.setItem("benefice",benefice);
  localStorage.setItem("caisse",caisse);
  init();
}

function imprimer() {
  window.print();
}
