const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado do Jogador com física melhorada
const player = {
    x: 100,
    y: 100,
    width: 24,
    height: 32,
    speed: 3.5,
    moedas: 100,
    alimentos: 5,
    madeira: 0,
    pedra: 0,
    fome: 100,
    temMachado: false,
    temPicareta: false
};

const keys = {};

// Elementos do cenário com propriedades visuais detalhadas
const elementos = [
    { x: 350, y: 120, w: 50, h: 60, tipo: 'arvore' },
    { x: 200, y: 280, w: 50, h: 60, tipo: 'arvore' },
    { x: 550, y: 320, w: 45, h: 40, tipo: 'pedra' },
    { x: 680, y: 150, w: 45, h: 40, tipo: 'pedra' },
    { x: 80, y: 380, w: 60, h: 45, tipo: 'bancada_ferramentas', nome: '🛠️ Ferramentas' },
    { x: 650, y: 40, w: 60, h: 45, tipo: 'bancada_construcao', nome: '🏗️ Construção' }
];

const construcoes = [];

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Ciclo de Fome e Mecânica de Falência
setInterval(() => {
    if (player.fome > 0) {
        player.fome -= 3;
        if (player.fome < 0) player.fome = 0;
    }
    
    if (player.fome === 0 && player.alimentos === 0 && player.moedas < 15) {
        alert("Sua fazenda faliu! Você ficou sem energia e sem capital para girar os negócios.");
        window.location.reload();
    }
    atualizarHUD();
}, 2500);

function atualizarHUD() {
    document.getElementById("moedas").innerText = player.moedas;
    document.getElementById("alimentos").innerText = player.alimentos;
    document.getElementById("madeira").innerText = player.madeira;
    document.getElementById("pedra").innerText = player.pedra;
    document.getElementById("fome").innerText = player.fome;
}

// Detecção de colisão AABB (Afastamento de caixas)
function verificarColisao(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.h &&
           obj1.y + obj1.height > obj2.y;
}

// Lógica de Compra e Manufatura
function comprarFerramenta(tipo) {
    if (player.moedas >= 20) {
        if (tipo === 'machado' && !player.temMachado) {
            player.temMachado = true;
            player.moedas -= 20;
        } else if (tipo === 'picareta' && !player.temPicareta) {
            player.temPicareta = true;
            player.moedas -= 20;
        } else {
            alert("Você já tem essa ferramenta montada!");
            return;
        }
    } else {
        alert("Grana insuficiente!");
    }
    atualizarHUD();
}

function construirEstrutura(tipo) {
    if (tipo === 'parede') {
        if (player.madeira >= 5 && player.pedra >= 5) {
            player.madeira -= 5;
            player.pedra -= 5;
            construcoes.push({ x: player.x + 35, y: player.y, w: 32, h: 32, tipo: 'parede' });
        } else {
            alert("Materiais insuficientes.");
        }
    } else if (tipo === 'porta') {
        if (player.madeira >= 10) {
            player.madeira -= 10;
            construcoes.push({ x: player.x + 35, y: player.y, w: 32, h: 32, tipo: 'porta' });
        } else {
            alert("Madeira insuficiente.");
        }
    }
    atualizarHUD();
}

function venderAlimento() {
    if (player.alimentos > 0) {
        player.alimentos--;
        player.moedas += 15;
    }
    atualizarHUD();
}

function comerAlimento() {
    if (player.alimentos > 0) {
        if (player.fome >= 100) return;
        player.alimentos--;
        player.fome = Math.min(100, player.fome + 25);
    }
    atualizarHUD();
}

// Atualização de física e colisões realistas
function update() {
    // Penalidade real de velocidade por fome (exaustão física)
    let vel = player.fome < 25 ? player.speed * 0.45 : player.speed;

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy = -vel;
    if (keys["s"] || keys["arrowdown"]) dy = vel;
    if (keys["a"] || keys["arrowleft"]) dx = -vel;
    if (keys["d"] || keys["arrowright"]) dx = vel;

    // Movimentação com checagem de colisão por eixo para impedir travamentos
    player.x += dx;
    elementos.concat(construcoes).forEach(obj => {
        if (verificarColisao(player, obj)) {
            player.x -= dx; // Desfaz movimento se colidir no eixo X
            interagirComObjeto(obj);
        }
    });

    player.y += dy;
    elementos.concat(construcoes).forEach(obj => {
        if (verificarColisao(player, obj)) {
            player.y -= dy; // Desfaz movimento se colidir no eixo Y
            interagirComObjeto(obj);
        }
    });

    // Limites do mapa
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Monitorar proximidade com as bancadas de trabalho
    let pertoFerramentas = elementos.some(e => e.tipo === 'bancada_ferramentas' && Math.abs(player.x - e.x) < 60 && Math.abs(player.y - e.y) < 60);
    let pertoConstrucao = elementos.some(e => e.tipo === 'bancada_construcao' && Math.abs(player.x - e.x) < 60 && Math.abs(player.y - e.y) < 60);

    document.getElementById("bancada-ferramentas").classList.toggle("escondido", !pertoFerramentas);
    document.getElementById("bancada-construcao").classList.toggle("escondido", !pertoConstrucao);
}

