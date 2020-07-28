/*
 *
 * students.js
 *
 * Created on 08th april
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones de los alumnos
'use strict';
// Llama al modelo
let db = require('../models');


// Renderiza el listado de los alumnos
function studentsList(req, res) {

  let view = 'students/studentsList';
  db.student.findAll()
    .then(students => {
      res.render(view, {students: students});
    });

}


// Renderiza el formulario de alta de estudiante
function studentsNew(req, res) {

  // Defino la vista de destino
  let view = 'students/studentsNew';

  db.user.findAll()
    .then(users => {

      db.grade.findAll()
        .then(grades => {

          res.render(view, {users: users, grades: grades});

        })

    });
}


// Trae de la DB los datos del estudiante
function studentsEdit(req, res) {

  let studentId = req.params.studentId

  let view = 'students/studentsEdit';

  db.student.findOne({
    where: {id: studentId},
    // Si fue exitosa la coneccion con la db
  }).then(student => {

    db.user.findAll()
      .then(users => {

        db.grade.findAll()
          .then(grades => {
            res.render(view, {student: student, users: users, grades: grades});
          });

      });
  });

}


// Da de alta un estudiante
function studentsStore(req, res) {

  // Si es un usuario nuevo
  if (req.body.studentId === 'NEW') {


    // Llamo al modelo para crear el objeto con los tados a insertar
    db.student.create({
      identification: req.body.identification,
      name: req.body.name,
      email: req.body.email,
      school: 1,
      user_id: parseInt(req.body.userId),
      grade:req.body.grade
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

    db.student.update({
      identification: req.body.identification,
      name: req.body.name,
      email: req.body.email,
      school: 'TRIALSCHOOL',
      user_id: req.body.userId,
      grade:req.body.grade
    }, {
      where: {id: req.body.studentId},
      returning: true,
      plain: true
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

  }

}


//Exporta la funciones para ser llamadas externamente.
module.exports = {
  studentsList: studentsList,
  studentsNew: studentsNew,
  studentsStore: studentsStore,
  studentsEdit: studentsEdit
};

