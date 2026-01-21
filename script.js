// Sections et login
const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");
const user = document.getElementById("user");
const pass = document.getElementById("pass");

function login() {
  if(user.value === "admin" && pass.value === "1234") {
    loginSection.style.display = "none";
    mainSection.style.display = "block";
    show("dashboard");
    renderChart();
  } else {
    alert("Mot de passe incorrect");
  }
}

function logout() {
  mainSection.style.display = "none";
  loginSection.style.display = "block";
  user.value = "";
  pass.value = "";
}

// Navigation
function show(sectionId){
  document.querySelectorAll(".section").forEach(sec=>sec.style.display="none");
  document.getElementById(sectionId).style.display="block";
}

// Produits / vente
const nomProduit = document.getElementById("nomProduit");
const prixProduit = document.getElementById("prixProduit");
const btnAjouter = document.getElementById("btnAjouter");
const listeProduits = document.getElementById("listeProduits");
const searchProduit = document.getElementById("searchProduit");
const totalVente = document.getElementById("totalVente");

let produits = JSON.parse(localStorage.getItem("produits")) || [];

function afficherProduits(filter="") {
  listeProduits.innerHTML = "";
  let total = 0;
  produits.filter(p => p.nom.toLowerCase().includes(filter.toLowerCase()))
          .forEach((p,index)=>{
    total += p.prix;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.nom}</td><td>${p.prix} Ar</td>
                    <td><button onclick="supprimerProduit(${index})">❌</button></td>`;
    listeProduits.appendChild(tr);
  });
  totalVente.textContent = total;
  localStorage.setItem("produits", JSON.stringify(produits));
}

btnAjouter.addEventListener("click",()=>{
  if(nomProduit.value && prixProduit.value){
    produits.push({nom: nomProduit.value, prix: parseInt(prixProduit.value)});
    nomProduit.value=""; prixProduit.value="";
    afficherProduits();
    renderChart();
  }
});

function supprimerProduit(index){
  produits.splice(index,1);
  afficherProduits();
  renderChart();
}

searchProduit.addEventListener("input",(e)=>{
  afficherProduits(e.target.value);
});

// Facture printable
function printFacture(){
  let facture = "<h2>Facture</h2><table><tr><th>Produit</th><th>Prix</th></tr>";
  let total = 0;
  produits.forEach(p=>{
    facture += `<tr><td>${p.nom}</td><td>${p.prix} Ar</td></tr>`;
    total += p.prix;
  });
  facture += `<tr><td>Total</td><td>${total} Ar</td></tr></table>`;
  facture += "<p>Merci pour votre visite !</p>";
  const win = window.open("","Facture","width=500,height=600");
  win.document.write(facture);
  win.print();
}

// Dashboard graphique
function renderChart(){
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = produits.map(p=>p.nom);
  const data = produits.map(p=>p.prix);
  if(window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx,{
    type: 'bar',
    data: {
      labels: labels,
      datasets:[{
        label:'Montant Ariary',
        data:data,
        backgroundColor:'rgba(0,123,255,0.7)',
        borderColor:'rgba(0,123,255,1)',
        borderWidth:1
      }]
    },
    options:{
      responsive:true,
      scales:{y:{beginAtZero:true}}
    }
  });
}

// Initialisation
afficherProduits();
