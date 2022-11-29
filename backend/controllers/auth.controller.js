const bycript = require('bcryptjs');
const { request, response } = require('express');
const Doctor = require('../models/doctor.model');

const authCtrl = {};

const { generateJWT } = require('../helpers/jwt');
// Encripta psw

authCtrl.login = async (req = request, res = response) => {
  const { email, password } = req.body;
  const { type } = req.body;
  try {
    const doctorDB = await Doctor.findOne({ email });
    if (!doctorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Wrong email or password',
        code: 22,
      });
    }
    const validatePassword = bycript.compareSync(password, doctorDB.password);
    if (!validatePassword) {
      return res.status(404).json({
        ok: false,
        msg: 'Wrong email or password',
        code: 22,
      });
    }
    // SI SE LOGUEA UN USUARIO COMUN --> 'USER' ; SI SE LOGUEA OTRO --> 'CENTER'
    // if (type === 'DOCTOR') {
    //   if (doctorDB.role !== 'ADMIN') {
    //     return res.status(403).json({
    //       ok: false,
    //       msg: 'User does not have permission in this module',
    //       code: 5,
    //     });
    //   }
    // }
    // if (type === 'ADMIN') {
    //   if (doctorDB.role !== 'DOCTOR') {
    //     return res.status(403).json({
    //       ok: false,
    //       msg: 'User does not have permission in this module',
    //       code: 5,
    //     });
    //   }
    // }
    if (doctorDB.deletedDate !== null) {
      return res.status(403).json({
        ok: false,
        msg: 'User is not allowed',
        code: 5,
      });
    }
    // GENERAR JWT
    const token = await generateJWT(doctorDB.id);
    // filtrar el doctorDB porq muestra todo aca, (psw)
    return res.json({
      ok: true,
      msg: 'User logged in',
      token,
      user: doctorDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'An unexpected error occurred',
    });
  }
};

authCtrl.renewToken = async (req, res) => {
  const { uid } = req;
  // GENERAR JWT
  const token = await generateJWT(uid);

  // OBTENER USUARIO
  const doctorDB = await Doctor.findById(uid, {
    uid: 1,
    name: 1,
    lastName: 1,
    birthDate: 1,
    address: 1,
    phone: 1,
    email: 1,
    deletedDate: 1,
    timeTable: 1,
    role: 1,
  });
  if (!doctorDB) {
    return console.log('NO ENCUENTRA USUARIO');
  }
  const doctor = {
    uid: doctorDB.id,
    name: doctorDB.name,
    lastName: doctorDB.lastName,
    birthDate: doctorDB.birthDate,
    address: doctorDB.address,
    phone: doctorDB.phone,
    email: doctorDB.email,
    deletedDate: doctorDB.deletedDate,
    timeTable: doctorDB.timeTable,
    role: doctorDB.role,
  };
  return res.json({
    ok: true,
    doctor,
    token,
  });
};

module.exports = authCtrl;
