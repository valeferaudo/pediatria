import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Combo } from 'src/app/interfaces/combo.interface';
import { PathologyService } from '../../services/pathology.service';
import { ErrorsService } from '../../services/errors.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { ConsultationService } from '../../services/consultation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Consultation } from 'src/app/models/consultation.model';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-consultation-edit',
  templateUrl: './consultation-edit.component.html',
  styleUrls: ['./consultation-edit.component.css']
})
export class ConsultationEditComponent implements OnInit {

  consultationForm: FormGroup;
  mode: 'edit' | 'create' = null;
  consultation : Consultation = null;

  selectedValuePathology: any;
  searchValuePathology: any;
  pathologiesFiltered: Combo[];
  pathologiesCombo: Combo [] = [];
  hiddenPathologyModal: boolean = false;
  pathologiesID: string [] = [];
  pathologiesText: string [] = [];

  constructor(private fb: FormBuilder,
          private pathologyService: PathologyService,
          private errorService: ErrorsService,
          private sweetAlertService: SweetAlertService,
          private route: ActivatedRoute,
          private router: Router,
          private loaderService: LoaderService,
          private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.createForm();
    this.getParam()
    this.getPathologyCombo();
  }
  getParam(){
    this.route.params
    .subscribe(params => {
      if(params.id){
        this.mode = 'edit'
        this.getConsultation(params.id)
      }else{
        this.mode = 'create'
      }
    }
  );
  }
  getConsultation(id){
    this.loaderService.openLineLoader()
    this.consultationService.getConsultation(id)
                .subscribe((resp: any) =>{
                  if(resp.ok){
                    this.loaderService.closeLineLoader()
                    this.consultation = resp.param.consultation;
                    this.fillForm();
                  }
                },(err) => {
                  console.log(err);
                  this.loaderService.closeLineLoader()
                  this.errorService.showErrors(err.error.code,err.error.msg);
                })
  }
  fillForm(){
    this.consultationForm.patchValue({
      patient: this.consultation.patient._id,
      symptomDescription: this.consultation.symptomDescription,
      treatmentDescription: this.consultation.treatmentDescription,
      physicalExamination: this.consultation.physicalExamination,
      pathologies:this.consultation.pathologies,
      weight:this.consultation.weight,
      height: this.consultation.height,
      pc: this.consultation.pc,
      ta: this.consultation.ta,
      visualAcuity: this.consultation.visualAcuity,
      comments: this.consultation.comments,
      feeding: this.consultation.feeding,
      vaccine: this.consultation.vaccine,
    })
    this.consultation.pathologies.forEach(pathology => {
      this.setPathology(pathology._id)
    });
  }
  createForm(){
    this.consultationForm = this.fb.group({
      patient: [""],
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
        this.loaderService.openLineLoader()
        this.consultationService.updateConsultation(this.consultation._id,this.consultationForm.value)
                    .subscribe((resp: any) =>{
                      this.loaderService.closeLineLoader()
                      this.sweetAlertService.showSwalResponse({
                        title: 'Consulta editada',
                        text:'',
                        icon: 'success'
                      })
                      if((this.router.url).split("/").includes("consultation-on-edit")){
                        this.router.navigate([`/doctor/consultation/${this.consultation?.patient?._id}`])
                      }
                      else {
                        this.router.navigate([`/doctor/consultations`])
                      }
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
  closeModal(){
    this.hiddenPathologyModal = false;
  }
}
