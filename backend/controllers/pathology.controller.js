const { request, response } = require('express');
const Pathology = require('../models/pathology.model');

const pathologyCtrl = {};

const errorResponse = (res) => {
  res.status(500).json({
    ok: false,
    code: 99,
    msg: 'An unexpected error occurred',
  });
};
const existsNameResponse = (res) => res.status(400).json({
  ok: false,
  code: 10,
  msg: 'A Pathology already exists with this name',
});

const unknownIDResponse = (res) => res.status(404).json({
  ok: false,
  code: 3,
  msg: 'Unknown ID. Please insert a correct ID',
});

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
pathologyCtrl.createPathology = async (req = request, res = response) => {
  const { name } = req.body;
  try {
    const existsName = await Pathology.findOne({ name });
    if (existsName) {
      return existsNameResponse(res);
    }
    const pathology = new Pathology({
      name: req.body.name,
      code: req.body.code,
      symptom: req.body.symptom,
      possibleTreatment: req.body.possibleTreatment,
    });
    await pathology.save();
    return res.json({
      ok: true,
      msg: 'Created Pathology',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
pathologyCtrl.updatePathology = async (req = request, res = response) => {
  const pathologyID = req.params.id;
  const { name } = req.body;
  console.log(req.body, pathologyID);
  try {
    const pathologyDB = await Pathology.findById(pathologyID);
    if (!pathologyDB) {
      return unknownIDResponse(res);
    }
    const changes = req.body;
    // si no modifica el name (porque sino chocan por ser iguales)
    if (changes.name === pathologyDB.name) {
      delete changes.name;
    } else {
      const nameExists = await Pathology.findOne({ name });
      if (nameExists) {
        return existsNameResponse(res);
      }
    }
    await Pathology.findByIdAndUpdate(pathologyID, changes, { new: true });
    return res.json({
      ok: true,
      msg: 'Updated Pathology',
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
pathologyCtrl.getCombo = async (req = request, res = response) => {
  try {
    const pathologies = await Pathology.find({}, 'id name lastName');
    const combo = [];
    pathologies.forEach((pathology) => {
      const x = { id: pathology.id, text: pathology.name };
      combo.push(x);
    });
    return res.json({
      ok: true,
      msg: 'Found Pathology combo',
      param: {
        combo,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res);
  }
};
module.exports = pathologyCtrl;
