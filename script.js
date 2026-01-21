// Login
const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");
const user = document.getElementById("user");
const pass = document.getElementById("pass");

function login(){
  if(user.value==="admin" && pass.value==="1234"){
    loginSection.style.display="none";
    mainSection.style.display="block";
    show("dashboard");
    updateDashboard();
    updateSelectProduit();
  }else{ alert("Mot de passe incorrect"); }
}

function logout(){
  mainSection.style.display="none";
  loginSection.style.display="block";
  user.value=""; pass.value="";
}

// Navigation
function show(id){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
}

// Stock
let stock = JSON.parse(localStorage.getItem("stock")) || [];
const listeStock = document.getElementById("listeStock");

function afficherStock(filter=""){
  listeStock.innerHTML="";
  stock.filter(p=>p.nom.toLowerCase().includes(filter.toLowerCase()))
       .forEach((p,i)=>{
    const tr = document.createElement("tr");
    const prixRevient = p.qte * p.prixAchat;
    tr.innerHTML = `<td>${p.nom}</td>
                    <td>${p.qte}</td>
                    <td>${p.prixAchat}</td>
                    <td>${p.prixVente}</td>
                    <td>${prixRevient}</td>
                    <td><button onclick="supprimerProduitStock(${i})">❌</button></td>`;
    listeStock.appendChild(tr);
  });
  localStorage.setItem("stock", JSON.stringify(stock));
}

function ajouterProduitStock(){
  const nom = document.getElementById("nomProduitStock").value;
  const qte = parseInt(document.getElementById("qteStock").value);
  const prixA = parseInt(document.getElementById("prixAchatStock").value);
  const prixV = parseInt(document.getElementById("prixVenteStock").value);
  if(nom && qte && prixA && prixV){
    stock.push({nom, qte, prixAchat:prixA, prixVente:prixV});
    afficherStock();
    updateSelectProduit();
    document.getElementById("nomProduitStock").value="";
    document.getElementById("qteStock").value="";
    document.getElementById("prixAchatStock").value="";
    document.getElementById("prixVenteStock").value="";
  }
}

function supprimerProduitStock(i){ stock.splice(i,1); afficherStock(); updateSelectProduit(); }

// Vente
let ventes = JSON.parse(localStorage.getItem("ventes")) || [];
const listeVentes = document.getElementById("listeVentes");
const totalVenteElem = document.getElementById("totalVente");
const encaisseElem = document.getElementById("encaisse");
const selectProduit = document.getElementById("selectProduit");

function updateSelectProduit(){
  selectProduit.innerHTML="";
  stock.forEach(p=>{
    const opt = document.createElement("option");
    opt.value=p.nom;
    opt.textContent=`${p.nom} (${p.qte} dispo)`;
    selectProduit.appendChild(opt);
  });
}

function ajouterVente(){
  const prodNom = selectProduit.value;
  const qte = parseInt(document.getElementById("venteQte").value);
  const produitStock = stock.find(p=>p.nom===prodNom);
  if(produitStock && qte>0 && produitStock.qte>=qte){
    const total = qte*produitStock.prixVente;
    ventes.push({nom:prodNom,qte,prixVente:produitStock.prixVente,prixAchat:produitStock.prixAchat});
    produitStock.qte -= qte;
    afficherStock();
    afficherVentes();
    updateSelectProduit();
    document.getElementById("venteQte").value="";
  } else { alert("Quantité invalide ou stock insuffisant"); }
}

function afficherVentes(filter=""){
  listeVentes.innerHTML="";
  let total = 0;
  ventes.filter(v=>v.nom.toLowerCase().includes(filter.toLowerCase()))
        .forEach((v,i)=>{
    const t=v.qte*v.prixVente;
    total+=t;
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${v.nom}</td><td>${v.qte}</td><td>${v.prixVente}</td><td>${t}</td>
                  <td><button onclick="supprimerVente(${i})">❌</button></td>`;
    listeVentes.appendChild(tr);
  });
  totalVenteElem.textContent=total;
  localStorage.setItem("ventes",JSON.stringify(ventes));
  updateDashboard();
}

function supprimerVente(i){
  const v=ventes[i];
  const produitStock=stock.find(p=>p.nom===v.nom);
  if(produitStock){ produitStock.qte+=v.qte; }
  ventes.splice(i,1);
  afficherVentes();
  afficherStock();
  updateSelectProduit();
}

// Facture printable
function printFacture(){
  let facture="<h2>Facture</h2><table><tr><th>Produit</th><th>Qté</th><th>Prix vente</th><th>Total</th></tr>";
  let total=0;
  ventes.forEach(v=>{
    const t=v.qte*v.prixVente;
    total+=t;
    facture+=`<tr><td>${v.nom}</td><td>${v.qte}</td><td>${v.prixVente}</td><td>${t}</td></tr>`;
  });
  facture+=`<tr><td colspan="3">Total</td><td>${total}</td></tr></table><p>Merci pour votre visite !</p>`;
  const win=window.open("","Facture","width=500,height=600");
  win.document.write(facture);
  win.print();
  ventes=[]; afficherVentes(); updateDashboard();
}

// Dashboard
const chartElem=document.getElementById("chart");
let myChart;
function updateDashboard(){
  const labels=ventes.map(v=>v.nom);
  const data=ventes.map(v=>v.qte*v.prixVente);
  const benefices=ventes.map(v=>v.qte*(v.prixVente-v.prixAchat));
  if(myChart) myChart.destroy();
  myChart=new Chart(chartElem,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[
        {label:'Montant vente',data:data,backgroundColor:'rgba(0,123,255,0.7)'},
        {label:'Bénéfice',data:benefices,backgroundColor:'rgba(255,0,0,0.7)'}
      ]
    },
    options:{responsive:true,scales:{y:{beginAtZero:true}}}
  });
  document.getElementById("totalVentesDashboard").textContent=data.reduce((a,b)=>a+b,0);
  document.getElementById("totalBeneficeDashboard").textContent=benefices.reduce((a,b)=>a+b,0);
}

// Recherche
document.getElementById("searchStock").addEventListener("input",(e)=>afficherStock(e.target.value));
document.getElementById("searchVente").addEventListener("input",(e)=>afficherVentes(e.target.value));

// Initialisation
afficherStock();
afficherVentes();
updateDashboard();
updateSelectProduit();
