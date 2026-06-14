let dinheiro = 50;
let fome = 100;
let madeira = 0;
let pedra = 0;
let comida = 0;
let semente = 0;

let ferramenta = false;
let casa = 1;

let x = 350;
let y = 220;
let velocidade = 6;

let jogador = document.getElementById("jogador");
let mapa = document.getElementById("mapa");

function mostrar() {
  document.getElementById("dinheiro").innerText = dinheiro;
  document.getElementById("fome").innerText = fome;
  document.getElementById("madeira").innerText = madeira;
  document.getElementById("pedra").innerText = pedra;
  document.getElementById("comida").innerText = comida;

  if (fome <= 30) {
    velocidade = 3;
  } else {
    velocidade = 6;
  }
}

function aviso(texto) {
  document.getElementById("aviso").innerText = texto;
}

function atualizarJogador() {
  jogador.style.left = x + "px";
  jogador.style.top = y + "px";
}

document.addEventListener("keydown", function(evento) {
  let tecla = evento.key.toLowerCase();

  if (tecla == "w") y -= velocidade;
  if (tecla == "s") y += velocidade;
  if (tecla == "a") x -= velocidade;
  if (tecla == "d") x += velocidade;

  if (tecla == "e") coletar();

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > 720) x = 720;
  if (y > 450) y = 450;

  atualizarJogador();
});

function criarItem(tipo, simbolo) {
  let item = document.createElement("div");

  item.className = "item";
  item.innerText = simbolo;
  item.setAttribute("data-tipo", tipo);

  item.style.left = Math.floor(Math.random() * 700) + "px";
  item.style.top = Math.floor(Math.random() * 430) + "px";

  mapa.appendChild(item);
}

function criarMapa() {
  for (let i = 0; i < 6; i++) criarItem("arvore", "🌳");
  for (let i = 0; i < 5; i++) criarItem("pedra", "🪨");
  for (let i = 0; i < 7; i++) criarItem("graveto", "🪵");
  for (let i = 0; i < 6; i++) criarItem("pedrinha", "▫");
  for (let i = 0; i < 5; i++) criarItem("comida", "🥕");
}

function coletar() {
  let itens = document.querySelectorAll(".item");

  for (let i = 0; i < itens.length; i++) {
    let item = itens[i];

    let itemX = parseInt(item.style.left);
    let itemY = parseInt(item.style.top);

    let distancia = Math.abs(x - itemX) + Math.abs(y - itemY);

    if (distancia < 60) {
      let tipo = item.getAttribute("data-tipo");

      if (tipo == "graveto") {
        madeira++;
        item.remove();
        aviso("Você pegou madeira.");
      }

      else if (tipo == "pedrinha") {
        pedra++;
        item.remove();
        aviso("Você pegou pedra.");
      }

      else if (tipo == "comida") {
        comida++;
        item.remove();
        aviso("Você pegou comida.");
      }

      else if (tipo == "arvore") {
        if (ferramenta) {
          madeira += 4;
          item.remove();
          aviso("Você cortou uma árvore.");
        } else {
          aviso("Precisa de ferramenta.");
        }
      }

      else if (tipo == "pedra") {
        if (ferramenta) {
          pedra += 3;
          item.remove();
          aviso("Você quebrou uma pedra.");
        } else {
          aviso("Precisa de ferramenta.");
        }
      }

      mostrar();
      return;
    }
  }

  aviso("Não tem nada perto para coletar.");
}

function comer() {
  if (comida > 0) {
    comida--;
    fome += 20;
    if (fome > 100) fome = 100;
    aviso("Você comeu.");
  } else {
    aviso("Você não tem comida.");
  }

  mostrar();
}

function vender() {
  if (comida > 0) {
    dinheiro += comida * 10;
    comida = 0;
    aviso("Você vendeu comida.");
  } else {
    aviso("Você não tem comida para vender.");
  }

  mostrar();
}

function comprarSemente() {
  if (dinheiro >= 10) {
    dinheiro -= 10;
    semente++;
    aviso("Você comprou uma semente.");
  } else {
    aviso("Sem dinheiro.");
  }

  mostrar();
}

function plantar() {
  if (semente > 0) {
    semente--;
    criarItem("arvore", "🌳");
    aviso("Você plantou uma árvore.");
  } else {
    aviso("Você não tem semente.");
  }

  mostrar();
}

function fazerFerramenta() {
  if (madeira >= 3 && pedra >= 2) {
    madeira -= 3;
    pedra -= 2;
    ferramenta = true;
    aviso("Ferramenta criada.");
  } else {
    aviso("Precisa de 3 madeiras e 2 pedras.");
  }

  mostrar();
}

function melhorarCasa() {
  if (madeira >= 8 && pedra >= 4 && dinheiro >= 20) {
    madeira -= 8;
    pedra -= 4;
    dinheiro -= 20;
    casa++;
    aviso("Casa melhorada para nível " + casa + ".");
  } else {
    aviso("Precisa de madeira, pedra e dinheiro.");
  }

  mostrar();
}

function cozinhar() {
  if (comida >= 1 && madeira >= 1) {
    madeira--;
    comida += 2;
    aviso("Você preparou alimento.");
  } else {
    aviso("Precisa de comida e madeira.");
  }

  mostrar();
}

function comprarTrator() {
  if (dinheiro >= 200) {
    dinheiro -= 200;
    aviso("Você comprou um trator.");
  } else {
    aviso("Ainda falta dinheiro para o trator.");
  }

  mostrar();
}

function eventoNatural() {
  let numero = Math.floor(Math.random() * 3);

  if (numero == 0) {
    criarItem("comida", "🥕");
    aviso("Choveu e nasceu comida.");
  }

  if (numero == 1) {
    fome -= 5;
    aviso("A seca atrapalhou sua fazenda.");
  }

  if (numero == 2) {
    criarItem("pedrinha", "▫");
    aviso("Novas pedras apareceram.");
  }

  mostrar();
}

function verificarDerrota() {
  if (fome <= 0) {
    fimDeJogo("Você ficou sem fome.");
  }

  if (dinheiro <= 0 && comida <= 0 && madeira <= 0 && pedra <= 0) {
    fimDeJogo("Você ficou sem dinheiro e sem recursos.");
  }
}

function fimDeJogo(motivo) {
  document.getElementById("fim").style.display = "block";
  document.getElementById("motivo").innerText = motivo;
}

setInterval(function() {
  fome -= 1;
  verificarDerrota();
  mostrar();
}, 3000);

setInterval(function() {
  criarItem("graveto", "🪵");
  criarItem("pedrinha", "▫");
}, 8000);

setInterval(function() {
  eventoNatural();
}, 12000);

criarMapa();
mostrar();
atualizarJogador();