import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../../services/errors.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { PatientService } from '../../../services/patient.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-new-patient-modal',
  templateUrl: './new-patient-modal.component.html',
  styleUrls: ['./new-patient-modal.component.css']
})
export class NewPatientModalComponent implements OnInit {

  @Input() hiddenModal: boolean;
  @Output() closeModal = new EventEmitter<string>();
  @Output() getPatients = new EventEmitter<string>();

  patientForm: FormGroup

  constructor(private patientService: PatientService,
              private fb: FormBuilder,
              private errorService: ErrorsService,
              private loaderService: LoaderService,
              private sweetAlertService: SweetAlertService) {}
    
  ngOnInit(): void {
    this.createPatientForm();
  }

  createPatientForm(){
    this.patientForm = this.fb.group({
      name:["",[Validators.required],],
      lastName: ["",[Validators.required]],
      dni:["",[Validators.required]]
    })
  }
  closedModal(){
    this.closeModal.emit()
  }
  createPatient(){
    if (this.patientForm.invalid){
      Object.values(this.patientForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Crear paciente?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader();
        this.patientService.createPatient(this.patientForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Paciente creado',
                          text:'',
                          icon: 'success'
                        })
                        this.getPatients.emit();
                        this.closedModal();
                      }
                    },(err)=>{
                      console.log(err);
                      this.loaderService.openLineLoader();
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  getFieldValid(field : string){
    return this.patientForm.get(field).invalid &&
            this.patientForm.get(field).touched
  }

}
