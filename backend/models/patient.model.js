const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const PatientSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
  birthDate: { type: Date, required: true },
  address: {
    street: { type: String, required: true },
    number: { type: Number, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  },
  legalGuardian: {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  personalHistory: {
    birthWeight: { type: Number },
    apgar: { type: Number },
    allergies: { type: String },
  },
  familyHistory: {
    pregnancyHistory: { type: String },
    gynaecologist: { type: String },

  },
  deletedDate: { type: Date, default: null },
}, { collection: 'patients' });

PatientSchema.method('toJSON', () => {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Patient', PatientSchema);
