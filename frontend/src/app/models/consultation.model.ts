import { Doctor } from "./doctor.model";
import { Patient } from "./patient.model";
import { Pathology } from "./pathology.model";
import { Appointment } from "./appointment.model";
import { Institution } from "./institution.model";

export class Consultation{
    constructor(
        public institution : Institution,
        public doctor: Doctor,
        public patient: Patient,
        public dateTime: Date,
        public appointment: Appointment,
        public physicalExamination: string,
        public weight: number ,
        public height: number,
        public pc: any,
        public ta: any,
        public visualAcuity: any,
        public symptomDescription: string,
        public treatmentDescription: string,
        public pathologies: Pathology [],
        public comments: string,
        public feeding: string,
        public vaccine: string,
        public _id?: string
        ){}
}