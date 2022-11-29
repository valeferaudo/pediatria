const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const PatientSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
  birthDate: { type: Date },
  address: {
    street: { type: String },
    number: { type: Number },
  },
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  legalGuardian: {
    name: { type: String },
    lastName: { type: String },
    phone: { type: Number },
    email: { type: String },
  },
  pregnancyHistory: {
    birthWeight: { type: Number },
    apgar: { type: Number },
    allergies: [{ type: String }],
  },
  personalHistory: {
    pregnancy: { type: String },
  },
  lastVisit: { type: Date, default: null },
  createdDate: { type: Date },
  deletedDate: { type: Date, default: null },
}, { collection: 'patients' });

module.exports = model('Patient', PatientSchema);
