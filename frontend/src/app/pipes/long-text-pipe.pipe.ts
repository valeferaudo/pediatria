import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longTextPipe'
})
export class LongTextPipePipe implements PipeTransform {

  transform(longText: any): string | undefined {
    if(longText.length < 80){
      return longText;
    }
    else {
      return longText.slice(0,80)+'...'
    }
  }
}