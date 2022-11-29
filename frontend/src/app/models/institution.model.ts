import { City } from "./city.model";

export class Institution{
    constructor(
        public name : string,
        public description: string,
        public city: City,
        public deletedDate: Date,
        public _id?: string
        ){}
}