function interagirComObjeto(obj) {
    if (obj.tipo === 'arvore' && player.temMachado) {
        player.madeira += 2;
        // Respawn em local aleatório simulando nova árvore crescendo
        obj.x = Math.random() * (canvas.width - 80) + 40;
        obj.y = Math.random() * (canvas.height - 80) + 40;
        atualizarHUD();
    }
    if (obj.tipo === 'pedra' && player.temPicareta) {
        player.pedra += 2;
        obj.x = Math.random() * (canvas.width - 80) + 40;
        obj.y = Math.random() * (canvas.height - 80) + 40;
        atualizarHUD();
    }
}

// Renderização Gráfica Realista (Estilo Pixel Art Sólido)
function draw() {
    // Fundo - Gramado com detalhes de terra
    ctx.fillStyle = "#55b664";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Detalhes da grama
    ctx.fillStyle = "#4ca359";
    for(let i = 0; i < canvas.width; i += 80) {
        for(let j = 0; j < canvas.height; j += 60) {
            ctx.fillRect(i + (j%2*20), j, 4, 4);
        }
    }

    // Desenhar Elementos do Cenário
    elementos.forEach(elem => {
        if (elem.tipo === 'arvore') {
            // Tronco
            ctx.fillStyle = "#6d4c41";
            ctx.fillRect(elem.x + elem.w/2 - 6, elem.y + elem.h - 25, 12, 25);
            // Copa das árvores (Camadas de folhas)
            ctx.fillStyle = "#1b5e20";
            ctx.beginPath();
            ctx.arc(elem.x + elem.w/2, elem.y + 25, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#2e7d32";
            ctx.beginPath();
            ctx.arc(elem.x + elem.w/2 - 5, elem.y + 20, 18, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (elem.tipo === 'pedra') {
            // Rocha com relevos de sombra
            ctx.fillStyle = "#757575";
            ctx.beginPath();
            ctx.ellipse(elem.x + elem.w/2, elem.y + elem.h/2, elem.w/2, elem.h/2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = "#9e9e9e"; // Luz na pedra
            ctx.beginPath();
            ctx.ellipse(elem.x + elem.w/2 - 4, elem.y + elem.h/2 - 4, elem.w/3, elem.h/4, 0, 0, Math.PI*2);
            ctx.fill();
        } 
        else if (elem.tipo.startsWith('bancada')) {
            // Mesas de Trabalho de Madeira Escura
            ctx.fillStyle = "#4e342e";
            ctx.fillRect(elem.x, elem.y, elem.w, elem.h);
            ctx.fillStyle = "#d7ccc8"; // Tampo de ferro/detalhe
            ctx.fillRect(elem.x + 4, elem.y + 4, elem.w - 8, 8);
            
            // Texto indicador incorporado no chão de jogo
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(elem.nome, elem.x - 5, elem.y - 8);
        }
    });

    // Desenhar Construções feitas pelo jogador
    construcoes.forEach(c => {
        if (c.tipo === 'parede') {
            // Tijolos estruturais
            ctx.fillStyle = "#b0bec5";
            ctx.fillRect(c.x, c.y, c.w, c.h);
            ctx.fillStyle = "#78909c"; // Linhas de argamassa realista
            ctx.strokeRect(c.x, c.y, c.w, c.h);
            ctx.fillRect(c.x, c.y + 10, c.w, 3);
            ctx.fillRect(c.x, c.y + 20, c.w, 3);
        } else if (c.tipo === 'porta') {
            // Porta de Madeira com maçaneta
            ctx.fillStyle = "#a1887f";
            ctx.fillRect(c.x, c.y, c.w, c.h);
            ctx.fillStyle = "#5d4037";
            ctx.strokeRect(c.x, c.y, c.w, c.h);
            // Maçaneta dourada
            ctx.fillStyle = "#ffd54f";
            ctx.beginPath();
            ctx.arc(c.x + c.w - 6, c.y + c.h/2, 3, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // Desenhar o Personagem (Fazendeiro com roupas estilizadas)
    // Corpo/Macacão
    ctx.fillStyle = "#0d47a1"; // Azul escuro
    ctx.fillRect(player.x, player.y + 12, player.width, player.height - 12);
    // Camisa
    ctx.fillStyle = "#e53935"; // Vermelho
    ctx.fillRect(player.x, player.y + 6, player.width, 8);
    // Cabeça/Pele
    ctx.fillStyle = "#ffcc80";
    ctx.fillRect(player.x + 4, player.y, player.width - 8, 8);
    // Chapéu de Palha do Agrinho
    ctx.fillStyle = "#ffb300";
    ctx.fillRect(player.x - 2, player.y, player.width + 4, 3); // Aba
    ctx.fillRect(player.x + 4, player.y - 4, player.width - 8, 4); // Topo
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicialização da partida
atualizarHUD();
gameLoop();