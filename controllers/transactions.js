/*
 *
 * roles.js
 *
 * Created on 04th august
 * Copyright © 2020
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las transacciones
'use strict';


let db = require('../models');

// Renderiza el listado de transacciones
function transactionsList(req, res) {

  let view = 'transactions/transactionsList';
  db.transaction.findAll()
    .then(transactions => {
      res.render(view, { transaction: transactions });
    });
}


// Inserto una transaccion
function transactionStore(req, res) {

  // Llamo al modelo para crear el objeto con los datos a insertar
  db.role.create({
    amount: req.body.roleName,
    mp_rq: screenPermissions,
    // Si se inserto correctamente devuelve un json con los datos ingresados
  }).then(function (item) {

    let response = { 'data': item, 'error': false, 'result': true, "dataError": {} }
    res.json(response);

    // Si no se inserto correctamente devuelve un json con el error
  }).catch(function (err) {
    let dataError = {};

    dataError.errorMsj = err.message;
    dataError.errorCode = err.code;

    let response = ({ "data": '', "error": true, 'result': false, "dataError": dataError });
    res.json(response);
  });
}



//Exporta la funciones para ser llamadas externamente.
module.exports = {
  transactionsList,
  transactionStore
};

