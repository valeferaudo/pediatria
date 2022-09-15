const { request, response } = require('express');
const Patient = require('../models/patient.model');

const patientCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
const existsDNIResponse = (res) => res.status(400).json({
  ok: false,
  code: 10,
  msg: 'A Patient already exists with this DNI',
});

patientCtrl.createPatient = async (req = request, res = response) => {
  const { dni } = req.body;
  try {
    const existsDNI = await Patient.findOne({ dni });
    if (existsDNI) {
      return existsDNIResponse(res);
    }
    const patient = new Patient({
      name: req.body.name,
      lastName: req.body.lastName,
      dni: req.body.dni,
      birthDate: req.body.birthDate,
      address: {
        street: req.body.street,
        number: req.body.streetNumber,
        city: req.body.city,
      },
      legalGuardian: {
        name: req.body.legalGuardianName,
        lastName: req.body.legalGuardianLastName,
        phone: req.body.legalGuardianPhone,
        email: req.body.legalGuardianEmail,
      },
      personalHistory: {
        birthWeight: req.body.personalHistoryBirthWeight,
        apgar: req.body.personalHistoryApgar,
        allergies: req.body.personalHistoryAllergies,
      },
      familyHistory: {
        pregnancyHistory: req.body.familyHistoryPregnancyHistory,
        gynaecologist: req.body.familyHistoryGynaecologist,
      },
      createdDate: new Date(),
    });
    await patient.save();
    return res.json({
      ok: true,
      msg: 'Created Patient',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};

module.exports = patientCtrl;
