const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado do Jogador
const player = {
    x: 100,
    y: 100,
    width: 30,
    height: 30,
    speed: 4,
    moedas: 100,
    alimentos: 5,
    madeira: 0,
    pedra: 0,
    fome: 100,
    temMachado: false,
    temPicareta: false
};

// Teclas pressionadas
const keys = {};

// Elementos do Mundo (X, Y, Largura, Altura, Tipo)
const elementos = [
    { x: 300, y: 100, w: 40, h: 40, tipo: 'arvore', cor: '#228B22' },
    { x: 500, y: 300, w: 40, h: 40, tipo: 'pedra', cor: '#808080' },
    { x: 150, y: 350, w: 50, h: 50, tipo: 'bancada_ferramentas', cor: '#d35400' },
    { x: 600, y: 100, w: 50, h: 50, tipo: 'bancada_construcao', cor: '#2980b9' }
];

// Estruturas construídas pelo jogador serão salvas aqui
const construcoes = [];

// Ouvintes de teclado
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Sistema de Fome (Diminui a cada 3 segundos)
setInterval(() => {
    if (player.fome > 0) {
        player.fome -= 2;
        if (player.fome < 0) player.fome = 0;
    }
    
    // Mecânica de falência se a fome zerar e não tiver dinheiro/comida
    if (player.fome === 0 && player.alimentos === 0 && player.moedas < 15) {
        alert("Sua fazenda faliu por falta de recursos! Recarregando...");
        window.location.reload();
    }
    atualizarHUD();
}, 3000);

function atualizarHUD() {
    document.getElementById("moedas").innerText = player.moedas;
    document.getElementById("alimentos").innerText = player.alimentos;
    document.getElementById("madeira").innerText = player.madeira;
    document.getElementById("pedra").innerText = player.pedra;
    document.getElementById("fome").innerText = player.fome;
}

// Verificar colisão simples entre dois retângulos
function verificarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.h &&
           rect1.y + rect1.height > rect2.y;
}

// Funções das ações das Bancadas
function comprarFerramenta(tipo) {
    if (player.moedas >= 20) {
        if (tipo === 'machado' && !player.temMachado) {
            player.temMachado = true;
            player.moedas -= 20;
            alert("Você comprou um Machado! Agora pode coletar Árvores.");
        } else if (tipo === 'picareta' && !player.temPicareta) {
            player.temPicareta = true;
            player.moedas -= 20;
            alert("Você comprou uma Picareta! Agora pode coletar Pedras.");
        } else {
            alert("Você já possui essa ferramenta!");
        }
    } else {
        alert("Moedas insuficientes!");
    }
    atualizarHUD();
}

function construirEstrutura(tipo) {
    if (tipo === 'parede') {
        if (player.madeira >= 5 && player.pedra >= 5) {
            player.madeira -= 5;
            player.pedner -= 5; // correção visual de digitação abaixo: player.pedra
            player.pedra -= 5;
            construcoes.push({ x: player.x + 40, y: player.y, w: 20, h: 40, tipo: 'parede', cor: '#a1887f' });
            alert("Parede construída no mapa!");
        } else {
            alert("Materiais insuficientes para parede!");
        }
    } else if (tipo === 'porta') {
        if (player.madeira >= 10) {
            player.madeira -= 10;
            construcoes.push({ x: player.x + 40, y: player.y, w: 20, h: 40, tipo: 'porta', cor: '#e67e22' });
            alert("Porta construída no mapa!");
        } else {
            alert("Madeira insuficiente para porta!");
        }
    }
    atualizarHUD();
}

function venderAlimento() {
    if (player.alimentos > 0) {
        player.alimentos--;
        player.moedas += 15;
    } else {
        alert("Sem alimentos para vender!");
    }
    atualizarHUD();
}

function comerAlimento() {
    if (player.alimentos > 0) {
        if (player.fome >= 100) {
            alert("Você já está cheio!");
            return;
        }
        player.alimentos--;
        player.fome = Math.min(100, player.fome + 20);
    } else {
        alert("Você não tem comida!");
    }
    atualizarHUD();
}

// Atualização dos movimentos e interações do Jogo
function update() {
    // Reduz velocidade se estiver com fome (Mecânica solicitada)
    let velocidadeAtual = player.fome < 20 ? player.speed / 2 : player.speed;

    let proximoX = player.x;
    let proximoY = player.y;

    if (keys["w"] || keys["arrowup"]) proximoY -= velocidadeAtual;
    if (keys["s"] || keys["arrowdown"]) proximoY += velocidadeAtual;
    if (keys["a"] || keys["arrowleft"]) proximoX -= velocidadeAtual;
    if (keys["d"] || keys["arrowright"]) proximoX += velocidadeAtual;

    // Limites da tela
    if (proximoX >= 0 && proximoX <= canvas.width - player.width) player.x = proximoX;
    if (proximoY >= 0 && proximoY <= canvas.height - player.height) player.y = proximoY;

    // Controlar visibilidade dos menus das bancadas
    let pertoBancadaFerramentas = false;
    let pertoBancadaConstrucao = false;

    elementos.forEach(elem => {
        if (verificarColisao(player, elem)) {
            if (elem.tipo === 'bancada_ferramentas') pertoBancadaFerramentas = true;
            if (elem.tipo === 'bancada_construcao') pertoBancadaConstrucao = true;

            // Coleta de recursos automática se tiver a ferramenta correta
            if (elem.tipo === 'arvore' && player.temMachado) {
                player.madeira += 1;
                elem.x = Math.random() * (canvas.width - 50);
                elem.y = Math.random() * (canvas.height - 50);
                atualizarHUD();
            }
            if (elem.tipo === 'pedra' && player.temPicareta) {
                player.pedra += 1;
                elem.x = Math.random() * (canvas.width - 50);
                elem.y = Math.random() * (canvas.height - 50);
                atualizarHUD();
            }
        }
    });

    // Mostrar/esconder menus baseados na proximidade
    document.getElementById("bancada-ferramentas").classList.toggle("escondido", !pertoBancadaFerramentas);
    document.getElementById("bancada-construcao").classList.toggle("escondido", !pertoBancadaConstrucao);
}

// Renderização dos gráficos no Canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Elementos Fixos (Árvores, Pedras, Bancadas)
    elementos.forEach(elem => {
        ctx.fillStyle = elem.cor;
        ctx.fillRect(elem.x, elem.y, elem.w, elem.h);
        
        // Texto identificador em cima das bancadas
        if(elem.tipo.startsWith('bancada')) {
            ctx.fillStyle = "white";
            ctx.font = "12px sans-serif";
            ctx.fillText("Bancada", elem.x, elem.y - 5);
        }
    });

    // Desenhar Estruturas construídas pelo jogador
    construcoes.forEach(construcao => {
        ctx.fillStyle = construcao.cor;
        ctx.fillRect(construcao.x, construcao.y, construcao.w, construcao.h);
    });

    // Desenhar o Jogador (Fazendeiro)
    ctx.fillStyle = "#e74c3c"; // Vermelho
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Loop Principal do Jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicializa o HUD e roda o game
atualizarHUD();
gameLoop();