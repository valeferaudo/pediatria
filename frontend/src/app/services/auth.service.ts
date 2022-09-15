import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, catchError} from 'rxjs/operators';
import { LoginForm } from '../interfaces/loginForm.interface';
import { environment } from 'src/environments/environment.prod';
import { Doctor } from '../models/doctor.model';
import { Observable, of } from 'rxjs';
const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Doctor;
  constructor(private http: HttpClient,
              private router: Router) {
  }

  signIn(dataForm: LoginForm, type: string ){
    const body = {
      email : dataForm.email,
      password: dataForm.password,
      type: type
    };
    return this.http.post(`${baseUrl}/login/`, body)
                    .pipe(tap((resp: any) => {
                      this.user = resp.user
                      localStorage.setItem('x-token', resp.token);
                    }));
  }
  // signUp(dataForm: Doctor, role){
  //   dataForm.role = role;
  //   return this.http.post(`${baseUrl}/users`, dataForm);
  // }
  validateToken(): Observable<boolean>{
    return this.http.get(`${baseUrl}/login/renew`)
              .pipe(map((resp: any) => {
                        const{name,lastName, dni, birthDate, address, phone, email,deletedDate, timeTable, role, uid} = resp.doctor;
                        this.user  = new Doctor( name,lastName, dni, birthDate, address, phone, email, deletedDate, timeTable,'', role, uid);
                        localStorage.setItem('x-token', resp.token);
                        return true;
            }), catchError(error => {
                        return of(false);
          })
      );
  }
  logOut(){
    this.router.navigateByUrl('/login')
    localStorage.removeItem('x-token');
  }
}
