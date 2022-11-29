import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAvailables(dateSelected){
    let params = new HttpParams();
    params = params.append('dateSelected', dateSelected);
    return this.http.get(`${baseUrl}/appointments/availables`, { params });
  }
  createAppointments(appointment){
    return this.http.post(`${baseUrl}/appointments`, appointment);
}
getAppointments(dateSelected){
  let params = new HttpParams();
  params = params.append('date', dateSelected);
  return this.http.get(`${baseUrl}/appointments`, { params });
}
deleteAppointment(id: string){
  return this.http.delete(`${baseUrl}/appointments/${id}`);
}
}
