const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const CitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
  deletedDate: { type: Date, default: null },
}, { collection: 'cities' });

module.exports = model('City', CitySchema);
