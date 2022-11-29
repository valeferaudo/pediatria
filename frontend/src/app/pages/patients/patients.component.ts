import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientFilter } from 'src/app/interfaces/patientFilter.interface';
import { Patient } from 'src/app/models/patient.model';
import { ErrorsService } from 'src/app/services/errors.service';
import { PatientService } from 'src/app/services/patient.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients: Patient [] = [];
  filters: PatientFilter = {
    text: '',
    cities:[]
  }
  searchText = '';
  //PAGINATOR
  totalPages = null;
  page = 1;
  doNotCloseMenu = (event) => event.stopPropagation();
  constructor(private router: Router,
              private errorService: ErrorsService,
              private loaderService: LoaderService,
              private patientService: PatientService) { }

  ngOnInit(): void {
    this.getPatients();
  }
  newPatient() {
    this.router.navigate([`/doctor/patient`])
  }
  getPatients(){
    this.loaderService.openLineLoader()
    this.patientService.getPatients(this.filters,this.page)
                    .subscribe((resp:any)=>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader()
                        this.patients = resp.param.patients;
                        this.page = resp.param.paginator.page;
                        this.totalPages = resp.param.paginator.totalPages;
                      }
                    }, (err) => {
                      console.log(err)
                      this.loaderService.closeLineLoader()
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
  }

  goUser(id: string){
    this.router.navigate([`/doctor/patient/${id}`])
  }
  goConsultation(patient: Patient){
    if(patient.lastVisit === null){
      this.router.navigate([`/doctor/patient/consultation/${patient._id}`])
    }else{
      this.router.navigate([`/doctor/consultation/${patient._id}`])
    }
  }
  searchPatients(text){
    this.searchText = text;
    this.fillFilterObject();
    this.getPatients();  
  }
  refreshTable(){
    this.searchText = '';
    this.fillFilterObject();
    this.getPatients();
  }
  fillFilterObject(){
    this.filters = {
      text: this.searchText,
    }
  }
}
