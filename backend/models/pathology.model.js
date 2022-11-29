const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const PathologySchema = new Schema({
  name: { type: String, required: true },
  code: { type: Number },
  symptom: [{ type: String }],
  possibleTreatment: [{ type: String }],
  deletedDate: { type: Date, default: null },
}, { collection: 'pathologies' });

module.exports = model('Pathology', PathologySchema);
