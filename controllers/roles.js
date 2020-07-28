/*
 *
 * roles.js
 *
 * Created on 04th april
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones de los roles
'use strict';


let db = require('../models');

// Renderiza el listado de roles
function rolesList(req, res) {

  let view = 'roles/rolesList';
  db.role.findAll()
    .then(roles => {
      res.render(view, {roles: roles});
    });

}


// Renderiza el formulario de alta de usuario
function rolesNew(req, res) {

  // Defino la vista de destino
  let view = 'roles/rolesNew';

  db.screen.findAll()
    .then(screens => {
      res.render(view, {screens: screens});

    });
}

// Trae de la DB los datos del usuario
function rolesEdit(req, res) {

  let roleId = req.params.roleId
  let view = 'roles/rolesEdit';

  // Busco en la tabla roles segun el id
  db.role.findOne({
    where: {id: roleId},

  }).then(role => {

    // Traigo de la tabla screens todas las pantallas disponibles
    db.screen.findAll()
      .then(screens => {

        let screenPermissions = JSON.parse(role.screen_permissions);
        res.render(view, {role: role, screenPermissions: screenPermissions, screens: screens});

      });

  });

}


// Da de alta un usuario
function rolesStore(req, res) {

  // Si es un usuario nuevo
  if (req.body.roleId === 'NEW') {

    // Capturo todos los permisos de pantalla y los guardo en json
    let screenPermissions = JSON.stringify(req.body.screenPermissions);

    // Llamo al modelo para crear el objeto con los tados a insertar
    db.role.create({
      role: req.body.roleName,
      screen_permissions: screenPermissions,

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


    // Si es una edicio de usuario
  } else {

    // Capturo todos los permisos de pantalla y los guardo en json
    let screenPermissions = JSON.stringify(req.body.screenPermissions);

    db.role.update({
      role: req.body.roleName,
      screen_permissions: screenPermissions,

    }, {
      where: {id: req.body.roleId},
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
  rolesList: rolesList,
  rolesNew: rolesNew,
  rolesStore: rolesStore,
  rolesEdit: rolesEdit
};

