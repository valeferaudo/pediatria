import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngOnInit() {
  }
  
  loginForm: FormGroup;
  passwordIsVisible: boolean;
  hiddenEmailModal: boolean = false;
  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private sweetAlertService: SweetAlertService,
              private loaderService: LoaderService,
              private errorService: ErrorsService) {
    this.createForm();
  }
  createForm(){
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['123456789', Validators.required],
      remember: [true, , ]
    });
  }
  login(){
    if (this.loginForm.invalid){
      Object.values(this.loginForm.controls).forEach(control=>{
        control.markAsTouched();
      })
      return;
    }
    this.loaderService.openLineLoader();
    this.authService.signIn(this.loginForm.value, 'DOCTOR')
                      .subscribe(resp => {
                        if (this.loginForm.get('remember').value){
                          localStorage.setItem('email', this.loginForm.get('email').value);
                        }else{
                          localStorage.removeItem('email');
                        }
                        this.sweetAlertService.showSwalResponse({
                          title:'Ingresando',
                          text:'',
                          icon:'success'
                        });
                        this.loaderService.closeLineLoader();
                        this.router.navigateByUrl('/doctor');
                      }, (err) => {
                        console.log(err);
                        this.loaderService.closeLineLoader();
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      });
  }
  getFieldValid(field : string){
    return this.loginForm.get(field).invalid &&
            this.loginForm.get(field).touched
 }
 showPassword(){
  this.passwordIsVisible = !this.passwordIsVisible;
}
goRecoverPassword(){
  this.sweetAlertService.showSwalConfirmation({
    title: '¿Desea recuperar la contraseña?',
    text: ``,
    icon: 'question'})
  .then((result) => {
    if (result.value) {
                   setTimeout(() => {
                     this.hiddenEmailModal=true
                   }, 200);
                }
    }
  )
}

closeRecoverPasswordModal(closeModal){
  this.hiddenEmailModal = closeModal
}

}
