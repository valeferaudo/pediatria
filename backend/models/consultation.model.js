const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ConsultationSchema = new Schema({
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  dateTime: { type: Date, default: new Date() },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
  physicalExamination: { type: String },
  weight: { type: Number },
  height: { type: Number },
  pc: {},
  ta: {},
  visualAcuity: {},
  symptomDescription: { type: String, required: true },
  treatmentDescription: { type: String, required: true },
  pathologies: [{ type: Schema.Types.ObjectId, ref: 'Pathology' }],
  comments: { type: String },
  vaccine: { type: String },
  feeding: { type: String },
}, { collection: 'consultations' });

module.exports = model('Consultation', ConsultationSchema);
