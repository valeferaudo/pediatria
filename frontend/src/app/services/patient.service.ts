import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Patient } from '../models/patient.model';
import { environment } from '../../environments/environment.prod';
import { PatientFilter } from "../interfaces/patientFilter.interface";
const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  registerPerPage = '6';
  constructor(private http: HttpClient) { }

  getPatients(filters: PatientFilter, page){
    let params = new HttpParams();
    params = params.append('searchText',filters.text);
    params = params.append('page',`${page}`);
    params = params.append('registerPerPage',this.registerPerPage);
    return this.http.get(`${baseUrl}/patients/` ,{params});
  }
  getPatient(patientID){
    return this.http.get(`${baseUrl}/patients/${patientID}`);
  }
  createPatient(patient: Patient ){
    return this.http.post(`${baseUrl}/patients/`, patient );
  }
  updatePatient(id, patient: Patient ){
    return this.http.put(`${baseUrl}/patients/${id}`, patient );
  }
  getCombo(){
    return this.http.get(`${baseUrl}/patients/combo`);
  }
}
