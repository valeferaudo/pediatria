
export class Doctor{
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
        public phone: number,
        public email: string,
        public deletedDate?: Date,
        public timeTable?: [{
          institution: string,
          day: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7]},
          startHour: Date,
          endHour: Date
        }],
        public password?: string,
        public role?: 'DOCTOR' | 'ADMIN',
        public uid?: string,
        ){}

    /*Feature for user's image (add image in constructor) use this with the instance
    get imageURL(){
        if (this.image.includes('http')){
            return this.image;
        }
        if(this.image){
            return `${base_url}/uploads/user/${this.image}`
        }
        else{
            return `${base_url}/uploads/no-image.png`
        }
    }*/
}