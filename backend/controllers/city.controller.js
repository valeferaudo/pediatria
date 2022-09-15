const { request, response } = require('express');
const City = require('../models/city.model');

const cityCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
cityCtrl.createCity = async (req = request, res = response) => {
  try {
    const city = new City({
      name: req.body.name,
      state: req.body.state,
    });
    await city.save();
    return res.json({
      ok: true,
      msg: 'Created City',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
cityCtrl.getCombo = async (req = request, res = response) => {
  try {
    const cities = await City.find({}, 'id name');
    const combo = [];
    cities.forEach((city) => {
      const x = { id: city.id, text: city.name };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found City combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

module.exports = cityCtrl;
