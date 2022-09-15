
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientComponent } from './patient/patient.component';
import { DoctorGuard } from '../guards/doctor.guard';
import { PathologiesComponent } from './pathologies/pathologies.component';
import { PatientsComponent } from './patients/patients.component';
import { AppointmentsComponent } from './appointments/appointments.component';


export const PagesRoutes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent, canActivate: [DoctorGuard]},
  {path: 'patient', component: PatientComponent, canActivate: [DoctorGuard]},
  {path: 'patient/:id', component: PatientComponent, canActivate: [DoctorGuard]},
  {path: 'patients', component: PatientsComponent, canActivate: [DoctorGuard]},
  {path: 'pathologies', component: PathologiesComponent, canActivate: [DoctorGuard]},
  {path: 'appointments', component: AppointmentsComponent, canActivate: [DoctorGuard]},

];