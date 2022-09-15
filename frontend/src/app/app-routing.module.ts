import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//RUTAS
import { PagesRoutes } from './pages/pages.routing';

//COMPONENTES
import { LoginComponent } from './auth/login/login.component';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'login', component: LoginComponent},
  {path: 'doctor', component: PagesComponent, children: PagesRoutes},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
