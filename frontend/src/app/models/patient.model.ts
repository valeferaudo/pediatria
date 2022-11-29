import { City } from './city.model';
export class Patient{
    constructor(
        public name: string,
        public lastName: string,
        public dni: string,
        public birthDate: any,
        public address: {
            street: string,
            number: number,
        },
        public city: City,
        public legalGuardian: {
           name: string,
           lastName: string,
           phone: number,
           email: string
        },
        public pregnancyHistory: {
            birthWeight: number,
            apgar: number,
            allergies: [string],
         },
         public personalHistory: {
            pregnancy: string,
         },
        public lastVisit?: Date,
        public createdDate?: Date,
        public deletedDate?: Date,
        public _id?: string,
        ){}

}
