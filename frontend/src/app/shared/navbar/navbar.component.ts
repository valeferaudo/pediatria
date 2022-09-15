import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private sweetAlertService: SweetAlertService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  logOut(){
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Desea cerrar sesión?',
      text:'',
      icon: 'question',
    })
    .then((result) => {
      if (result.value) {
        this.sweetAlertService.showSwalResponse({
          title: 'Cerrando sesión',
          text:'',
        icon: 'warning',
        })
        setTimeout(() => {
          this.authService.logOut();
        }, 1000);
      }
    });
  }
}
