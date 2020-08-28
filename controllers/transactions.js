/*
 *
 * roles.js
 *
 * Created on 26th august
 * Copyright © 2020
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */
const mercadopago = require('mercadopago');

// Este modulo implementa las transacciones
'use strict';

mercadopago.configure({
  access_token: 'TEST-5671795431642796-062421-07f2c0cbd9821e1b15ee0c2151a07789-89909518'
});
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
function transactionNew(req, res) {

  let preference = {
    items: [
      {
        title: 'Donacion',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };

  mercadopago.preferences.create(preference)
    .then(function (response) {
      global.id = response.body.id;

      // Llamo al modelo para crear el objeto con los datos a insertar
      db.transactions.create({
        amount: 100,
        rq_mp: JSON.stringify(response),
        // Si se inserto correctamente devuelve un json con los datos ingresados
      }).then(function (item) {
        
        let data = { 'global_id': global.id, 'error': false, 'result': true, "dataError": {} }
        res.json(data);

        // Si no se inserto correctamente devuelve un json con el error
      }).catch(function (err) {
        let dataError = {};

        dataError.errorMsj = err.message;
        dataError.errorCode = err.code;

        let response = ({ "data": '', "error": true, 'result': false, "dataError": dataError });
        res.json(response);
      });

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
  transactionNew
};

