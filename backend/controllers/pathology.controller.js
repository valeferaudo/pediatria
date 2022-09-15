const { request, response } = require('express');
const Pathology = require('../models/pathology.model');

const pathologyCtrl = {};

function errorResponse(res) {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
}

pathologyCtrl.getPathologies = async (req = request, res = response) => {
  const searchText = req.query.text;
  const page = parseInt(req.query.page, 10);
  const registerPerPage = parseInt(req.query.registerPerPage, 10);
  try {
    let pathologies;
    let total;
    const query = {
      $and: [],
    };
    if (searchText !== '') {
      query.$and.push({ name: new RegExp(searchText, 'i') });
    }
    if (query.$and.length > 0) {
      [pathologies, total] = await Promise.all([Pathology.find(query)
        .skip(registerPerPage * (page - 1)).limit(registerPerPage),
      Pathology.find(query).countDocuments(),
      ]);
    } else {
      [pathologies, total] = await Promise.all([Pathology.find()
        .skip(registerPerPage * (page - 1)).limit(registerPerPage),
      Pathology.find().countDocuments(),
      ]);
    }
    total = Math.ceil(total / registerPerPage);
    res.json({
      ok: true,
      msg: 'Found pathologies',
      param: {
        pathologies,
        paginator: {
          totalPages: total,
          page,
        },
      },
    });
  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};

module.exports = pathologyCtrl;
