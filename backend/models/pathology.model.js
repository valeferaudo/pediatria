const mongoose = require('mongoose');

const {Schema , model} = mongoose;

const PathologySchema = new Schema({
    name: {type:String, required: true},
    code: {type:Number},
    symptom: [{type:String}],
    possibleTreatment:[{type:String}],
    deletedDate: {type: Date, default:null},
},{collection:'phatologies'})

PathologySchema.method('toJSON',function(){
    const {__v,_id, ...object}=this.toObject();
    object.id = _id;
    return object;
})

module.exports= model('Phatology',PathologySchema);