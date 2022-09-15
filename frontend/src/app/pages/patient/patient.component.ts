import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { PatientService } from 'src/app/services/patient.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { CityService } from 'src/app/services/city.service';
import { Combo } from 'src/app/interfaces/combo.interface';

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

  constructor(private fb: FormBuilder, 
            private router: Router, 
            private sweetAlertService: SweetAlertService, 
            private patientService: PatientService,
            private errorService: ErrorsService,
            private cityService: CityService) {
    this.createForm();
    this.onPatientFormChange();
  }

  ngOnInit(): void {
    this.getCombo();
  }

  createForm() {
    this.patientForm = this.fb.group({
      name: [
        { value: this.patient?.name, disabled: this.patient !== undefined },
        [Validators.required],
      ],
      lastName: [
        { value: this.patient?.lastName, disabled: this.patient !== undefined },
        [Validators.required],
      ],
      dni: [
        { value: this.patient?.dni, disabled: this.patient !== undefined },
        [Validators.required],
      ],
      birthDate: [
        {
          value: this.patient?.birthDate,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      street: [
        {
          value: this.patient?.address.street,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      streetNumber: [
        {
          value: this.patient?.address.number,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      city: [
        {
          value: this.patient?.address.city,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      legalGuardianName: [
        {
          value: this.patient?.legalGuardian.name,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      legalGuardianLastName: [
        {
          value: this.patient?.legalGuardian.lastName,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      legalGuardianPhone: [
        {
          value: this.patient?.legalGuardian.phone,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      legalGuardianEmail: [
        {
          value: this.patient?.legalGuardian.email,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      personalHistoryBirthWeight: [
        {
          value: this.patient?.personalHistory.birthWeight,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      personalHistoryApgar: [
        {
          value: this.patient?.personalHistory.apgar,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      personalHistoryAllergies: [
        {
          value: this.patient?.personalHistory.allergies,
          disabled: this.patient !== undefined,
        },
        [Validators.required],
      ],
      familyHistoryPregnancyHistory: [
        {
          value: this.patient?.familyHistory.pregnancyHistory,
          disabled: this.patient !== undefined,
        },
        [],
      ],
      familyHistoryGynaecologist: [
        {
          value: this.patient?.familyHistory.gynaecologist,
          disabled: this.patient !== undefined,
        },
        [],
      ],
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
      this.patientForm.controls.personalHistoryBirthWeight.errors !== null ||
      this.patientForm.controls.personalHistoryApgar.errors !== null
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
    const controlStep3 = ['personalHistoryBirthWeight','personalHistoryApgar'];
    controlStep3.forEach(element => {
      this.patientForm.get(element).valueChanges.subscribe((val) => {
        this.stepThree = false;
      });
    });

  }
  createPatient() {
    this.getStepValid();
    console.log(this.patientForm);
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
        this.patientService.createPatient(this.patientForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.sweetAlertService.showSwalResponse({
                          title: 'Paciente dado de alta',
                          text:'',
                          icon: 'success'
                        })
                    }},(err)=>{
                      console.log(err);
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
      personalHistoryAllergies: this.allergies
    })
    allergie.value = '';
  }
  deleteAllergie(index: number) {
    this.allergies.splice(index, 1);
    this.patientForm.patchValue({
      personalHistoryAllergies: this.allergies
    })
  }
  getCombo() {
    this.cityService.getCombo()
                      .subscribe((resp: any) => {
                        if(resp.ok){
                          this.cityCombo = resp.param.combo
                        }
                      },(err)=>{
                        console.log(err);
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      })
  }
}
