export class Pathology{
    constructor(
        public name : string,
        public code: string,
        public symptom: string[],
        public possibleTreatment: string[],
        public deletedDate: Date,
        public _id?: string,
        ){}
}