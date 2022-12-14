import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Patient } from '../models/patient.model';
import { environment } from '../../environments/environment.prod';
import { City } from '../models/city.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  getCombo(){
    return this.http.get(`${baseUrl}/cities/combo`);
  }
  createCity(city: City ){
    return this.http.post(`${baseUrl}/cities/`, city );
  }
}
