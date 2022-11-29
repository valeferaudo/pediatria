
import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { DoctorGuard } from '../guards/doctor.guard';
import { PathologiesComponent } from './pathologies/pathologies.component';
import { PatientsComponent } from './patients/patients.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { ConsultationEditComponent } from './consultation-edit/consultation-edit.component';


export const PagesRoutes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'appointments'},
  {path: 'patient', component: PatientComponent, canActivate: [DoctorGuard]},
  {path: 'patient/consultation/:id', component: PatientComponent, canActivate: [DoctorGuard]},
  {path: 'patient/:id', component: PatientComponent, canActivate: [DoctorGuard]},
  {path: 'patients', component: PatientsComponent, canActivate: [DoctorGuard]},
  {path: 'pathologies', component: PathologiesComponent, canActivate: [DoctorGuard]},
  {path: 'appointments', component: AppointmentsComponent, canActivate: [DoctorGuard]},
  {path: 'consultation/:id', component: ConsultationComponent, canActivate: [DoctorGuard]},
  {path: 'consultation-edit/:id', component: ConsultationEditComponent, canActivate: [DoctorGuard]},
  {path: 'consultation-on-edit/:id', component: ConsultationEditComponent, canActivate: [DoctorGuard]},
  {path: 'consultations', component: ConsultationsComponent, canActivate: [DoctorGuard]},

];