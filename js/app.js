// Mensagem no console
console.log("Ouvidoria-CECEM carregada com sucesso!");

// Seleciona o formulário
const formulario = document.querySelector("form");

// Evento de envio
formulario.addEventListener("submit", function(event){

    // Impede recarregar a página
    event.preventDefault();

    // Captura os dados
    const nome = document.getElementById("nome").value;

    // Mensagem
    alert(`Obrigado pela mensagem, ${nome}!`);

});