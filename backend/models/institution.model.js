const mongoose = require('mongoose');

const {Schema , model} = mongoose;

const InstitutionSchema = new Schema({
    name: {type:String, required: true},
    description: {type:String, required: true},
    city: {type:Schema.Types.ObjectId,ref:'City',required:true},
    deletedDate: {type: Date, default:null},
},{collection:'institutions'})

InstitutionSchema.method('toJSON',function(){
    const {__v,_id, ...object}=this.toObject();
    object.id = _id;
    return object;
})

module.exports= model('Institution',InstitutionSchema);