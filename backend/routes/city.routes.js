/*
RUTA: http:localhost:3000/api/cities
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const cityCtrl = require('../controllers/city.controller');

router.get('/combo', [], cityCtrl.getCombo);
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  validateFields], cityCtrl.createCity);

module.exports = router;
