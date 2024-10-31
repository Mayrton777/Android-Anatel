// Função para calcular o ganho da antena em dBm
export function ganho_gaussian(ganho, az, az_z, el, el_z, meia) {
    let resultado;
    if(az_z == 0){
        if(az > 180){
            az -= 360;
        }
        resultado = ganho - 12 * (((el - el_z) / 7)**2 + ((az - az_z) / meia)**2);
        if(resultado > 0){
            return resultado;
        } else {
            return 0;
        }
    } else {
        az -= az_z;
        az_z -= az_z;
        if(az > 180){
            az -= 360;
        }
        resultado = ganho - 12 * (((el - el_z) / 7)**2 + ((az - az_z) / meia)**2);
        if(resultado > 0){
            return resultado;
        } else {
            return 0;
        }
    }
}
