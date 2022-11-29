/*
RUTA: http:localhost:3000/api/institutions
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const institutionCtrl = require('../controllers/institution.controller');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/combo', [validateJWT], institutionCtrl.getCombo);
router.post('/', [validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  validateFields], institutionCtrl.createInstitution);

module.exports = router;
