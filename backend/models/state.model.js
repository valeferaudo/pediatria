const mongoose = require('mongoose');

const {Schema , model} = mongoose;

const StateSchema = new Schema({
    name:{type:String, required: true},
    deletedDate:{type: Date, default:null},
},{collection:'states'})

StateSchema.method('toJSON',function(){
    const {__v,_id, ...object}=this.toObject();
    object.id = _id;
    return object;
})

module.exports= model('State',StateSchema);