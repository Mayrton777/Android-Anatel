import dados from './torre_teste.json';

function w_to_dBm(valor) {
    return 10 * Math.log10(valor * 1000);
}

function EIRP(ptx, gtx) {
    return ptx + gtx;
}

function dBm_to_w(valor) {
    return (10**(valor / 10)) / 1000;
}

function Slim(valor) {
    if (valor >= 2000) {
        return 10;
    } else {
        return valor / 200;
    }
}

function EIRP_Slim(eirp, slim) {
    return eirp / slim;
}

function calculo_R(valor) {
    let somatoria = 0;
    valor.forEach(dt => {
        const { FreqTxMHz: freq, GanhoAntena: gTx, PotenciaTransmissorWatts: pTx } = dt;
        
        let freqTx = parseFloat(freq);
        let gtx = parseFloat(gTx);
        let ptx = parseFloat(pTx);
    
        let ptxdBm = w_to_dBm(ptx);
        let eirp = ptxdBm + gtx;
        let eirpW = dBm_to_w(eirp);
        let slim = Slim(freqTx);
    
        let resultado = eirpW / slim;
        somatoria += resultado;
    });

    let result = somatoria / (4 * Math.PI);
    return Math.sqrt(result);
}

function TER(valor, raio) {
    let somatoria = 0;
    
    if (Array.isArray(valor)) {
        valor.forEach(dado => {
            const { FreqTxMHz: freq, GanhoAntena: gTx, PotenciaTransmissorWatts: pTx } = dado;
        
            let freqTx = parseFloat(freq);
            let gtx = parseFloat(gTx);
            let ptx = parseFloat(pTx);
                
            let ptxdBm = w_to_dBm(ptx);
            let eirp = ptxdBm + gtx;
            let eirpW = dBm_to_w(eirp);
            let slim = Slim(freqTx);
            
            let result = (eirpW / (4 * Math.PI * raio * raio)) / slim;
            somatoria += result;
        });
    } else {
        console.log("valor não é um array:", valor);
    }
    
    return somatoria;
}

function corRaio(cor) {
    if (cor > 1) {
        return [255, 0, 0];
    } else if (0.5 < cor && cor <= 1) {
        return [255, 69, 0];
    } else if (0.35 < cor && cor <= 0.5) {
        return [255, 165, 0];
    } else if (0.2 < cor && cor <= 0.35) {
        return [255, 223, 0];
    } else if (0.15 < cor && cor <= 0.2) {
        return [0, 128, 0];
    } else if (0.08 < cor && cor <= 0.15) {
        return [50, 205, 50];
    } else if (0.04 < cor && cor <= 0.08) {
        return [144, 238, 144];
    } else if (0.02 < cor && cor <= 0.04) {
        return [42, 80, 190];
    } else if (0.01 < cor && cor <= 0.02) {
        return [30, 144, 255];
    } else if (cor <= 0.01) {
        return [115, 194, 251];
    } else {
        console.log("ERROR VALOR DE COR");
    }
}

function filtrarCoresUnicas(listaCor) {
    let coresUnicas = [];
    let coresVistas = new Set();

    for (let item of listaCor) {
        let corString = item.cor.join(',');
        if (!coresVistas.has(corString)) {
            coresUnicas.push(item);
            coresVistas.add(corString);
        }
    }

    return coresUnicas;
}

function alcanceTorre(dados) {
    let listaCor = [];
    for (let i = -1; i < 130; i++) {
        let valor = dados;
        let raio = calculo_R(valor) + i;
        let cor = corRaio(TER(valor, raio));
        listaCor.push({ cor, raio });
    }
    return filtrarCoresUnicas(listaCor);
}

export { calculo_R, TER, alcanceTorre };
