/*
RUTA: http:localhost:3000/api/consultations
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const consultationCtrl = require('../controllers/consultation.controller');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/:id', [validateJWT], consultationCtrl.getConsultation);
router.get('/patient/:id', [validateJWT], consultationCtrl.getPatientConsultations);
router.get('/', [validateJWT], consultationCtrl.getConsultations);
router.post('/', [validateJWT,
  check('patient', 'Patient is required').not().isEmpty(),
  validateFields], consultationCtrl.createConsultation);
router.post('/manual', [validateJWT,
  check('dateTime', 'Datetime is required').not().isEmpty(),
  check('patient', 'Patient is required').not().isEmpty(),
  validateFields], consultationCtrl.createManualConsultation);
router.put('/:id', [validateJWT,
  check('patient', 'Patient is required').not().isEmpty(),
  validateFields], consultationCtrl.updateConsultation);
module.exports = router;
