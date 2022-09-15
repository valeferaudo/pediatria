import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//COMPONENTES
import { CardComponent } from './card/card.component';
import { AppointmentModalComponent } from './modals/appointment-modal/appointment-modal.component';
import { PathologyModalComponent } from './modals/pathology-modal/pathology-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    PathologyModalComponent,
    AppointmentModalComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    PathologyModalComponent,
    AppointmentModalComponent,
    CardComponent,
  ]
})
export class ComponentsModule { }
