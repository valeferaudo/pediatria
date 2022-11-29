import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Consultation } from '../models/consultation.model';


const baseUrl = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  registerPerPage = '6';
  
  constructor(private http: HttpClient) { }
  
  getPatientConsultations(patientID: string, page: number){
    let params = new HttpParams();
    params = params.append('page',`${page}`);
    params = params.append('registerPerPage',this.registerPerPage);
    return this.http.get(`${baseUrl}/consultations/patient/${patientID}`,{params});
  }
  createConsultation(consultation: Consultation){
    return this.http.post(`${baseUrl}/consultations/`,consultation);
  }
  createManualConsultation(consultation: Consultation){
    return this.http.post(`${baseUrl}/consultations/manual`,consultation);
  }
  getConsultation(id: string){
    return this.http.get(`${baseUrl}/consultations/${id}`)
  }
  updateConsultation(consultationID: string, consultation: Consultation){
    return this.http.put(`${baseUrl}/consultations/${consultationID}`,consultation);
  }
  getConsultations(page){
    let params = new HttpParams();
    params = params.append('page',`${page}`);
    params = params.append('registerPerPage',this.registerPerPage);
    return this.http.get(`${baseUrl}/consultations`, {params})
  }
}
