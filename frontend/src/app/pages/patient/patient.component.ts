import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { PatientService } from 'src/app/services/patient.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { CityService } from 'src/app/services/city.service';
import { Combo } from 'src/app/interfaces/combo.interface';
import { Consultation } from '../../models/consultation.model';
import { ConsultationService } from '../../services/consultation.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit {
  step: 'one' | 'two' | 'three' | 'four' = 'one';
  stepOne: boolean = false;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  patientForm: FormGroup;
  patient: Patient;
  allergies: string[] = [];
  cityCombo: Combo [] = []
  mode: 'edit' | 'create' = null;

  patientID: string = null
  consultations: Consultation[] = [];
  totalPages = null;
  page = 1;
  hiddenNewCityModal: boolean = false;

  constructor(private fb: FormBuilder, 
            private router: Router, 
            private sweetAlertService: SweetAlertService, 
            private patientService: PatientService,
            private consultationService: ConsultationService,
            private route: ActivatedRoute,
            private errorService: ErrorsService,
            private loaderService: LoaderService,
            private cityService: CityService) {
    this.createForm();
    this.onPatientFormChange();
  }

  ngOnInit(): void {
    this.getParam()
    this.getCombo();
  }
  getParam(){
    this.route.params
    .subscribe(params => {
      if(params.id){
        this.mode = 'edit'
        this.patientID = params.id
        this.getPatient(params.id)
        this.getPatientConsultations();
      }else{
        this.mode = 'create'
      }
    }
  );
  }
  getPatient(id){
    this.loaderService.openLineLoader()
    this.patientService.getPatient(id)
                .subscribe((resp: any) =>{
                  if(resp.ok){
                    this.loaderService.closeLineLoader()
                    this.patient = resp.param.patient;
                    this.fillForm();
                  }
                },(err) => {
                  console.log(err);
                  this.loaderService.closeLineLoader()
                  this.errorService.showErrors(err.error.code,err.error.msg);
                })
  }
  fillForm(){
    this.patientForm.patchValue({
      name: this.patient?.name,
      lastName: this.patient?.lastName,
      dni: this.patient?.dni,
      birthDate: this.patient?.birthDate?.split('T')[0],
      street: this.patient?.address?.street,
      streetNumber: this.patient?.address?.number,
      city: this.patient?.city,
      legalGuardianName: this.patient?.legalGuardian?.name,
      legalGuardianLastName: this.patient?.legalGuardian?.lastName,
      legalGuardianPhone: this.patient?.legalGuardian?.phone,
      legalGuardianEmail: this.patient?.legalGuardian?.email,
      pregnancyHistoryBirthWeight: this.patient?.pregnancyHistory?.birthWeight,
      pregnancyHistoryApgar: this.patient?.pregnancyHistory?.apgar,
      pregnancyHistoryAllergies: this.patient?.pregnancyHistory?.allergies,
      personalHistoryPregnancy: this.patient?.personalHistory?.pregnancy,
    })
    this.allergies = [...this.patient.pregnancyHistory.allergies]
  }
  createForm() {
    this.patientForm = this.fb.group({
      name: ['',[Validators.required],],
      lastName: ['',[Validators.required],],
      dni: ['',[Validators.required],],
      birthDate: ['',[],],
      street: ['',[],],
      streetNumber: ['',[],],
      city: ['',[],],
      legalGuardianName: ['',[],],
      legalGuardianLastName: ['',[],],
      legalGuardianPhone: ['',[],],
      legalGuardianEmail: ['',[],],
      pregnancyHistoryBirthWeight: ['',[],],
      pregnancyHistoryApgar: ['',[],],
      pregnancyHistoryAllergies: ['',[],],
      personalHistoryPregnancy: ['',[],],
    });
  }
  showStep(step: 'one' | 'two' | 'three' | 'four') {
    this.step = step;
  }
  getFieldValid(field: string) {
    return (
      this.patientForm.get(field).invalid && this.patientForm.get(field).touched
    );
  }
  getStepValid() {
    if (
      this.patientForm.controls.name.errors !== null ||
      this.patientForm.controls.lastName.errors !== null ||
      this.patientForm.controls.dni.errors !== null ||
      this.patientForm.controls.birthDate.errors !== null ||
      this.patientForm.controls.street.errors !== null ||
      this.patientForm.controls.streetNumber.errors !== null ||
      this.patientForm.controls.city.errors !== null
    ) {
      this.stepOne = true;
    }
    if (
      this.patientForm.controls.legalGuardianName.errors !== null ||
      this.patientForm.controls.legalGuardianLastName.errors !== null ||
      this.patientForm.controls.legalGuardianPhone.errors !== null ||
      this.patientForm.controls.legalGuardianEmail.errors !== null
    ) {
      this.stepTwo = true;
    }
    if (
      this.patientForm.controls.pregnancyHistoryBirthWeight.errors !== null ||
      this.patientForm.controls.pregnancyHistoryApgar.errors !== null
    ) {
      this.stepThree = true;
    }
    // if(this.patientForm.touched){
    //   if(){
    //       // this.stepFour = true;
    //     }
    // }
  }
  onPatientFormChange(): void {
    const controlStep1 = ['name','lastName','dni','birthDate','street','streetNumber','city'];
    controlStep1.forEach(element => {
      this.patientForm.get(element).valueChanges.subscribe((val) => {
        this.stepOne = false;
      });
    });
    const controlStep2 = ['legalGuardianName','legalGuardianLastName','legalGuardianPhone','legalGuardianEmail'];
    controlStep2.forEach(element => {
      this.patientForm.get(element).valueChanges.subscribe((val) => {
        this.stepTwo = false;
      });
    });
    const controlStep3 = ['pregnancyHistoryBirthWeight','pregnancyHistoryApgar'];
    controlStep3.forEach(element => {
      this.patientForm.get(element).valueChanges.subscribe((val) => {
        this.stepThree = false;
      });
    });

  }
  submitForm(){
    if(this.mode === 'create'){
      this.createPatient()    
    }else if (this.mode === 'edit'){
      this.updatePatient();
    }
  }
  updatePatient() {
    this.getStepValid();
    if (this.patientForm.invalid) {
      Object.values(this.patientForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Actualizar paciente?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.patientService.updatePatient(this.patient._id,this.patientForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader()
                        this.sweetAlertService.showSwalResponse({
                          title: 'Paciente Actualizado',
                          text:'',
                          icon: 'success'
                        })
                        if((this.router.url).split("/").includes("consultation")){
                          this.router.navigate([`/doctor/consultation/${this.patient._id}`])
                        }
                        else {
                          this.router.navigate([`/doctor/patients`])
                        }
                      }},(err)=>{
                      console.log(err);
                      this.loaderService.closeLineLoader()
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  createPatient() {
    this.getStepValid();
    if (this.patientForm.invalid) {
      Object.values(this.patientForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Dar de alta paciente?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.patientService.createPatient(this.patientForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader()
                        this.sweetAlertService.showSwalResponse({
                          title: 'Paciente dado de alta',
                          text:'',
                          icon: 'success'
                        })
                        this.router.navigate([`/doctor/patients`])
                      }},(err)=>{
                      console.log(err);
                      this.loaderService.closeLineLoader()
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
      }
    })
  }
  addAllergie(allergie: any) {
    if (allergie.value.length > 0) {
      if (this.allergies.indexOf(allergie.value) === -1) {
        this.allergies.push(allergie.value);
      }
    }
    this.patientForm.patchValue({
      pregnancyHistoryAllergies: this.allergies
    })
    allergie.value = '';
  }
  deleteAllergie(index: number) {
    this.allergies.splice(index, 1);
    this.patientForm.patchValue({
      pregnancyHistoryAllergies: this.allergies
    })
  }
  getCombo() {
    this.loaderService.openLineLoader()
    this.cityService.getCombo()
                      .subscribe((resp: any) => {
                        if(resp.ok){
                          this.loaderService.closeLineLoader()
                          this.cityCombo = resp.param.combo
                        }
                      },(err)=>{
                        console.log(err);
                        this.loaderService.closeLineLoader()
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      })
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
  openOldConsultationModal(consultation){
    this.router.navigate(['doctor','consultation-edit',consultation._id])
  }
  cancel(){
    this.fillForm();
  }

  newCity(value){
    if(value === 'newCity'){
      console.log("modal")
      this.hiddenNewCityModal = true
    }
  }
  closeModal(){
    this.hiddenNewCityModal = false;
  }
}
