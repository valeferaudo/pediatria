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
const unknownIDResponse = (res) => res.status(404).json({
  ok: false,
  code: 3,
  msg: 'Unknown ID. Please insert a correct ID',
});

patientCtrl.getPatients = async (req = request, res = response) => {
  const page = parseInt(req.query.page, 10);
  const registerPerPage = parseInt(req.query.registerPerPage, 10);
  const { searchText } = req.query;
  try {
    let patients;
    let total;
    const query = {
      $and: [],
    };
    // eslint-disable-next-line no-unused-expressions
    searchText !== '' ? query.$and.push({
      $or: [
        { name: new RegExp(searchText, 'i') },
        { lastName: new RegExp(searchText, 'i') },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$name', ' ', '$lastName'] },
              regex: searchText,
              options: 'i',
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$lastName', ' ', '$name'] },
              regex: searchText,
              options: 'i',
            },
          },
        },
      ],
    }) : query;
    if (query.$and.length > 0) {
      [patients, total] = await Promise.all([Patient.find(query).populate('city')
        .skip(registerPerPage * (page - 1)).limit(registerPerPage),
      Patient.find(query).countDocuments(),
      ]);
    } else {
      [patients, total] = await Promise.all([Patient.find().populate('city')
        .skip(registerPerPage * (page - 1)).limit(registerPerPage),
      Patient.find().countDocuments(),
      ]);
    }
    total = Math.ceil(total / registerPerPage);
    res.json({
      ok: true,
      msg: 'Found patients',
      param: {
        patients,
        paginator: {
          totalPages: total,
          page,
        },
      },
    });
  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};
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
      },
      city: req.body.city,
      legalGuardian: {
        name: req.body.legalGuardianName,
        lastName: req.body.legalGuardianLastName,
        phone: req.body.legalGuardianPhone,
        email: req.body.legalGuardianEmail,
      },
      pregnancyHistory: {
        birthWeight: req.body.pregnancyHistoryBirthWeight,
        apgar: req.body.pregnancyHistoryApgar,
        allergies: req.body.pregnancyHistoryAllergies,
      },
      personalHistory: {
        pregnancy: req.body.personalHistoryPregnancy,
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
// eslint-disable-next-line no-unused-vars
patientCtrl.getCombo = async (req = request, res = response) => {
  try {
    const patients = await Patient.find({}, 'id name lastName dni');
    const combo = [];
    patients.forEach((patient) => {
      const x = { id: patient.id, text: `${patient.name} ${patient.lastName} - ${patient.dni}` };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found Patient combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
patientCtrl.getPatient = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const patientDB = await Patient.findById(id);
    if (!patientDB) {
      return unknownIDResponse(res);
    }
    return res.json({
      ok: true,
      msg: 'Found patient',
      param: {
        patient: patientDB,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error occurred',
    });
  }
};
patientCtrl.updatePatient = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const patient = {
      name: req.body.name,
      lastName: req.body.lastName,
      dni: req.body.dni,
      birthDate: req.body.birthDate,
      address: {
        street: req.body.street,
        number: req.body.streetNumber,
      },
      city: req.body.city,
      legalGuardian: {
        name: req.body.legalGuardianName,
        lastName: req.body.legalGuardianLastName,
        phone: req.body.legalGuardianPhone,
        email: req.body.legalGuardianEmail,
      },
      pregnancyHistory: {
        birthWeight: req.body.pregnancyHistoryBirthWeight,
        apgar: req.body.pregnancyHistoryApgar,
        allergies: req.body.pregnancyHistoryAllergies,
      },
      personalHistory: {
        pregnancy: req.body.personalHistoryPregnancy,
      },
    };
    const patientDB = await Patient.findByIdAndUpdate(id, patient, { new: true });
    return res.json({
      ok: true,
      msg: 'Updated Patient',
      param: {
        patient: patientDB,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
module.exports = patientCtrl;
