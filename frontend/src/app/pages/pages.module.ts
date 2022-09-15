import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODULOS
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module'

//COMPONENTES
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { PatientComponent } from './patient/patient.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { PathologiesComponent } from './pathologies/pathologies.component';
import { PatientsComponent } from './patients/patients.component';


@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    PatientComponent,
    AppointmentsComponent,
    PathologiesComponent,
    PatientsComponent

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule
  ],
  exports:[
    HomeComponent,
    PagesComponent
  ]
})
export class PagesModule { }