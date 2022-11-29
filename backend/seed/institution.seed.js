const Institution = require('../models/institution.model');
const City = require('../models/city.model');
const State = require('../models/state.model');

const fillInstitution = async () => {
  try {
    let newState;
    let newCity;
    const existsState = await State.findOne({ name: 'Santa Fe' });
    if (!existsState) {
      const state = new State({
        name: 'Santa Fe',
      });
      newState = await state.save();
    }
    const existsCity = await City.findOne({ name: 'San Vicente' });
    if (!existsCity) {
      const city = new City({
        name: 'San Vicente',
        state: newState.id,
      });
      newCity = await city.save();
    }
    const existsInstitution = await Institution.findOne({ name: 'Consultorios externos' });
    if (existsInstitution) {
      return;
    }
    const institution = new Institution({
      name: 'Consultorios externos',
      city: newCity.id,
    });
    await institution.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  fillInstitution,
};
