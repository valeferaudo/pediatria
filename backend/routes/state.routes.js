/*
RUTA: http:localhost:3000/api/states
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const stateCtrl = require('../controllers/state.controller');

router.get('/combo', [], stateCtrl.getCombo);
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  validateFields], stateCtrl.createState);

module.exports = router;
