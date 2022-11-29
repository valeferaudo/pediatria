import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateString'
})
export class DateStringPipe implements PipeTransform {

  transform(date: any): string | undefined {
    let newText = ''
    switch (date) {
      case 'January':
        newText = 'Enero'
        break;
      case 'February':
        newText = 'Febrero'
        break;
      case 'March':
        newText = 'Marzo'
        break;
      case 'April':
        newText = 'Abril'
        break;
      case 'May':
        newText = 'Mayo'
        break;
      case 'June':
        newText = 'Junio'
        break;
      case 'July':
        newText = 'Julio'
        break;
      case 'August':
        newText = 'Agosto'
        break;
      case 'September':
        newText = 'Septiembre'
        break;
      case 'October':
        newText = 'Octubre'
        break;
      case 'November':
        newText = 'Noviembre'
        break;
      case 'December':
        newText = 'Diciembre'
        break;
    }
    return newText;
  }

}
