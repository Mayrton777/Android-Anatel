// Função para calcular a Potência Isotrópica Radiada Equivalente (EIRP) somando a potência do transmissor e o ganho da antena
export function eirp(ptx, gtx) {
    return ptx + gtx;  // Retorna a soma da potência de transmissão e o ganho da antena
}

// Função para calcular o EIRP ajustado pelo fator Slim
export function eirp_Slim(eirp, slim) {
    return eirp / slim;  // Divide o EIRP pelo Slim para obter o EIRP ajustado
}
