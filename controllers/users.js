/*
 *
 * users.js
 *
 * Created on 23th march
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones de users
'use strict';
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
let db = require('../models');

// Renderiza el listado de usuarios
function usersList(req, res) {

  let view = 'users/usersList';
  db.user.findAll()
    .then(users => {
      res.render(view, {users: users});
    });

}


// Renderiza el formulario de alta de usuario
function usersNew(req, res) {

  // Defino la vista de destino
  let view = 'users/usersNew';
  db.role.findAll()
    .then(roles => {
      res.render(view, {roles: roles});
    });
}


// Trae de la DB los datos del usuario
function usersEdit(req, res) {

  let userId = req.params.userId

  let view = 'users/usersEdit';

  db.user.findOne({
    where: {id: userId},
    // Si fue exitosa la coneccion con la db
  }).then(user => {

    db.role.findAll()
      .then(roles => {
        res.render(view, {user: user, roles: roles});
      });
  });

}


// Da de alta un usuario
function userStore(req, res) {

  // Si es un usuario nuevo
  if (req.body.userId === 'NEW') {
    // Encripto la pass ingresada
    let password = bcrypt.hashSync(req.body.password, salt);
    console.log(req.body.password); 
    // Llamo al modelo para crear el objeto con los tados a insertar
    db.user.create({
      identification: req.body.identification,
      name: req.body.name,
      last_name: req.body.lastName,
      password: password,
      email: req.body.email,
      role: req.body.role,
      school: 1,
      family: req.body.family
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

    db.user.update({
      name: req.body.name,
      last_name: req.body.lastName,
      email: req.body.email,
      family: req.body.family,
      role: req.body.role
    }, {
      where: {id: req.body.userId},
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
  usersList: usersList,
  usersNew: usersNew,
  usersStore: userStore,
  usersEdit: usersEdit
};

