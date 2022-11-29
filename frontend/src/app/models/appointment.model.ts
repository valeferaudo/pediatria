import { Patient } from "./patient.model";
import { Doctor } from "./doctor.model";
import { Institution } from "./institution.model";

export class Appointment{
    constructor(
        public patient: Patient,
        public doctor : Doctor,
        public date: Date,
        public institution: Institution,
        public duration: number,
        public deletedDate: Date,
        public _id?: string
        ){}
}
