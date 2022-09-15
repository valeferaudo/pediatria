
export class Patient{
    constructor(
        public name: string,
        public lastName: string,
        public dni: string,
        public birthDate: Date,
        public address: {
            street: string,
            number: number,
            city: string,
        },
        public legalGuardian: {
           name: string,
           lastName: string,
           phone: number,
           email: string
        },
        public personalHistory: {
            birthWeight: number,
            apgar: number,
            allergies: [string],
         },
         public familyHistory: {
            pregnancyHistory: string,
            gynaecologist: string,
         },
        public createdDate?: Date,
        public deletedDate?: Date,
        public id?: string,
        ){}

}
