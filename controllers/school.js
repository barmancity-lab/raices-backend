/*
 *
 * users.js
 *
 * Created on 07th april
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones de schools
'use strict';
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
// Llamo al modelo de la tabla account
let account = require('../model/account');
let roles = require('../model/roles');


// Renderiza el listado de usuarios
function usersList(req, res) {

  let view = 'usersList';
  account.findAll()
    .then(users => {
      res.render(view, {users: users});
    });

}


// Renderiza el formulario de alta de usuario
function newUser(req, res) {

  // Defino la vista de destino
  let view = 'usersNew';
  roles.findAll()
    .then(roles => {
      res.render(view, {roles: roles});
    });
}


// Trae de la DB los datos del usuario
function editUser(req, res) {

  let userId = req.params.userId

  let view = 'usersEdit';

  account.findOne({
    where: {id: userId},
    // Si fue exitosa la coneccion con la db
  }).then(user => {

    roles.findAll()
      .then(roles => {
        res.render(view, {user: user, roles: roles});
      });
  });

}


// Da de alta un usuario
function storeUser(req, res) {

  // Si es un usuario nuevo
  if (req.body.userId === 'NEW') {
    // Encripto la pass ingresada
    let password = bcrypt.hashSync(req.body.password, salt);

    // Llamo al modelo para crear el objeto con los tados a insertar
    account.create({
      identification: req.body.identification,
      name: req.body.name,
      surname: req.body.surname,
      password: password,
      email: req.body.email,
      role: req.body.role,
      school: 'Colegio de prueba',
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

    account.update({
      name: req.body.name,
      surname: req.body.surname,
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
  newUser: newUser,
  storeUser: storeUser,
  editUser: editUser
};

