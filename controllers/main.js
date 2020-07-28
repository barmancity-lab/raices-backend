/*
 *
 * main.js
 *
 * Created on 22th march
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones del Main
'use strict';


// Renderiza a la pagina principal
function index(req, res) {

  res.render('layout');

}

//Exporta la funciones para ser llamadas externamente.
module.exports = {
  index: index
};

