import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

const baseUrl = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  registerPerPage = '6';
  constructor(private http: HttpClient) { }

  getCombo(){
    return this.http.get(`${baseUrl}/doctors/combo`);
  }
}
