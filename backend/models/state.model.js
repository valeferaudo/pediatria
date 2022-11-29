const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const StateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  deletedDate: { type: Date, default: null },
}, { collection: 'states' });

module.exports = model('State', StateSchema);
