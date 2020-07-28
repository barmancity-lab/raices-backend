/*
 *
 * users.js
 *
 * Created on 23th march
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones del admin
'use strict';
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
let db = require('../models');

// Renderiza la pantalla principal
function adminIndex(req, res) {
  let view = 'admin/index';
  res.render(view, {});
}


// Renderiza el listado de colegios
function schoolsList(req, res) {

  let view = 'admin/schools/schoolsList';
  db.school.findAll()
    .then(schools => {
      res.render(view, {schools: schools});
    });

}

// Renderiza el formulario de alta de colegio
function schoolsNew(req, res) {
  // Defino la vista de destino
  let view = 'admin/schools/schoolsNew';
  db.role.findAll()
    .then(roles => {
      res.render(view, {roles: roles});
    });
}


// Trae de la DB los datos de la escuela
function schoolsEdit(req, res) {

  let schoolId = req.params.schoolId

  let view = 'admin/schools/schoolsEdit';

  db.school.findOne({
    where: {id: schoolId},
    // Si fue exitosa la coneccion con la db
  }).then(school => {

    res.render(view, {school: school});

  });

}


// Da de alta una escuela
function schoolsStore(req, res) {

  // Si es una escuela nueva

  let levels = '';
  let image = '';
  if (req.body.level !== undefined){
    levels = JSON.stringify( req.body.level)
  }

  if(req.file !== undefined){
    image = req.file.path;
  }


  if (req.body.schoolId === 'NEW') {



    // Llamo al modelo para crear el objeto con los tados a insertar
    db.school.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      code: req.body.code,
      info:levels,
      image:image.replace('public','')
      // Si se inserto correctamente devuelve un json con los datos ingresados
    }).then(function (item) {

      let response = {'data': item, 'error': false, 'result': true, "dataError": {}}
      res.json(response);

      // Si no se inserto correctamente devuelve un json con el error
    }).catch(function (err) {
      let dataError = {};

      dataError.errorMsj = err.message;
      dataError.errorCode = err.code;

      let response = ({"data": '', "error": true, 'result': false, "dataError": dataError});
      res.json(response);
    });

    // Si es una edicion de usuario
  } else {

    let fields = {}
    if (image !== '') {
       fields = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        code: req.body.code,
        info: levels,
        image: image.replace('public', '')
      };
    }else{
       fields = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        code: req.body.code,
        info: levels
      };
    }
    db.school.update(
      fields
    , {
      where: {id: req.body.schoolId},
      returning: true,
      plain: true
    }).then(function (item) {

      let response = {'data': item, 'error': false, 'result': true, "dataError": {}}
      res.json(response);

      // Si no se inserto correctamente devuelve un json con el error
    }).catch(function (err) {

      console.log(err);

      let dataError = {};

      dataError.errorMsj = err.message;
      dataError.errorCode = err.code;

      let response = ({"data": '', "error": true, 'result': false, "dataError": dataError});
      res.json(response);
    });

  }

}


//Exporta la funciones para ser llamadas externamente.
module.exports = {
  adminIndex: adminIndex,
  schoolsList: schoolsList,
  schoolsNew: schoolsNew,
  schoolsStore: schoolsStore,
  schoolsEdit: schoolsEdit,

};

