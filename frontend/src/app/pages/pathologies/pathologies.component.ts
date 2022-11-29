import { Component, OnInit } from '@angular/core';
import { ErrorsService } from 'src/app/services/errors.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { PathologyService } from 'src/app/services/pathology.service';
import { Pathology } from 'src/app/models/pathology.model';
import { PathologyFilter } from 'src/app/interfaces/pathologyFilter.interface';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-pathologies',
  templateUrl: './pathologies.component.html',
  styleUrls: ['./pathologies.component.css']
})
export class PathologiesComponent implements OnInit {

  hiddenModal: boolean = false;
  searchText: string = '';
  pathologies: Pathology[] = [];
  filterON: boolean = false;
  modalMode: 'create' | 'update';
  pathology: Pathology = null;
  pathologySelected: Pathology = null;
  //filter
  filters: PathologyFilter = {
    text: '',
  }
  //PAGINATOR
  totalPages = null;
  page = 1;
  doNotCloseMenu = (event) => event.stopPropagation();

  constructor(private pathologyService: PathologyService,
              private sweetAlertService: SweetAlertService,
              private loaderService: LoaderService,
              private errorService: ErrorsService) {}
              
  ngOnInit(): void {
    this.getPathologies();
  }

  getPathologies(){
    this.loaderService.openLineLoader()
    this.pathologyService.getPathologies(this.filters,this.page)
                    .subscribe((resp:any)=>{
                      if(resp.ok){
                        this.loaderService.closeLineLoader()
                        this.pathologies = resp.param.pathologies;
                        this.page = resp.param.paginator.page;
                        this.totalPages = resp.param.paginator.totalPages;
                      }
                    }, (err) => {
                      console.log(err)
                      this.loaderService.closeLineLoader()
                      this.errorService.showErrors(err.error.code,err.error.msg);
                    })
  }
  searchPathologies(text: string){
    this.searchText = text;
    this.fillFilterObject();
    this.getPathologies();
  }
  refreshTable(){
    this.searchText = '';
    this.fillFilterObject();
    this.getPathologies();
  }
  fillFilterObject(){
    this.filters = {
      text: this.searchText,
    }
  }
  createPathologyModal(){
    this.modalMode = 'create';
    this.hiddenModal = true;
  }
  updatePathologyModal(pathology){
    this.pathologySelected = pathology
    this.modalMode = 'update';
    this.hiddenModal = true;
  }
  closeModal(){
    this.hiddenModal = false;
  }
  paginate(page){
    this.page = page;
    this.getPathologies();
  }
}
