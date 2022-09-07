const mongoose = require('mongoose');

const {Schema , model} = mongoose;

const CitySchema = new Schema({
    name: {type:String, required: true},
    state: {type:Schema.Types.ObjectId,ref:'State',required:true},
    deletedDate: {type: Date, default:null},
},{collection:'cities'})

CitySchema.method('toJSON',function(){
    const {__v,_id, ...object}=this.toObject();
    object.id = _id;
    return object;
})

module.exports= model('City',CitySchema);