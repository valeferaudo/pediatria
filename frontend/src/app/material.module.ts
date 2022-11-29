
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//MODULOS
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  exports:[
     MatProgressSpinnerModule,
     MatProgressBarModule,  
  ],
})
export class MaterialModule { }