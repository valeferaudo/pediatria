/*
RUTA = http://localhost:3000/api/patients
*/
const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const patientCtrl = require('../controllers/patient.controller');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/', [validateJWT], patientCtrl.getPatients);
router.get('/combo', [validateJWT], patientCtrl.getCombo);
router.get('/:id', [validateJWT], patientCtrl.getPatient);
router.post('/', [validateJWT, check('dni', 'The dni is required or wrong format').not().isEmpty(),
  check('name', 'The name is required').not().isEmpty(),
  check('lastName', 'The lastName is required').not().isEmpty(),
  // check('street', 'The street is required').not().isEmpty(),
  // check('streetNumber', 'The streetNumber is required').not().isEmpty(),
  // check('city', 'The city is required').not().isEmpty(),
  // check('legalGuardianName', 'The legalGuardianName is required').not().isEmpty(),
  // check('legalGuardianLastName', 'The legalGuardianLastName is required').not().isEmpty(),
  // check('legalGuardianPhone', 'The legalGuardianPhone is required').not().isEmpty(),
  // check('legalGuardianEmail', 'The legalGuardianEmail is required').not().isEmpty(),
  // eslint-disable-next-line max-len
  // check('personalHistoryBirthWeight', 'The personalHistoryBirthWeight is required').not().isEmpty(),
  // check('personalHistoryApgar', 'The personalHistoryApgar is required').not().isEmpty(),
  validateFields], patientCtrl.createPatient);
router.put('/:id', [validateJWT,
  check('dni', 'The dni is required or wrong format').not().isEmpty(),
  check('name', 'The name is required').not().isEmpty(),
  check('lastName', 'The lastName is required').not().isEmpty(),
  validateFields], patientCtrl.updatePatient);

module.exports = router;
