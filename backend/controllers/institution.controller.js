const { request, response } = require('express');
const Institution = require('../models/institution.model');

const institutionCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
institutionCtrl.createInstitution = async (req = request, res = response) => {
  try {
    const institution = new Institution({
      name: req.body.name,
      description: req.body.state,
      city: req.body.city,
    });
    await institution.save();
    return res.json({
      ok: true,
      msg: 'Created Institution',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
institutionCtrl.getCombo = async (req = request, res = response) => {
  try {
    const institutions = await Institution.find({}, 'id name');
    const combo = [];
    institutions.forEach((city) => {
      const x = { id: city.id, text: city.name };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found Institution combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

module.exports = institutionCtrl;
