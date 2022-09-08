const { validationResult } = require('express-validator');

const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      code: 24,
      errors: errors.mapped(),
    });
  }
  return next();
};

module.exports = { validateFields };
