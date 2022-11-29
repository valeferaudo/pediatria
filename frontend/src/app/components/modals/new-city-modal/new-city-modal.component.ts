import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CityService } from '../../../services/city.service';
import { ErrorsService } from '../../../services/errors.service';
import { LoaderService } from '../../../services/loader.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Combo } from '../../../interfaces/combo.interface';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-new-city-modal',
  templateUrl: './new-city-modal.component.html',
  styleUrls: ['./new-city-modal.component.css']
})
export class NewCityModalComponent implements OnInit {

  @Input() hiddenModal: boolean;
  @Output() closeModal = new EventEmitter<string>();
  @Output() getCities = new EventEmitter<string>();

  cityForm: FormGroup;
  stateCombo: Combo;

  constructor(private cityService: CityService,
              private fb: FormBuilder,
              private stateService: StateService,
              private errorService: ErrorsService,
              private loaderService: LoaderService,
              private sweetAlertService: SweetAlertService) {}
    
  ngOnInit(): void {
    this.createCityForm();
    this.getCombo();
  }

  createCityForm(){
    this.cityForm = this.fb.group({
      name:["",[Validators.required],],
      state: ["",[Validators.required]],
    })
  }
  closedModal(){
    this.closeModal.emit()
  }
  createPatient(){
    if (this.cityForm.invalid){
      Object.values(this.cityForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Crear ciudad?',
      text: ``,
      icon: 'question'})
    .then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader();
        this.cityService.createCity(this.cityForm.value)
                    .subscribe((resp: any) =>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader();
                        this.sweetAlertService.showSwalResponse({
                          title: 'Ciudad creado',
                          text:'',
                          icon: 'success'
                        })
                        this.getCities.emit();
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
    return this.cityForm.get(field).invalid &&
            this.cityForm.get(field).touched
  }
  getCombo(){
    this.loaderService.openLineLoader()
    this.stateService.getCombo()
                      .subscribe((resp: any) => {
                        if(resp.ok){
                          this.loaderService.closeLineLoader()
                          this.stateCombo = resp.param.combo
                        }
                      },(err)=>{
                        console.log(err);
                        this.loaderService.closeLineLoader()
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      })
  }
}
