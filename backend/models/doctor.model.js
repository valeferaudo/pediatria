const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const DoctorSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  dni: { type: Number, required: true, unique: true },
  birthDate: { type: Date, required: true },
  address: {
    street: { type: String },
    number: { type: Number },
    city: { type: Schema.Types.ObjectId, ref: 'City' },
  },
  email: {
    type: String, required: true, lowercase: true, unique: true,
  },
  password: { type: String, required: true },
  role: {
    type: String, enum: ['ADMIN', 'DOCTOR'], default: 'DOCTOR', required: true,
  },
  deletedDate: { type: Date, default: null },
  timeTable: [{
    institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
    day: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], default: null },
    startHour: { type: Date, default: null },
    endHour: { type: Date, default: null },
  }],
}, { collection: 'doctors' });

DoctorSchema.method('toJSON', () => {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Doctor', DoctorSchema);
