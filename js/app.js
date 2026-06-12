const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 400,
    y: 300,
    width: 40,
    height: 40,
    color: 'blue',
    speed: 2,
    hunger: 100
};

let keys = {};
let madeira = 0;
let pedra = 0;

// Objetos para coleta
const recursos = [
    {x: 200, y: 200, type: 'madeira', collected: false},
    {x: 600, y: 400, type: 'pedra', collected: false}
];

// Eventos de movimento
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Atualizar jogo
function update() {
    // Reduz fome gradualmente
    player.hunger -= 0.02;
    if(player.hunger < 0) player.hunger = 0;

    // Velocidade reduzida se fome
    const speed = player.hunger < 30 ? player.speed / 2 : player.speed;

    // Movimento
    if(keys['w'] || keys['ArrowUp']) player.y -= speed;
    if(keys['s'] || keys['ArrowDown']) player.y += speed;
    if(keys['a'] || keys['ArrowLeft']) player.x -= speed;
    if(keys['d'] || keys['ArrowRight']) player.x += speed;

    // Coleta de recursos
    recursos.forEach(r => {
        if(!r.collected && Math.abs(player.x - r.x) < 20 && Math.abs(player.y - r.y) < 20) {
            if(r.type === 'madeira' && keys['m']) {
                madeira += 1;
                r.collected = true;
            }
            if(r.type === 'pedra' && keys['p']) {
                pedra += 1;
                r.collected = true;
            }
        }
    });

    // Atualizar HUD
    document.getElementById('fome').textContent = Math.floor(player.hunger);
    document.getElementById('madeira').textContent = madeira;
    document.getElementById('pedra').textContent = pedra;
}

// Renderizar jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Recursos
    recursos.forEach(r => {
        if(!r.collected) {
            ctx.fillStyle = r.type === 'madeira' ? 'brown' : 'gray';
            ctx.fillRect(r.x, r.y, 30, 30);
        }
    });
}

// Loop principal
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();