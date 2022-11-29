import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODULOS
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module'
import { PipesModule } from '../pipes/pipes.module'


//COMPONENTES
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PatientComponent } from './patient/patient.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { PathologiesComponent } from './pathologies/pathologies.component';
import { PatientsComponent } from './patients/patients.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { ConsultationEditComponent } from './consultation-edit/consultation-edit.component';


@NgModule({
  declarations: [
    PagesComponent,
    PatientComponent,
    AppointmentsComponent,
    PathologiesComponent,
    PatientsComponent,
    ConsultationsComponent,
    ConsultationComponent,
    ConsultationEditComponent

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    PipesModule
  ],
  exports:[
    PagesComponent
  ]
})
export class PagesModule { }