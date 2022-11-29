import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Pathology } from '../../../models/pathology.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PathologyService } from '../../../services/pathology.service';
import { ErrorsService } from '../../../services/errors.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-patient-modal',
  templateUrl: './patient-modal.component.html',
  styleUrls: ['./patient-modal.component.css']
})
export class PatientModalComponent implements OnInit {

  @Input() hiddenModal: boolean;
  @Input() mode: 'create' | 'update';
  @Input() pathologySelected: Pathology;
  @Output() closeModal = new EventEmitter<string>();
  @Output() getPathologies = new EventEmitter<string>();

  pathologyForm: FormGroup
  pathology: Pathology;
  formsEquals: boolean = true;
  symptoms: string[] = [];
  possibleTreatments: string[] = [];

  constructor(private pathologyService: PathologyService,
              private fb: FormBuilder,
              private errorService: ErrorsService,
              private loaderService: LoaderService,
              private sweetAlertService: SweetAlertService) {}
    
  ngOnInit(): void {
    this.createPathologyForm();
    this.getMode();
  }
  getMode(){
    if(this.mode === 'update'){
      this.pathologyForm.patchValue({
        name: this.pathologySelected.name,
        symptom: this.pathologySelected.symptom,
        possibleTreatment: this.pathologySelected.possibleTreatment
      })
      this.listenerForm();
    }
  }
  createPathologyForm(){
    this.pathologyForm = this.fb.group({
      name:["",[Validators.required],],
      symptom: ["",[]],
      possibleTreatment:["",[]]
    })
  }
  closedModal(){
    this.closeModal.emit()
  }
  createPathology(){
    if (this.pathologyForm.invalid){
      Object.values(this.pathologyForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Crear patología?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.pathologyService.createPathology(this.pathologyForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Patología creada',
                          text:'',
                          icon: 'success'
                        })
                        this.getPathologies.emit();
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
  updatePathology(){
    if (this.pathologyForm.invalid){
      Object.values(this.pathologyForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Editar patología?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.pathologyService.updatePathology(this.pathologySelected._id,this.pathologyForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Patología editada',
                          text:'',
                          icon: 'success'
                        })
                        this.getPathologies.emit();
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
  listenerForm(){
    this.pathologyForm.valueChanges
            .subscribe(resp=>{
              if(this.pathologySelected.name === this.pathologyForm.controls['name'].value && this.pathologySelected.symptom === this.pathologyForm.controls['symptom'].value && this.pathologySelected.possibleTreatment === this.pathologyForm.controls['possibleTreatment'].value){
                this.formsEquals = true;
              }
              else{
                this.formsEquals = false;
              }
            })
  }
  getFieldValid(field : string){
    return this.pathologyForm.get(field).invalid &&
            this.pathologyForm.get(field).touched
  }
  addSymptom(symptom: any) {
    if (symptom.value.length > 0) {
      if (this.symptoms.indexOf(symptom.value) === -1) {
        this.symptoms.push(symptom.value);
      }
    }
    this.pathologyForm.patchValue({
      symptom: this.symptoms
    })
    symptom.value = '';
  }
  deleteSymptom(index: number) {
    this.symptoms.splice(index, 1);
    this.pathologyForm.patchValue({
      symptom: this.symptoms
    })
  }
  addPossibleTreatment(possibleTreatment: any) {
    if (possibleTreatment.value.length > 0) {
      if (this.possibleTreatments.indexOf(possibleTreatment.value) === -1) {
        this.possibleTreatments.push(possibleTreatment.value);
      }
    }
    this.pathologyForm.patchValue({
      possibleTreatment: this.possibleTreatments
    })
    possibleTreatment.value = '';
  }
  deletePossibleTreatment(index: number) {
    this.possibleTreatments.splice(index, 1);
    this.pathologyForm.patchValue({
      possibleTreatment: this.possibleTreatments
    })
  }

}
