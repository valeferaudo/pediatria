/*
RUTA = http://localhost:3000/api/login
*/
const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const authCtrl = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

router.post('/', [check('email', 'The email is required or wrong format').isEmail(),
  check('password', 'The password is required').not().isEmpty(),
  validateFields], authCtrl.login);
router.get('/renew', validateJWT, authCtrl.renewToken);

module.exports = router;
