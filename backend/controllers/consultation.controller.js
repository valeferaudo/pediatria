const { request, response } = require('express');
const Consultation = require('../models/consultation.model');
const Patient = require('../models/patient.model');
const Institution = require('../models/institution.model');
const Doctor = require('../models/doctor.model');

const consultationCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};

const unknownIDResponse = (res) => res.status(404).json({
  ok: false,
  code: 3,
  msg: 'Unknown ID. Please insert a correct ID',
});

consultationCtrl.getConsultation = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const consultationDB = await Consultation.findById(id).populate('institution').populate('doctor').populate('patient')
      .populate('pathologies');
    if (!consultationDB) {
      return unknownIDResponse(res);
    }
    return res.json({
      ok: true,
      msg: 'Found Consultation',
      param: {
        consultation: consultationDB,
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
consultationCtrl.getConsultations = async (req = request, res = response) => {
  let consultations;
  let total;
  const page = parseInt(req.query.page, 10);
  const registerPerPage = parseInt(req.query.registerPerPage, 10);
  try {
    const query = {
      $and: [],
    };
    if (query.$and.length > 0) {
      [consultations, total] = await Promise.all([Consultation.find(query).populate('doctor').populate('institution').populate('patient')
        .populate('pathologies')
        .sort({ dateTime: -1 })
        .skip(registerPerPage * (page - 1))
        .limit(registerPerPage),
      Patient.find(query).countDocuments(),
      ]);
    } else {
      [consultations, total] = await Promise.all([Consultation.find().populate('doctor').populate('institution').populate('patient')
        .populate('pathologies')
        .sort({ dateTime: -1 })
        .skip(registerPerPage * (page - 1))
        .limit(registerPerPage),
      Consultation.find().countDocuments(),
      ]);
    }
    total = Math.ceil(total / registerPerPage);
    return res.json({
      ok: true,
      msg: 'Found Consultations',
      param: {
        consultations,
        paginator: {
          totalPages: total,
          page,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error ocurred',
    });
  }
};
consultationCtrl.createConsultation = async (req = request, res = response) => {
  try {
    // FALTA ENCRIPTAR ESTO
    console.log(req.body.vaccine);
    const juliaDoctor = await Doctor.findOne({ dni: 36913844 });
    const consultorioExterno = await Institution.findOne({ name: 'Consultorios externos' });
    const consultation = new Consultation({
      institution: consultorioExterno.id,
      doctor: juliaDoctor.id,
      patient: req.body.patient,
      dateTime: new Date(),
      physicalExamination: req.body.physicalExamination,
      weight: req.body.weight,
      height: req.body.height,
      pc: req.body.pc,
      ta: req.body.ta,
      visualAcuity: req.body.visualAcuity,
      symptomDescription: req.body.symptomDescription,
      treatmentDescription: req.body.treatmentDescription,
      pathologies: req.body.pathologies,
      vaccine: req.body.vaccine,
      comments: req.body.comments,
      feeding: req.body.feeding,
    });
    await Patient.findByIdAndUpdate(req.body.patient, { lastVisit: new Date() });
    await consultation.save();
    return res.json({
      ok: true,
      msg: 'Created Consultation',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
consultationCtrl.createManualConsultation = async (req = request, res = response) => {
  try {
    // FALTA ENCRIPTAR ESTO
    console.log(req.body);
    const juliaDoctor = await Doctor.findOne({ dni: 36913844 });
    const consultorioExterno = await Institution.findOne({ name: 'Consultorios externos' });
    // eslint-disable-next-line prefer-const
    const consultation = new Consultation({
      institution: consultorioExterno.id,
      doctor: juliaDoctor.id,
      patient: req.body.patient,
      dateTime: new Date(req.body.dateTime),
      physicalExamination: req.body.physicalExamination,
      weight: req.body.weight,
      height: req.body.height,
      pc: req.body.pc,
      ta: req.body.ta,
      visualAcuity: req.body.visualAcuity,
      symptomDescription: req.body.symptomDescription,
      treatmentDescription: req.body.treatmentDescription,
      pathologies: req.body.pathologies,
      comments: req.body.comments,
      vaccine: req.body.vaccine,
      feeding: req.body.feeding,
    });
    await consultation.save();
    await Patient.findByIdAndUpdate(req.body.patient, { lastVisit: new Date(req.body.dateTime) });
    return res.json({
      ok: true,
      msg: 'Created Manual Consultation',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
consultationCtrl.getPatientConsultations = async (req = request, res = response) => {
  let consultations;
  let total;
  const patientID = req.params.id;
  const page = parseInt(req.query.page, 10);
  const registerPerPage = parseInt(req.query.registerPerPage, 10);
  try {
    const patientDB = await Patient.findById(patientID).populate('city');
    if (!patientDB) {
      return unknownIDResponse(res);
    }
    const query = {
      $and: [],
    };
    query.$and.push({ patient: patientID });
    if (query.$and.length > 0) {
      [consultations, total] = await Promise.all([Consultation.find(query).populate('doctor').populate('institution').populate('pathologies')
        .sort({ dateTime: -1 })
        .skip(registerPerPage * (page - 1))
        .limit(registerPerPage),
      Patient.find(query).countDocuments(),
      ]);
    } else {
      [consultations, total] = await Promise.all([Consultation.find().populate('doctor').populate('institution').populate('pathologies')
        .sort({ dateTime: -1 })
        .skip(registerPerPage * (page - 1))
        .limit(registerPerPage),
      Consultation.find().countDocuments(),
      ]);
    }
    total = Math.ceil(total / registerPerPage);
    return res.json({
      ok: true,
      msg: 'Found Patient Consultations',
      param: {
        consultations,
        patient: patientDB,
        paginator: {
          totalPages: total,
          page,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error ocurred',
    });
  }
};
consultationCtrl.updateConsultation = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const consultationDB = await Consultation.findById(id);
    if (!consultationDB) {
      return unknownIDResponse(res);
    }
    delete req.body.dateTime;
    await Consultation.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({
      ok: true,
      msg: 'Updated Consultation',
      param: {
        consultation: consultationDB,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
module.exports = consultationCtrl;
