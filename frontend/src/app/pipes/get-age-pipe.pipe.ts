import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getAgePipe'
})
export class GetAgePipe implements PipeTransform {

  transform(dateString: string): string | undefined {
  if(dateString !== null && dateString !== undefined){
      let values = dateString?.split("-");
      let dia = parseInt(values[2]);
      let mes = parseInt(values[1]);
      let ano = parseInt(values[0]);
      let fecha_hoy = new Date();
      let ahora_ano = fecha_hoy.getFullYear();
      let ahora_mes = fecha_hoy.getMonth() + 1;
      let ahora_dia = fecha_hoy.getDate();
      let edad = (ahora_ano) - ano;
      if (ahora_mes < mes) {
          edad--;
      }
      if ((mes == ahora_mes) && (ahora_dia < dia)) {
          edad--;
      }
      if (edad > 1900) {
          edad -= 1900;
      }
      let meses = 0;
    
      if (ahora_mes > mes && dia > ahora_dia)
          meses = ahora_mes - mes - 1;
      else if (ahora_mes > mes)
          meses = ahora_mes - mes
      if (ahora_mes < mes && dia < ahora_dia)
          meses = 12 - (mes - ahora_mes);
      else if (ahora_mes < mes)
          meses = 12 - (mes - ahora_mes + 1);
      if (ahora_mes == mes && dia > ahora_dia)
          meses = 11;
    
      let dias = 0;
      if (ahora_dia > dia)
          dias = ahora_dia - dia;
      if (ahora_dia < dia) {
          let ultimoDiaMes = new Date(ahora_ano, ahora_mes - 1, 0);
          dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
      }
    
      if(edad === 0){
        return `${meses} M - ${dias} D`
      }
      return `${edad} A - ${meses} M - ${dias} D`
    }
  }

}
