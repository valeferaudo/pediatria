import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pathology } from 'src/app/models/pathology.model';
import { ErrorsService } from 'src/app/services/errors.service';
import { PathologyService } from 'src/app/services/pathology.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-pathology-modal',
  templateUrl: './pathology-modal.component.html',
  styleUrls: ['./pathology-modal.component.css']
})
export class PathologyModalComponent implements OnInit {

  @Input() hiddenModal: boolean;
  @Input() mode: 'create' | 'update';
  @Input() pathologySelected: Pathology;
  @Output() closeModal = new EventEmitter<string>();
  @Output() getPathologies = new EventEmitter<string>();

  pathologyForm: FormGroup
  pathology: Pathology;
  formsEquals: boolean = true;
  constructor(private pathologyService: PathologyService,
              private fb: FormBuilder,
              private errorService: ErrorsService,
              private sweetAlertService: SweetAlertService) {}
    
  ngOnInit(): void {
    this.createPathologyForm();
    this.getMode();
  }
  getMode(){
    if(this.mode === 'update'){
      this.pathologyForm.patchValue({
        name: this.pathologySelected.name,
        code: this.pathologySelected.code,
        possibleTreatment: this.pathologySelected.possibleTreatment
      })
      this.listenerForm();
    }
  }
  createPathologyForm(){
    this.pathologyForm = this.fb.group({
      name:["",[Validators.required],],
      code:["",[],],
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
        this.pathologyService.createPathology(this.pathologyForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
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
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  updateService(){
    if (this.pathologyForm.invalid){
      Object.values(this.pathologyForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Editar servicio?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.pathologyService.updatePathology(this.pathologySelected.id,this.pathologyForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.sweetAlertService.showSwalResponse({
                          title: 'Servicio editado',
                          text:'',
                          icon: 'success'
                        })
                        this.getPathologies.emit();
                        this.closedModal();
                      }
                    },(err)=>{
                      console.log(err);
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  listenerForm(){
    this.pathologyForm.valueChanges
            .subscribe(resp=>{
              if(this.pathologySelected.name === this.pathologyForm.controls['name'].value && this.pathologySelected.code === this.pathologyForm.controls['code'].value && this.pathologySelected.possibleTreatment === this.pathologyForm.controls['possibleTreatment'].value){
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

}
