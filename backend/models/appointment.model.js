const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const AppointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  createdDate: { type: Date, required: true },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  duration: { type: Number, default: 20, required: true },
  status: {
    type: String, enum: ['Reserved', 'Completed'], default: 'Reserved', required: true,
  },
  deletedDate: { type: Date, default: null },
}, { collection: 'appointments' });

AppointmentSchema.index({ date: 1, doctor: 1 }, { unique: true });

module.exports = model('Appointment', AppointmentSchema);
