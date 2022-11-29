import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PathologyFilter } from '../interfaces/pathologyFilter.interface';
import { Pathology } from '../models/pathology.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PathologyService {
  registerPerPage = '6';

  constructor(private http: HttpClient) { }

  getPathologies(filters: PathologyFilter, page){
    let params = new HttpParams();
    params = params.append('text',filters.text);
    params = params.append('page',`${page}`);
    params = params.append('registerPerPage',this.registerPerPage);
    return this.http.get(`${baseUrl}/pathologies/` ,{params});
  }
  createPathology(pathology: Pathology){
    return this.http.post(`${baseUrl}/pathologies/`,pathology);

  }
  updatePathology(id: string, pathology: Pathology){
    return this.http.put(`${baseUrl}/pathologies/${id}`,pathology);
  }

  getCombo(){
    return this.http.get(`${baseUrl}/pathologies/combo`);
  }
}