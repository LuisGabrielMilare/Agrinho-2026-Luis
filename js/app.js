let state = JSON.parse(localStorage.getItem("fazenda")) || {
x: 200,
y: 200,

agua: 100,
solo: 100,
fome: 100,
dinheiro: 100,
clima: "☀️"
};

// ---------------- IR PARA O JOGO ----------------
function startGame(){
location.href = "jogo.html";
}

// ---------------- PLAYER ----------------
const player = document.getElementById("player");

function updatePlayer(){
if(!player) return;

player.style.left = state.x + "px";
player.style.top = state.y + "px";
}

// ---------------- MOVIMENTO ----------------
document.addEventListener("keydown",(e)=>{

if(!player) return;

if(e.key === "w") state.y -= 15;
if(e.key === "s") state.y += 15;
if(e.key === "a") state.x -= 15;
if(e.key === "d") state.x += 15;

state.x = Math.max(0,state.x);
state.y = Math.max(0,state.y);

if(e.key === "e") interact();

updatePlayer();
});

// ---------------- INTERAÇÃO ----------------
function interact(){

let msg = "";

if(state.x > 450){
state.dinheiro += 20;
state.fome += 10;
msg = "🏪 Venda no mercado";
}

if(state.x < 200){
state.agua += 20;
msg = "💧 Água coletada";
}

if(state.x > 250 && state.x < 400){
msg = "🌱 Área de cultivo";
}

log(msg);
}

// ---------------- CLIMA ----------------
function clima(){

let c = ["☀️ Ensolarado","🌧️ Chuva","⛅ Nublado","🌩️ Tempestade"];
state.clima = c[Math.floor(Math.random()*c.length)];

if(state.clima.includes("🌧️")) state.agua += 10;
if(state.clima.includes("☀️")) state.agua -= 5;
if(state.clima.includes("🌩️")) state.solo -= 10;

}

// ---------------- HUD ----------------
function updateHUD(){

if(!document.getElementById("agua")) return;

document.getElementById("agua").innerText = state.agua;
document.getElementById("solo").innerText = state.solo;
document.getElementById("fome").innerText = state.fome;
document.getElementById("dinheiro").innerText = state.dinheiro;
document.getElementById("clima").innerText = state.clima;
}

// ---------------- LOG ----------------
function log(msg){
let el = document.getElementById("log");
if(el) el.innerText = msg || "Explorando a fazenda...";
}

// ---------------- LOOP ----------------
setInterval(()=>{

if(document.getElementById("hud")){
state.fome -= 1;
state.agua -= 1;
clima();
updateHUD();
save();
}

},4000);

// ---------------- SAVE ----------------
function save(){
localStorage.setItem("fazenda",JSON.stringify(state));
}

// init
updatePlayer();
updateHUD();