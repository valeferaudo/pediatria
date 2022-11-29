const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const DaySchema = new Schema({
  idDay: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
}, { collection: 'days' });

module.exports = model('Day', DaySchema);
