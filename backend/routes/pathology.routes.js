/*
RUTA: http:localhost:3000/api/pathologies
*/

const express = require('express');

const router = express.Router();
// const { check } = require('express-validator');
// const { validateFields } = require('../middlewares/validateFields');
const pathologyCtrl = require('../controllers/pathology.controller');

router.get('/', [], pathologyCtrl.getPathologies);

module.exports = router;
