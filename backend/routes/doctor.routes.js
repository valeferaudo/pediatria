/*
RUTA: http:localhost:3000/api/doctors
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const doctorCtrl = require('../controllers/doctor.controller');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/combo', [validateJWT], doctorCtrl.getCombo);
router.post('/', [validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('lastName', 'Last Name is required').not().isEmpty(),
  check('phone', 'Phone is required').not().isEmpty(),
  check('dni', 'DNI is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),

  validateFields], doctorCtrl.createDoctor);

module.exports = router;
