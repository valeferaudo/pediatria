import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

//Components
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';





@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
  ]
})
export class SharedModule { }