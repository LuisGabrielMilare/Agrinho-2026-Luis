let estado = JSON.parse(localStorage.getItem("fazenda")) || {

dinheiro: 100,
agua: 100,
solo: 100,
fome: 100,

sementes: 5,
plantacao: 0,
colheita: 0,

clima: "☀️ Ensolarado"

};

// ---------------- SALVAR ----------------
function salvar(){
localStorage.setItem("fazenda", JSON.stringify(estado));
}

// ---------------- NOVO JOGO ----------------
function novoJogo(){
localStorage.clear();
location.href = "jogo.html";
}

// ---------------- ATUALIZAR ----------------
function atualizar(){

if(!document.getElementById("dinheiro")) return;

document.getElementById("dinheiro").innerText = estado.dinheiro;
document.getElementById("agua").innerText = estado.agua;
document.getElementById("solo").innerText = estado.solo;
document.getElementById("fome").innerText = estado.fome;
document.getElementById("clima").innerText = estado.clima;

}

// ---------------- LOG ----------------
function log(msg){
document.getElementById("log").innerText = msg;
}

// ---------------- CLIMA ----------------
function mudarClima(){

let climas = [
"☀️ Ensolarado",
"🌧️ Chuva",
"⛅ Nublado",
"🌩️ Tempestade",
"🥵 Seca"
];

estado.clima = climas[Math.floor(Math.random()*climas.length)];
}

// ---------------- PLANTAR ----------------
function plantar(){

if(estado.sementes <= 0){
log("❌ Sem sementes!");
return;
}

estado.sementes--;
estado.plantacao += 1;

log("🌱 Plantio realizado");
salvar();
atualizar();
}

// ---------------- COLHER ----------------
function colher(){

if(estado.plantacao <= 0){
log("❌ Nada para colher");
return;
}

estado.plantacao--;
estado.colheita += 3;

log("🌾 Colheita realizada +3");
salvar();
atualizar();
}

// ---------------- COMPRAR SEMENTES ----------------
function comprarSemente(){

if(estado.dinheiro < 10){
log("❌ Dinheiro insuficiente");
return;
}

estado.dinheiro -= 10;
estado.sementes += 5;

log("🛒 Comprou sementes");
salvar();
atualizar();
}

// ---------------- COMPRAR COMIDA ----------------
function comprarComida(){

if(estado.dinheiro < 15){
log("❌ Sem dinheiro");
return;
}

estado.dinheiro -= 15;
estado.fome += 25;

log("🍗 Comeu comida");
salvar();
atualizar();
}

// ---------------- VENDER ----------------
function vender(){

if(estado.colheita <= 0){
log("❌ Nada para vender");
return;
}

estado.dinheiro += estado.colheita * 5;
log("💰 Vendas realizadas");

estado.colheita = 0;

salvar();
atualizar();
}

// ---------------- PASSAR DIA ----------------
function passarDia(){

// fome
estado.fome -= 5;

// água e solo
estado.agua -= 3;
estado.solo -= 2;

// produção cresce
if(estado.plantacao > 0){
estado.colheita += estado.plantacao;
}

// clima
mudarClima();

// efeitos do clima
if(estado.clima === "🌧️ Chuva") estado.agua += 15;
if(estado.clima === "🥵 Seca") estado.agua -= 20;
if(estado.clima === "🌩️ Tempestade") estado.solo -= 10;

// limites
if(estado.fome > 100) estado.fome = 100;

salvar();
atualizar();

log("⏩ Um dia passou");
}

// ---------------- LOOP ----------------
setInterval(() => {
if(estado.fome < 20){
log("⚠ Fome baixa!");
}
}, 3000);

// inicial
atualizar();