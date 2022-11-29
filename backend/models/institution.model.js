const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const InstitutionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  deletedDate: { type: Date, default: null },
}, { collection: 'institutions' });

module.exports = model('Institution', InstitutionSchema);
