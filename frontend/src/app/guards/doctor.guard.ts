
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Doctor } from '../models/doctor.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorGuard implements CanActivate {

  doctor: Doctor;

  constructor(private authService: AuthService,
              private router: Router){
              }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      return this.authService.validateToken()
      .pipe(tap( isauthenticated => {
          if (!isauthenticated){
            this.router.navigateByUrl('/login');
          }
          this.doctor = this.authService.user;
          // if (this.doctor.role !== 'DOCTOR'){
          //     this.router.navigateByUrl('/admin');
          //   }
      }));
  }
}