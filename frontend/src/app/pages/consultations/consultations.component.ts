import { Component, OnInit } from '@angular/core';
import { Consultation } from 'src/app/models/consultation.model';
import { ConsultationService } from '../../services/consultation.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { ErrorsService } from '../../services/errors.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.css']
})
export class ConsultationsComponent implements OnInit {

  
  hiddenOldConsultationModal: boolean = false;
  searchText: string = '';
  consultations: Consultation[] = [];
  filterON: boolean = false;
  modalMode: 'create' | 'update';
  consultation: Consultation = null;
  consultationSelected: Consultation = null;
  //PAGINATOR
  totalPages = null;
  page = 1;

  doNotCloseMenu = (event) => event.stopPropagation();

  constructor(private consultationService: ConsultationService,
              private sweetAlertService: SweetAlertService,
              private loaderService: LoaderService,
              private errorService: ErrorsService) {}
              
  ngOnInit(): void {
    this.getConsultations();
  }

  getConsultations(){
    this.loaderService.openLineLoader()
    this.consultationService.getConsultations(this.page)
                    .subscribe((resp:any)=>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader()
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
  createConsultationModal(){
    this.modalMode = 'create';
    this.hiddenOldConsultationModal = true;
  }
  updateConsultationModal(consultation){
    this.consultationSelected = consultation
    this.modalMode = 'update';
    this.hiddenOldConsultationModal = true;
  }
  closeModal(){
    this.hiddenOldConsultationModal = false;
  }
  paginate(page){
    this.page = page;
    this.getConsultations();
  }

}
