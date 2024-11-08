import { w_to_dBm, dBm_to_w } from "./converter";
import { ganho_gaussian } from "./gaussiano";
import { eirp, eirp_Slim } from "./calc_eirp";
import { slim } from "./calc_slim";

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
                    const { 
                        FreqTxMHz: freq,
                        GanhoAntena: gTx, 
                        PotenciaTransmissorWatts: pTx,
                        Azimute: azi,
                        AnguloElevacao: elev,
                        AnguloMeiaPotenciaAntena: meia
                    } = dt;

                    // Converte os valores de string para números
                    let freqTx = parseFloat(freq);
                    let gtx = parseFloat(gTx);
                    let ptx = parseFloat(pTx);
                    let azimute = parseFloat(azi);
                    let elevacao = parseFloat(elev);
                    let meia_pot = parseFloat(meia);

                    // Converte a potência de transmissão de Watts para dBm
                    let ptxdBm = w_to_dBm(ptx);
                    
                    // Calculando o ganha gaussiano
                    let ganho = gtx

                    // Calcula o EIRP
                    let vEIPR = eirp(ptxdBm, ganho);

                    // Converte o EIRP de dBm para Watts
                    let eirpW = dBm_to_w(vEIPR);

                    // Calcula o Slim com base na frequência
                    let vSlim = slim(freqTx);

                    // Calcula o resultado dividindo o EIRP pelo Slim e acumula na somatória
                    let resultado = eirp_Slim(eirpW, vSlim)
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
                    const { FreqTxMHz: freq,
                        GanhoAntena: gTx, 
                        PotenciaTransmissorWatts: pTx,
                        Azimute: azi,
                        AnguloElevacao: elev,
                        AnguloMeiaPotenciaAntena: meia 
                    } = dado;

                    // Converte os valores de string para números
                    let freqTx = parseFloat(freq);
                    let gtx = parseFloat(gTx);
                    let ptx = parseFloat(pTx);
                    let azimute = parseFloat(azi);
                    let elevacao = parseFloat(elev);
                    let meia_pot = parseFloat(meia);
                    
                    // Converte a potência de transmissão de Watts para dBm
                    let ptxdBm = w_to_dBm(ptx);

                    // Calculando o ganha gaussiano
                    let ganho = gtx

                    // Calcula o EIRP
                    let vEIRP = eirp(ptxdBm, ganho);

                    // Converte o EIRP de dBm para Watts
                    let eirpW = dBm_to_w(vEIRP);

                    // Calcula o Slim com base na frequência
                    let vSlim = slim(freqTx);
                    
                    // Calcula o resultado dividindo o EIRP pelo Slim e pelo raio ao quadrado
                    let result = (eirpW / (4 * Math.PI * raio * raio)) / vSlim;

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
