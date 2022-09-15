const { request, response } = require('express');
const State = require('../models/state.model');

const stateCtrl = {};

const existsNameResponse = (res) => res.status(400).json({
  ok: false,
  code: 10,
  msg: 'A State already exists with this name',
});
const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
stateCtrl.createState = async (req = request, res = response) => {
  const { name } = req.body;
  try {
    const existsName = await State.findOne({ name });
    if (existsName) {
      return existsNameResponse(res);
    }
    const state = new State({
      name: req.body.name,
    });
    await state.save();
    return res.json({
      ok: true,
      msg: 'Created State',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
stateCtrl.getCombo = async (req = request, res = response) => {
  try {
    const states = await State.find({ state: true }, 'id name');
    const combo = [];
    states.forEach((state) => {
      const x = { id: state.id, text: state.name };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found State combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

module.exports = stateCtrl;
