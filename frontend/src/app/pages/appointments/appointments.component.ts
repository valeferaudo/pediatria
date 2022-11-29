import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Combo } from 'src/app/interfaces/combo.interface';
import { ErrorsService } from 'src/app/services/errors.service';
import { PatientService } from 'src/app/services/patient.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  createMode: boolean = false;
  appointmentForm: FormGroup;
  hiddenModal: boolean = false;
  selectedValuePatient: any;
  searchValuePatient: any;
  patientsCombo: Combo[] = [];
  patientsFiltered: Combo[];
  selectedValueInstitution: any;
  searchValueInstitution: any;

  //CALENDAR
  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];
  today = new Date()
  selectedDate = new Date()
  monthSelect: any[];
  dateSelect: any;
  dateValue: any;
  timeSelected = null;
  appointments: [] = [];
  availables: [] = [];
  timeError = false;
  patientError = false;

  constructor(private patientService: PatientService,
              private errorService: ErrorsService,
              private appointmentService: AppointmentService,
              private sweetAlertService: SweetAlertService,
              private loaderService: LoaderService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPatientCombo();
    this.createAppointmentForm();
    this.getAppointments();
    this.getDaysFromDate(new Date().getMonth() + 1, new Date().getFullYear())
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
    this.appointmentForm.patchValue({
      patient: option.id
    })
  }
  newPatient(){
    this.selectedValuePatient = "";
  }
  getPatientCombo() {
    this.loaderService.openLineLoader()
    this.patientService.getCombo()
                      .subscribe((resp: any) => {
                        if(resp.ok){
                          this.loaderService.closeLineLoader()
                          this.patientsFiltered = resp.param.combo;
                          this.patientsCombo = resp.param.combo;
                        }
                      },(err)=>{
                        console.log(err);
                        this.loaderService.closeLineLoader()
                        this.errorService.showErrors(err.error.code,err.error.msg);
                      })
  }
  createAppointmentForm(){
    this.appointmentForm = this.fb.group({
      patient: [
        "",
        [Validators.required],
      ],
      dateTime: [
        { value: "" },
        [Validators.required],
      ],
    })
  }
  
  getDaysFromDate(month, year) {
    const startDate = moment.utc(new Date(`${year}/${month}/01 03:00`))
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;
    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);
    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(new Date(`${year}-${month}-${a}`));
      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
    this.getAvailables();
  }

  changeMonth(flag) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"));
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
    }
  }

  clickDay(day) {
    const monthYear = this.dateSelect.format('YYYY-MM')
    const parse = `${monthYear}-${day.value}`
    const objectDate = moment(parse)
    this.dateValue = objectDate;
    this.selectedDate = new Date(this.dateValue._d)
    this.getAvailables()
    this.getAppointments();
  }
  getAvailables(){
    this.loaderService.openLineLoader()
    this.appointmentService.getAvailables(this.selectedDate)
            .subscribe((resp:any)=>{
              if(resp.ok){
                this.loaderService.closeLineLoader()
                this.availables = resp.param.appointments
              }
            }, (err) => {
              console.log(err)
              this.loaderService.closeLineLoader()
              this.errorService.showErrors(err.error.code,err.error.msg);
            })
  }
  clickHour(date){
    this.timeSelected = date;
    this.appointmentForm.patchValue({
      dateTime: date
    })
    this.timeError = false;
  }
  createAppointment(){
    if(!this.timeSelected){
      this.timeError = true;
    }
    if(this.appointmentForm.controls['patient'].value === '' ){
      this.patientError = true;
    }
    if(this.patientError || this.timeError) return

    this.sweetAlertService.showSwalConfirmation({
      title: '¿Crear turno?',
      text: ``,
      icon: 'question',
    }).then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.appointmentService.createAppointments(this.appointmentForm.value)
        .subscribe((resp:any)=>{
          if(resp.ok){
            this.loaderService.closeLineLoader()
            this.selectedValuePatient = '';
            this.timeSelected = null;
            this.getAvailables();
            this.getAppointments();
            this.createMode = false;
            this.sweetAlertService.showSwalResponseDelay({
              title: 'Turno Reservado',
              text: ``,
              icon: 'success',
            })
          }
        }, (err) => {
          console.log(err)
          this.loaderService.closeLineLoader()
          this.errorService.showErrors(err.error.code,err.error.msg);
        })  
      }
    });
  }
  getAppointments(){
    this.loaderService.openLineLoader()
    this.appointmentService.getAppointments(this.selectedDate)
            .subscribe((resp:any)=>{
              if(resp.ok){
                this.loaderService.closeLineLoader()
                this.appointments = resp.param.appointments
              }
            }, (err) => {
              console.log(err)
              this.loaderService.closeLineLoader()
              this.errorService.showErrors(err.error.code,err.error.msg);
            })
  }
  getBeforeAppointments(){
    this.selectedDate = moment(new Date(this.selectedDate)).subtract(1,'d').toDate()
    this.getAppointments()
  }
  getNextAppointments(){
    this.selectedDate = moment(new Date(this.selectedDate)).add(1,'d').toDate()
    this.getAppointments()
  }
  goConsultation(patient: Patient){
    if(patient.lastVisit === null){
      this.router.navigate([`/doctor/patient/consultation/${patient._id}`])
    }else{
      this.router.navigate([`/doctor/consultation/${patient._id}`])
    }
  }
  cancelAppointment(appointment){
    this.sweetAlertService.showSwalConfirmation({
      title: '¿Eliminar el turno?',
      text: appointment.status === 'Completed' ? 'El turno ya se completó' : '',
      icon: 'question',
    }).then((result) => {
      if (result.value) {
        this.loaderService.openLineLoader()
        this.appointmentService.deleteAppointment(appointment._id)
                                .subscribe((resp: any) => {
                                  if(resp.ok){
                                    this.loaderService.closeLineLoader()
                                    this.sweetAlertService.showSwalResponseDelay({
                                      title: 'Turno Eliminado',
                                      text: appointment.status === 'Completed' ? '' : 'Notifique al paciente',
                                      icon: 'success',
                                    })
                                    this.getAvailables();
                                    this.getAppointments();
                                  }
                                },(err)=>{
                                  console.log(err);
                                  this.loaderService.closeLineLoader()
                                  this.errorService.showErrors(err.error.code,err.error.msg);
                                })
      }
    });
  }
  openNewPatientModal(){
    this.hiddenModal = true;
  }
  closeModal(){
    this.hiddenModal = false;
  }
}
