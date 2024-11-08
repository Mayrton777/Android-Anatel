// Função para calcular o fator de atenuação Slim com base na frequência de transmissão
export function slim(valor) {
    if (valor >= 2000) {  // Se a frequência for maior ou igual a 2000 MHz, retorna 10
        return 10;
    } else {  // Caso contrário, divide a frequência por 200
        return valor / 200;
    }
}