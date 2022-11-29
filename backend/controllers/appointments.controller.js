const { request, response } = require('express');
const moment = require('moment');
const cron = require('node-cron');
const Appointment = require('../models/appointment.model');
const Institution = require('../models/institution.model');
const Doctor = require('../models/doctor.model');

moment().format();
const appointmentCtrl = {};

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
appointmentCtrl.getAvailables = async (req = request, res = response) => {
  const { dateSelected } = req.query;
  try {
    // Armo las fechas desde y hasta
    let sinceDate = moment(new Date(dateSelected)).startOf('day');
    const untilDate = moment(new Date(dateSelected)).startOf('day');
    // calculo la duracion del turno en horas
    const duration = 0.25;
    // armo el arreglo de turnos entre las horas indicadas
    const appointments = [];
    do {
      let openingTime = 14;
      const closingTime = 19;
      do {
        const date = moment(sinceDate).add(openingTime, 'h');
        appointments.push(date);
        openingTime += duration;
      } while (openingTime <= closingTime);
      sinceDate = moment(sinceDate).add(1, 'day');
    } while (sinceDate <= untilDate);

    // 3- Limpiar los ya reservados
    // Obtengo los reservados de BD entre los parametros.
    let reserved = [];
    reserved = await Appointment.find({
      $and: [{ date: { $gte: moment(new Date(dateSelected)).startOf('day') } },
        { date: { $lte: moment(new Date(dateSelected)).endOf('day') } }],
    });
    // Quito los ya reservados.
    for (let i = 0; i < reserved.length; i++) {
      for (let j = 0; j < appointments.length; j++) {
        if (moment(reserved[i].date).add(3, 'h').isSame(moment(appointments[j]))) {
          appointments.splice(j, 1);
        }
      }
    }
    // 5- ORDENARLOS DE MAS RECIENTES A MAS LEJOS PARA MOSTRARLOS BIEN
    appointments.sort((elem1, elem2) => (moment(elem1).diff(moment(elem2))));
    return res.json({
      ok: true,
      msg: 'Available Appointments',
      param: {
        appointments,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};
appointmentCtrl.createAppointment = async (req, res) => {
  const { body } = req;
  try {
    const juliaDoctor = await Doctor.findOne({ dni: 36913844 });
    const consultorioExterno = await Institution.findOne({ name: 'Consultorios externos' });
    const appointment = new Appointment({
      createdDate: moment().subtract(3, 'h'),
      date: moment(body.dateTime).subtract(3, 'h'),
      institution: consultorioExterno.id,
      doctor: juliaDoctor.id,
      patient: body.patient,
    });
    const newAppointment = await appointment.save();
    return res.json({
      ok: true,
      msg: 'Created Appointment',
      param: {
        appointment: newAppointment,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: 'The Doctor is already reserved for the requested date',
      });
    }
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error ocurred',
    });
  }
};
appointmentCtrl.getAppointments = async (req = request, res = response) => {
  const date = req.query.date !== undefined ? req.query.date : null;
  try {
    const query = {
      $and: [],
    };
    if (date !== null) {
      query.$and.push({
        $and: [{ date: { $gte: moment(new Date(date)).startOf('day') } },
          { date: { $lte: moment(new Date(date)).endOf('day') } }],
      });
    }
    let sort;
    let appointments;
    if (query.$and.length > 0) {
      appointments = await Appointment.find(query).populate('patient').sort({ date: sort });
    } else {
      appointments = await Appointment.find().populate('patient').sort({ date: sort });
    }
    res.json({
      ok: true,
      msg: 'Found Appointments',
      param: {
        appointments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'An unexpected error ocurred',
    });
  }
};
appointmentCtrl.deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const appointmentDB = await Appointment.findById(id);
    if (!appointmentDB) {
      return unknownIDResponse(res);
    }
    await Appointment.findByIdAndDelete(id);
    return res.json({
      ok: true,
      msg: 'Deleted Appointment',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error ocurred',
    });
  }
};
const changeState = async (element) => {
  await Appointment.findByIdAndUpdate(element.id, { status: 'Completed' });
};
cron.schedule('0,10,20,30,40,50 * * * *', async () => {
  const appointmentsDB = await Appointment.find({ status: 'Reserved' });
  appointmentsDB.forEach((element) => {
    const difference = (element.date.getTime() - (new Date().getTime() - 10800000));
    if (difference < 0) {
      changeState(element);
    }
  });
});
module.exports = appointmentCtrl;
