// Função para converter potência em Watts para dBm
export function w_to_dBm(valor) {
    return 10 * Math.log10(valor * 1000);  // Converte a potência de Watts para miliwatts e aplica a fórmula para dBm
}

// Função para converter dBm para Watts
export function dBm_to_w(valor) {
    return (10 ** (valor / 10)) / 1000;  // Converte dBm para miliwatts e depois para Watts
}