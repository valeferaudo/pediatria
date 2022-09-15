export class Pathology{
    constructor(
        public name : string,
        public code: string,
        public possibleTreatment: [string],
        public deletedDate: Date,
        public id?: string,
        ){}
}