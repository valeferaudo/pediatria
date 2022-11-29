import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { Consultation } from 'src/app/models/consultation.model';
import { ErrorsService } from 'src/app/services/errors.service';
import { PatientService } from 'src/app/services/patient.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Institution } from 'src/app/models/institution.model';
import { InstitutionService } from 'src/app/services/institution.service';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Combo } from 'src/app/interfaces/combo.interface';
import { PathologyService } from 'src/app/services/pathology.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {
  step: 'one' | 'two' | 'three' | 'four' = 'one';
  stepOne: boolean = false;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  patient: Patient;
  patientID: string = null;
  consultations: Consultation[] = [];
  consultationForm: FormGroup;
  doctorLogged: Doctor;
  //PAGINATOR
  totalPages = null;
  page = 1;
  //Combos
  // institutionCombo: Combo [] = [];
  // doctorCombo: Combo [] = [];
  pathologiesID: string [] = [];
  pathologiesText: string [] = [];
  
  //Patologies
  selectedValuePathology: any;
  searchValuePathology: any;
  pathologiesFiltered: Combo[];
  pathologiesCombo: Combo [] = [];
  hiddenPathologyModal: boolean = false;

  //oldConsultation
  hiddenOldConsultationModal: boolean = false;
  oldConsultationSelected: Consultation = null;
  //patient
  hiddenPatientModal: boolean = false;

  constructor(private errorService: ErrorsService,
              private consultationService: ConsultationService,
              private activatedRoute: ActivatedRoute,
              private pathologyService: PathologyService,
              private authService: AuthService,
              private router: Router,
              private sweetAlertService: SweetAlertService,
              private loaderService: LoaderService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getDoctor();
    // this.getInstitutionCombo();
    // this.getDoctorCombo();
    this.getPathologyCombo();
    this.getPatient();
    this.createForm();
  }

  showStep(step: 'one' | 'two' | 'three' | 'four') {
    this.step = step;
  }
  getDoctor(){
    this.doctorLogged = this.authService.user;
  }
  getPatient(){
    this.activatedRoute.params.subscribe((params: Params) => {
      this.patientID = params['id'];
   });
   if (this.patientID !== undefined) {
     this.getPatientConsultations();
   }
  }
  getPatientConsultations(){
    this.loaderService.openLineLoader()
    this.consultationService.getPatientConsultations(this.patientID,this.page)
     .subscribe((resp:any)=>{
       if(resp.ok){
        this.loaderService.closeLineLoader()
        this.patient = resp.param.patient;
        this.consultations = resp.param.consultations;
        this.page = resp.param.paginator.page;
        this.totalPages = resp.param.paginator.totalPages;
       }
     }, (err) => {
       console.log(err)
       this.loaderService.closeLineLoader()
       this.errorService.showErrors(err.error.code,err.error.msg);
     })
  }
  createForm(){
    this.consultationForm = this.fb.group({
      patient: [this.patientID],
      // institution:["",[Validators.required],],
      // doctor:[{value: this.doctorLogged.role === 'DOCTOR' ? this.doctorLogged.uid : '', disabled: this.doctorLogged.role === 'DOCTOR' ? true : false}, [Validators.required],],
      symptomDescription: ["",[Validators.required]],
      treatmentDescription:["",[Validators.required]],
      physicalExamination: ["",[]],
      pathologies:["",[Validators.required]],
      weight:["",[]],
      height:["",[]],
      pc:["",[]],
      ta:["",[]],
      visualAcuity:["",[]],
      comments:["",[]],
      feeding:["",[]],
      vaccine:["",[]],
    })
  }
  getFieldValid(field : string){
    return this.consultationForm.get(field).invalid &&
            this.consultationForm.get(field).touched
  }
  // getInstitutionCombo() {
  //   this.institutionService.getCombo()
  //                         .subscribe((resp: any) => {
  //                           if(resp.ok){
  //                             this.institutionCombo = resp.param.combo;
  //                           }
  //                         },(err)=>{
  //                           console.log(err);
  //                           this.errorService.showErrors(err.error.code,err.error.msg);
  //                         })
  // }
  // getDoctorCombo() {
  //   this.doctorService.getCombo()
  //                         .subscribe((resp: any) => {
  //                           if(resp.ok){
  //                             this.doctorCombo = resp.param.combo;
  //                           }
  //                         },(err)=>{
  //                           console.log(err);
  //                           this.errorService.showErrors(err.error.code,err.error.msg);
  //                         })
  // }
  getPathologyCombo(){
    this.loaderService.openLineLoader()
    this.pathologyService.getCombo()
                          .subscribe((resp: any) => {
                            if(resp.ok){
                              this.loaderService.closeLineLoader()
                              this.pathologiesCombo = resp.param.combo;
                              this.pathologiesFiltered = resp.param.combo;
                            }
                          },(err)=>{
                            console.log(err);
                            this.loaderService.closeLineLoader()
                            this.errorService.showErrors(err.error.code,err.error.msg);
                          })
  }
  filterDropdownPathology(e) {
    window.scrollTo(window.scrollX, window.scrollY + 1);
    let searchString = e.toLowerCase();
    if (!searchString) {
      this.pathologiesFiltered = this.pathologiesCombo.slice();
      return;
    } else {
      this.pathologiesFiltered = this.pathologiesCombo.filter(
        user => user.text.toLowerCase().indexOf(searchString) > -1
      );
    }
    window.scrollTo(window.scrollX, window.scrollY - 1);
  }
  setPathology(id: string){

    let pathology = this.pathologiesCombo.find(element => element.id === id)
    if (this.pathologiesID.indexOf(pathology.id) === -1) {
      this.pathologiesID.push(pathology.id);
      this.pathologiesText.push(pathology.text);

    }  
    else{
      this.pathologiesID.splice(this.pathologiesID.indexOf(pathology.id), 1);
      this.pathologiesText.splice(this.pathologiesText.indexOf(pathology.text), 1);
    }
    this.consultationForm.patchValue({
      pathologies: this.pathologiesID
    })
    
  }
  createConsultation(){
    if (this.consultationForm.invalid){
      Object.values(this.consultationForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Crear consulta?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.consultationService.createConsultation(this.consultationForm.value)
                    .subscribe((resp: any) =>{
                      this.loaderService.closeLineLoader()
                      this.sweetAlertService.showSwalResponse({
                        title: 'Consulta creada',
                        text:'',
                        icon: 'success'
                      })
                      this.consultationForm.reset();
                      this.getPatientConsultations();
                    },(err)=>{
                      console.log(err);
                      this.loaderService.closeLineLoader()
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  cancel(){
    this.pathologiesID = [];
    this.pathologiesText = [];
    let x = document.getElementById("selectPathology") as HTMLSelectElement | null;;
    x.selectedIndex = 0;
    this.consultationForm.reset();
  }
  deletePathology(item){
    let pathology = this.pathologiesCombo.find(element => element.text === item)
    this.pathologiesID.splice(this.pathologiesID.indexOf(pathology.id), 1);
    this.pathologiesText.splice(this.pathologiesText.indexOf(pathology.text), 1);
  }
  openNewPathologyModal(){
    this.hiddenPathologyModal = true;
  }
  closeModal(key: 'patient' | 'consultation' | 'pathology'){
    switch (key) {
      case 'patient':
        
        break;
      case 'consultation':
        this.hiddenOldConsultationModal = false;
        break;
      case 'pathology':
        this.hiddenPathologyModal = false;
        break;
    }
  }
  openOldConsultationModal(consultation){
    // console.log(consultation)
    // this.oldConsultationSelected = consultation;
    // this.hiddenOldConsultationModal = true;
    this.router.navigate(['doctor','consultation-on-edit',consultation._id])
  }
  editPatient(){
    this.router.navigate(['doctor','patient','consultation',this.patientID])
  }
}
