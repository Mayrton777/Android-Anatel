// Função para converter potência em Watts para dBm
function w_to_dBm(valor) {
    return 10 * Math.log10(valor * 1000);  // Converte a potência de Watts para miliwatts e aplica a fórmula para dBm
}

// Função para calcular a Potência Isotrópica Radiada Equivalente (EIRP) somando a potência do transmissor e o ganho da antena
function EIRP(ptx, gtx) {
    return ptx + gtx;  // Retorna a soma da potência de transmissão e o ganho da antena
}

// Função para converter dBm para Watts
function dBm_to_w(valor) {
    return (10 ** (valor / 10)) / 1000;  // Converte dBm para miliwatts e depois para Watts
}

// Função para calcular o fator de atenuação Slim com base na frequência de transmissão
function Slim(valor) {
    if (valor >= 2000) {  // Se a frequência for maior ou igual a 2000 MHz, retorna 10
        return 10;
    } else {  // Caso contrário, divide a frequência por 200
        return valor / 200;
    }
}

// Função para calcular o EIRP ajustado pelo fator Slim
function EIRP_Slim(eirp, slim) {
    return eirp / slim;  // Divide o EIRP pelo Slim para obter o EIRP ajustado
}

// Função para calcular o raio de alcance com base nos dados fornecidos
function calculo_R(valor) {
    let somatoria = 0;

    // Verifica se o valor é um array
    if (Array.isArray(valor)) {
        // Itera sobre o array principal
        valor.forEach(subArray => {
            // Verifica se o subArray é um array
            if (Array.isArray(subArray)) {
                // Itera sobre o subArray
                subArray.forEach(dt => {
                    const { FreqTxMHz: freq, GanhoAntena: gTx, PotenciaTransmissorWatts: pTx } = dt;

                    // Converte os valores de string para números
                    let freqTx = parseFloat(freq);
                    let gtx = parseFloat(gTx);
                    let ptx = parseFloat(pTx);

                    // Converte a potência de transmissão de Watts para dBm
                    let ptxdBm = w_to_dBm(ptx);

                    // Calcula o EIRP
                    let eirp = ptxdBm + gtx;

                    // Converte o EIRP de dBm para Watts
                    let eirpW = dBm_to_w(eirp);

                    // Calcula o Slim com base na frequência
                    let slim = Slim(freqTx);

                    // Calcula o resultado dividindo o EIRP pelo Slim e acumula na somatória
                    let resultado = eirpW / slim;
                    somatoria += resultado;
                });
            } else {
                console.error("Elemento de valor não é um array:", subArray);
            }
        });
    } else {
        console.error("Valor não é um array:", valor);
        return 0;  // Retorna 0 como valor padrão se o valor não for um array
    }

    // Divide a somatória pelo fator 4π e retorna a raiz quadrada do resultado
    let result = somatoria / (4 * Math.PI);
    return Math.sqrt(result);
}

// Função para calcular a Taxa de Exposição de Radiação (TER)
function TER(valor, raio) {
    let somatoria = 0;
    
    // Verifica se o valor é um array
    if (Array.isArray(valor)) {
        // Itera sobre o array principal
        valor.forEach(subArray => {
            // Verifica se o subArray é um array
            if (Array.isArray(subArray)) {
                // Itera sobre o subArray
                subArray.forEach(dado => {
                    const { FreqTxMHz: freq, GanhoAntena: gTx, PotenciaTransmissorWatts: pTx } = dado;

                    // Converte os valores de string para números
                    let freqTx = parseFloat(freq);
                    let gtx = parseFloat(gTx);
                    let ptx = parseFloat(pTx);
                    
                    // Converte a potência de transmissão de Watts para dBm
                    let ptxdBm = w_to_dBm(ptx);

                    // Calcula o EIRP
                    let eirp = ptxdBm + gtx;

                    // Converte o EIRP de dBm para Watts
                    let eirpW = dBm_to_w(eirp);

                    // Calcula o Slim com base na frequência
                    let slim = Slim(freqTx);
                    
                    // Calcula o resultado dividindo o EIRP pelo Slim e pelo raio ao quadrado
                    let result = (eirpW / (4 * Math.PI * raio * raio)) / slim;

                    // Acumula o resultado na somatória
                    somatoria += result;
                });
            } else {
                console.error("Elemento de valor não é um array:", subArray);
            }
        });
    } else {
        console.log("Valor não é um array:", valor);
    }
    
    // Retorna a somatória dos valores calculados
    return somatoria;
}

// Função para determinar a cor com base no valor de TER
function corRaio(cor) {
    // Retorna a cor correspondente ao intervalo de valores de TER
    if (cor > 1) {
        return [255, 0, 0];  // Vermelho
    } else if (0.5 < cor && cor <= 1) {
        return [255, 69, 0];  // Laranja avermelhado
    } else if (0.35 < cor && cor <= 0.5) {
        return [255, 165, 0];  // Laranja
    } else if (0.2 < cor && cor <= 0.35) {
        return [255, 223, 0];  // Amarelo claro
    } else if (0.15 < cor && cor <= 0.2) {
        return [0, 128, 0];  // Verde
    } else if (0.08 < cor && cor <= 0.15) {
        return [50, 205, 50];  // Verde claro
    } else if (0.04 < cor && cor <= 0.08) {
        return [144, 238, 144];  // Verde mais claro
    } else if (0.02 < cor && cor <= 0.04) {
        return [42, 80, 190];  // Azul escuro
    } else if (0.01 < cor && cor <= 0.02) {
        return [30, 144, 255];  // Azul
    } else if (cor <= 0.01) {
        return [115, 194, 251];  // Azul claro
    } else {
        console.log("ERROR VALOR DE COR");  // Caso nenhum valor se enquadre, retorna um erro
    }
}

// Função para filtrar e retornar apenas cores únicas da lista
function filtrarCoresUnicas(listaCor) {
    let coresUnicas = [];
    let coresVistas = new Set();

    // Itera sobre a lista de cores
    for (let item of listaCor) {
        if (item.cor && Array.isArray(item.cor)) {
            let corString = item.cor.join(',');  // Converte a cor para string

            // Se a cor ainda não foi vista, adiciona à lista de cores únicas
            if (!coresVistas.has(corString)) {
                coresUnicas.push(item);
                coresVistas.add(corString);  // Marca a cor como vista
            }
        } else {
            console.log("Cor indefinida ou não é um array:", item.cor);  // Caso a cor esteja indefinida ou não seja um array
        }
    }

    return coresUnicas;  // Retorna a lista de cores únicas
}

// Função para calcular o alcance das torres e determinar a cor correspondente
function alcanceTorre(dados) {
    let listaCor = [];

    // Itera de -1 até 130 para calcular diferentes raios
    for (let i = -1; i < 130; i++) {
        let valor = dados;

        // Calcula o raio com base no valor e no índice
        let raio = calculo_R(valor) + i;

        // Calcula o TER com base no raio
        let ter = TER(valor, raio);

        // Converte o TER para porcentagem
        let ter_por = Math.round(ter * 100);

        // Determina a cor correspondente ao TER
        let cor = corRaio(ter);

        // Adiciona o resultado à lista de cores
        listaCor.push({ cor, raio, ter_por });
    }
    
    // Filtra e retorna apenas as cores únicas da lista
    return filtrarCoresUnicas(listaCor);
}

// Exporta as funções principais para uso em outros módulos
export { calculo_R, TER, alcanceTorre };
