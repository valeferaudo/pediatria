import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//COMPONENTES
import { CardComponent } from './card/card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { PathologyModalComponent } from './modals/pathology-modal/pathology-modal.component';
import { NewPatientModalComponent } from './modals/new-patient-modal/new-patient-modal.component';
import { OldConsultationModalComponent } from './modals/old-consultation-modal/old-consultation-modal.component';
import { PatientModalComponent } from './modals/patient-modal/patient-modal.component';
import { LineLoaderComponent } from './loaders/line-loader/line-loader.component';
import { FullScreenLoaderComponent } from './loaders/full-screen-loader/full-screen-loader.component';
import { MaterialModule } from '../material.module';
import { NewCityModalComponent } from './modals/new-city-modal/new-city-modal.component';


@NgModule({
  declarations: [
    PathologyModalComponent,
    CardComponent,
    NewPatientModalComponent,
    OldConsultationModalComponent,
    PatientModalComponent,
    LineLoaderComponent,
    FullScreenLoaderComponent,
    NewCityModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    PathologyModalComponent,
    CardComponent,
    NewPatientModalComponent,
    OldConsultationModalComponent,
    PatientModalComponent,
    LineLoaderComponent,
    FullScreenLoaderComponent,
    NewCityModalComponent

  ]
})
export class ComponentsModule { }
