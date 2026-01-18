/* ================= LOGIN SIMPLE ================= */
const PASSWORD = "123"; // mot de passe

function initApp(){
  if(localStorage.getItem("logged")==="true"){
    showApp();
  }
}

function login(){
  const p = document.getElementById("loginPass").value;
  if(p === PASSWORD){
    localStorage.setItem("logged","true");
    showApp();
  } else {
    alert("Mot de passe incorrect");
  }
}

function logout(){
  localStorage.removeItem("logged");
  location.reload();
}

function showApp(){
  document.getElementById("loginBox").style.display="none";
  document.getElementById("app").style.display="block";
  initData();
}

/* ================= DATA ================= */
let produits = [];
let facture = [];
let caTotal = 0;

function initData(){
  produits = JSON.parse(localStorage.getItem("produits")) || [];
  caTotal = Number(localStorage.getItem("caTotal")) || 0;
  updateCA();
  afficherProduits();
}

function save(){
  localStorage.setItem("produits", JSON.stringify(produits));
  localStorage.setItem("caTotal", caTotal);
}

function updateCA(){
  document.getElementById("caTotal").innerText = caTotal;
}

/* ================= PRODUITS ================= */
function ajouterProduit(){
  if(!designation.value) return;

  produits.push({
    d: designation.value,
    a: Number(achat.value),
    v: Number(vente.value),
    s: Number(stock.value)
  });

  save();
  afficherProduits();
}

function afficherProduits(){
  let html="";
  produits.forEach((p,i)=>{
    html += `
      <tr>
        <td>${p.d}</td>
        <td>${p.s}</td>
        <td>${p.v}</td>
        <td>
          <button onclick="vendre(${i})">Vendre</button>
          <button onclick="supprimerProduit(${i})">❌</button>
        </td>
      </tr>
    `;
  });
  document.getElementById("listeProduits").innerHTML = html;
}

function supprimerProduit(i){
  produits.splice(i,1);
  save();
  afficherProduits();
}

/* ================= VENTE ================= */
function vendre(i){
  if(produits[i].s <= 0){
    alert("Stock insuffisant");
    return;
  }

  produits[i].s--;

  let ligne = facture.find(f => f.d === produits[i].d);
  if(ligne){
    ligne.q++;
  }else{
    facture.push({ d: produits[i].d, q:1, p: produits[i].v });
  }

  afficherFacture();
  save();
}

function afficherFacture(){
  let html="";
  let total=0;

  facture.forEach((f,i)=>{
    let t = f.q * f.p;
    total += t;
    html += `
      <tr>
        <td>${f.d}</td>
        <td>${f.q}</td>
        <td>${f.p}</td>
        <td>${t}</td>
        <td><button onclick="supprimerLigne(${i})">❌</button></td>
      </tr>
    `;
  });

  document.getElementById("facture").innerHTML = html;
  document.getElementById("totalFacture").innerText = total;
}

function supprimerLigne(i){
  facture.splice(i,1);
  afficherFacture();
}

function validerFacture(){
  let total = Number(document.getElementById("totalFacture").innerText);
  if(total === 0) return;

  caTotal += total;
  facture = [];

  document.getElementById("facture").innerHTML="";
  document.getElementById("totalFacture").innerText=0;

  updateCA();
  save();
  afficherProduits();
}

/* ================= EXPORT ================= */
function exportCSV(){
  let csv = "Produit,Stock,Prix\n";
  produits.forEach(p=>{
    csv += `${p.d},${p.s},${p.v}\n`;
  });

  let a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "produits.csv";
  a.click();
}

/* ================= RECHERCHE ================= */
function recherche(){
  let q = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll("#listeProduits tr").forEach(tr=>{
    tr.style.display = tr.innerText.toLowerCase().includes(q) ? "" : "none";
  });
}
