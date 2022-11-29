const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor.model');

const doctorCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
const existsEmailResponse = (res) => res.status(400).json({
  ok: false,
  code: 4,
  msg: 'A doctor already exists with this email',
});

doctorCtrl.createDoctor = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const existsEmail = await Doctor.findOne({ email });
    if (existsEmail) {
      return existsEmailResponse(res);
    }
    const doctor = new Doctor({
      name: req.body.name,
      lastName: req.body.lastName,
      dni: req.body.dni,
      phone: req.body.phone,
      birthDate: req.body.birthDate,
      address: {
        street: req.body.street,
        number: req.body.number,
        city: req.body.city,
      },
      email: req.body.email,
      password: req.body.password,
      role: 'DOCTOR',
      timeTable: null,
    });
    const salt = bcrypt.genSaltSync();
    doctor.password = bcrypt.hashSync(password, salt);
    await doctor.save();
    return res.json({
      ok: true,
      msg: 'Created Doctor',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
doctorCtrl.getCombo = async (req = request, res = response) => {
  try {
    const doctors = await Doctor.find({ role: 'DOCTOR' }, 'id name lastName');
    const combo = [];
    doctors.forEach((doctor) => {
      const x = { id: doctor.id, text: `${doctor.name} ${doctor.lastName}` };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found Doctor combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

module.exports = doctorCtrl;
