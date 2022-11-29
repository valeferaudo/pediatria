import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PathologyService } from '../../../services/pathology.service';
import { ErrorsService } from '../../../services/errors.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Consultation } from '../../../models/consultation.model';
import { Combo } from '../../../interfaces/combo.interface';
import { ConsultationService } from '../../../services/consultation.service';
import { PatientService } from '../../../services/patient.service';
import * as moment from 'moment';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-old-consultation-modal',
  templateUrl: './old-consultation-modal.component.html',
  styleUrls: ['./old-consultation-modal.component.css']
})
export class OldConsultationModalComponent implements OnInit {

  @Input() hiddenOldConsultationModal: boolean;
  @Input() mode: 'create' | 'update';
  @Input() consultationSelected: Consultation;
  @Output() closeModal = new EventEmitter<string>();
  @Output() getConsultations = new EventEmitter<string>();

  consultationForm: FormGroup
  formsEquals: boolean = true;
  symptoms: string[] = [];
  possibleTreatments: string[] = [];

  selectedValuePathology: any;
  searchValuePathology: any;
  pathologiesFiltered: Combo[];
  pathologiesCombo: Combo [] = [];
  hiddenPathologyModal: boolean = false;
  pathologiesID: string [] = [];
  pathologiesText: string [] = [];
  selectedValuePatient: any;
  searchValuePatient: any;
  patientsCombo: Combo[] = [];
  patientsFiltered: Combo[];
  patientError = false;

  dateInput: string = null;
  timeInput: string = null;
  timeError = false;
  dateSelected = null;

  constructor(private pathologyService: PathologyService,
              private fb: FormBuilder,
              private consultationService: ConsultationService,
              private errorService: ErrorsService,
              private patientService : PatientService,
              private loaderService: LoaderService,
              private sweetAlertService: SweetAlertService) {
    this.createForm();
    this.getPathologyCombo();
    this.getPatientCombo();
  }
    
  ngOnInit(): void {}
  getMode(){
    if(this.mode === 'update'){
      this.consultationForm.patchValue({
        patient: this.consultationSelected.patient._id,
        symptomDescription: this.consultationSelected.symptomDescription,
        treatmentDescription: this.consultationSelected.treatmentDescription,
        physicalExamination: this.consultationSelected.physicalExamination,
        pathologies:this.consultationSelected.pathologies,
        weight:this.consultationSelected.weight,
        height: this.consultationSelected.height,
        pc: this.consultationSelected.pc,
        ta: this.consultationSelected.ta,
        visualAcuity: this.consultationSelected.visualAcuity,
        comments: this.consultationSelected.comments,
        feeding: this.consultationSelected.feeding,
        vaccine: this.consultationSelected.vaccine,
      })
      this.consultationSelected.pathologies.forEach(pathology => {
        this.setPathology(pathology._id)
      });
    }
  }
  createForm(){
    this.consultationForm = this.fb.group({
      patient: [""],
      dateTime: [""],
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
  closedModal(){
    this.closeModal.emit()
  }
  createConsultation(){
    if(!this.dateInput || !this.timeInput){
      this.timeError = true;
    }
    if(this.consultationForm.controls['patient'].value === '' ){
      this.patientError = true;
    }
    if(this.patientError || this.timeError) return
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
        this.loaderService.openLineLoader();
        this.consultationService.createManualConsultation(this.consultationForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Consulta creada',
                          text:'',
                          icon: 'success'
                        })
                        this.getConsultations.emit();
                        this.closedModal();
                      }
                    },(err)=>{
                      console.log(err);
                      this.loaderService.closeLineLoader();
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  updateConsultation(){
    if (this.consultationForm.invalid){
      Object.values(this.consultationForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Editar consulta?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader();
        this.consultationService.updateConsultation(this.consultationSelected._id,this.consultationForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Consulta editada',
                          text:'',
                          icon: 'success'
                        })
                        this.getConsultations.emit();
                        this.closedModal();
                      }
                    },(err)=>{
                      console.log(err);
                      this.loaderService.closeLineLoader();
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  getFieldValid(field : string){
    return this.consultationForm.get(field).invalid &&
            this.consultationForm.get(field).touched
  }
  openNewPathologyModal(){
    this.hiddenPathologyModal = true;
  }
  getPathologyCombo(){
    this.loaderService.openLineLoader();
    this.pathologyService.getCombo()
                          .subscribe((resp: any) => {
                            if(resp.ok){
                              this.loaderService.closeLineLoader();
                              this.pathologiesCombo = resp.param.combo;
                              this.pathologiesFiltered = resp.param.combo;
                              setTimeout(() => {
                                this.getMode();
                              }, 1);
                            }
                          },(err)=>{
                            console.log(err);
                            this.loaderService.closeLineLoader();
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
    console.log(this.pathologiesCombo);
    if(pathology === undefined){
      return
    }
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
  deletePathology(item){
    let pathology = this.pathologiesCombo.find(element => element.text === item)
    this.pathologiesID.splice(this.pathologiesID.indexOf(pathology.id), 1);
    this.pathologiesText.splice(this.pathologiesText.indexOf(pathology.text), 1);
  }
  closePathologyModal(){
    this.hiddenPathologyModal = false;
  }
  filterDropdownPatient(e) {
    window.scrollTo(window.scrollX, window.scrollY + 1);
    let searchString = e.toLowerCase();
    if (!searchString) {
      this.patientsFiltered = this.patientsCombo.slice();
      return;
    } else {
      this.patientsFiltered = this.patientsCombo.filter(
        user => user.text.toLowerCase().indexOf(searchString) > -1
      );
    }
    window.scrollTo(window.scrollX, window.scrollY - 1);
  }
  selectValuePatient(option) {
    this.selectedValuePatient = option.text;
    this.patientError = false;
    this.consultationForm.patchValue({
      patient: option.id
    })
  }
  getPatientCombo() {
    this.loaderService.openLineLoader();
    this.patientService.getCombo()
                      .subscribe((resp: any) => {
                        if(resp.ok){
                          this.loaderService.closeLineLoader();
                          this.patientsFiltered = resp.param.combo;
                          this.patientsCombo = resp.param.combo;
                        }
                      },(err)=>{
                        console.log(err);
                        this.loaderService.closeLineLoader();
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      })
  }
  changeDate(e,type: 'date' | 'time'){
    if(type === 'date'){
      this.dateInput = e
      this.dateSelected = moment(new Date(e)).add(1,'d')
      if(this.timeInput !== null){
        this.dateSelected = moment(this.dateSelected).set('minute',parseInt(this.timeInput.split(':')[1]))
        this.dateSelected = moment(this.dateSelected).set('hour',parseInt(this.timeInput.split(':')[0]))
      }
    }
    if(type === 'time'){
      this.timeInput = e;
      if(this.dateInput !== null){
        this.dateSelected = moment(this.dateSelected).set('minute',parseInt(e.split(':')[1]))
        this.dateSelected = moment(this.dateSelected).set('hour',parseInt(e.split(':')[0]))
      }
    }
    if(this.dateInput !== null && this.timeInput !== null){
      this.timeError = false;
    }
    this.consultationForm.patchValue({
      dateTime: this.dateSelected._d
    })
  }
}
