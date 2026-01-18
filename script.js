/* ===== LOGIN ===== */
const PASS_HASH = "202cb962ac59075b964b07152d234b70"; // md5("123")

function md5(str){return CryptoJS.MD5(str).toString();}

function initApp(){
  if(localStorage.getItem("logged")==="true"){
    loginOK();
  }
}

function login(){
  let p = loginPass.value;
  if(md5(p) === PASS_HASH){
    localStorage.setItem("logged","true");
    loginOK();
  } else alert("Mot de passe incorrect");
}

function loginOK(){
  loginBox.style.display="none";
  app.style.display="block";
  initData();
}

function logout(){
  localStorage.removeItem("logged");
  location.reload();
}

/* ===== DATA ===== */
let produits=[], facture=[], caTotal=0;

function initData(){
  produits = JSON.parse(localStorage.getItem("produits")) || [];
  caTotal = Number(localStorage.getItem("caTotal")) || 0;
  caTotalSpan();
  afficherProduits();
}

function save(){
  localStorage.setItem("produits",JSON.stringify(produits));
  localStorage.setItem("caTotal",caTotal);
}

function caTotalSpan(){
  document.getElementById("caTotal").innerText=caTotal;
}

/* ===== PRODUITS ===== */
function ajouterProduit(){
  if(!designation.value) return;
  produits.push({
    d:designation.value,
    a:+achat.value,
    v:+vente.value,
    s:+stock.value
  });
  save(); afficherProduits();
}

function afficherProduits(){
  let html="";
  produits.forEach((p,i)=>{
    html+=`<tr>
      <td>${p.d}</td><td>${p.s}</td><td>${p.v}</td>
      <td>
        <button onclick="vendre(${i})">Vendre</button>
        <button onclick="supprimerProduit(${i})">❌</button>
      </td>
    </tr>`;
  });
  listeProduits.innerHTML=html;
}

function supprimerProduit(i){
  produits.splice(i,1);
  save(); afficherProduits();
}

/* ===== VENTE ===== */
function vendre(i){
  if(produits[i].s<=0) return alert("Stock insuffisant");
  produits[i].s--;
  let f=facture.find(x=>x.d===produits[i].d);
  if(f) f.q++; else facture.push({d:produits[i].d,q:1,p:produits[i].v});
  afficherFacture(); save();
}

function afficherFacture(){
  let t=0,html="";
  facture.forEach((f,i)=>{
    let l=f.q*f.p; t+=l;
    html+=`<tr>
      <td>${f.d}</td><td>${f.q}</td><td>${f.p}</td><td>${l}</td>
      <td><button onclick="facture.splice(${i},1);afficherFacture()">❌</button></td>
    </tr>`;
  });
  facture.innerHTML=html;
  totalFacture.innerText=t;
}

function validerFacture(){
  let t=+totalFacture.innerText;
  if(t===0) return;
  caTotal+=t;
  facture=[];
  totalFacture.innerText=0;
  facture.innerHTML="";
  caTotalSpan(); save(); afficherProduits();
}

/* ===== EXPORT CSV ===== */
function exportCSV(){
  let csv="Produit,Stock,Prix\n";
  produits.forEach(p=>csv+=`${p.d},${p.s},${p.v}\n`);
  let a=document.createElement("a");
  a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
  a.download="produits.csv";
  a.click();
}

/* ===== SEARCH ===== */
function recherche(){
  let q=search.value.toLowerCase();
  document.querySelectorAll("#listeProduits tr").forEach(tr=>{
    tr.style.display=tr.innerText.toLowerCase().includes(q)?"":"none";
  });
}
