const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor.model');

const fillAdmin = async () => {
  try {
    const existsAdmin = await Doctor.findOne({ email: 'admin@admin.com' });
    if (existsAdmin) {
      return;
    }
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync('123456789', salt);
    const admin = new Doctor({
      name: 'Admin',
      lastName: 'Admin',
      dni: 0,
      phone: '5555555555',
      birthDate: new Date(),
      address: {
        street: null,
        number: null,
        city: null,
      },
      email: 'admin@admin.com',
      password: passwordHash,
      role: 'ADMIN',
      timeTable: null,
    });
    await admin.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  fillAdmin,
};
