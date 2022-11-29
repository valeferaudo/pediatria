/*
RUTA = http://localhost:3000/api/appointment
*/
const express = require('express');

const router = express.Router();
// const { check } = require('express-validator');
const appointmentCtrl = require('../controllers/appointments.controller');
// const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/availables', [validateJWT], appointmentCtrl.getAvailables);
router.get('/', [validateJWT], appointmentCtrl.getAppointments);
router.post('/', [validateJWT], appointmentCtrl.createAppointment);
router.delete('/:id', [validateJWT], appointmentCtrl.deleteAppointment);
module.exports = router;
