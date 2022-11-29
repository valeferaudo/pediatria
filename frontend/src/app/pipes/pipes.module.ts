import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//COMPONENTES
import { GetAgePipe } from './get-age-pipe.pipe';
import { DateStringPipe } from './date-string.pipe';
import { LongTextPipePipe } from './long-text-pipe.pipe'

@NgModule({
  declarations: [
    GetAgePipe,
    DateStringPipe,
    LongTextPipePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GetAgePipe,
    DateStringPipe,
    LongTextPipePipe
  ]
})
export class PipesModule { }
