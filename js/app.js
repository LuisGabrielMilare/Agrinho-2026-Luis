// Pontos iniciais do jogador
let pontos = 10;

// Função caso o aluno clique no botão ecológico
function escolhaBoa() {
    pontos = pontos + 5;
    
    // Atualiza os pontos na tela
    document.getElementById("pontos").innerText = pontos;
    
    // Muda o texto e a cor para o feedback positivo
    document.getElementById("texto-resultado").innerText = "Boa! As joaninhas comeram as pragas. O meio ambiente agradece e a plantação continuou forte!";
    document.getElementById("texto-resultado").style.color = "#2d6a4f";
}

// Função caso o aluno clique no botão poluente
function escolhaRuim() {
    pontos = pontos - 5;
    
    // Atualiza os pontos na tela
    document.getElementById("pontos").innerText = pontos;
    
    // Muda o texto e a cor para o feedback negativo
    document.getElementById("texto-resultado").innerText = "Poxa... O veneno matou as pragas, mas poluiu a água da fazenda e matou as abelhas.";
    document.getElementById("texto-resultado").style.color = "#b7094c";
}
