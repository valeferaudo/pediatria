/*
RUTA: http:localhost:3000/api/pathologies
*/

const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const pathologyCtrl = require('../controllers/pathology.controller');
const { validateJWT } = require('../middlewares/validateJWT');

router.get('/', [validateJWT], pathologyCtrl.getPathologies);
router.get('/combo', [validateJWT], pathologyCtrl.getCombo);
router.post('/', [validateJWT,
  check('name', 'Name field is required').not().isEmpty(),
  validateFields], pathologyCtrl.createPathology);
router.put('/:id', [validateJWT,
  check('name', 'Name field is required').not().isEmpty(),
  validateFields], pathologyCtrl.updatePathology);

module.exports = router;
