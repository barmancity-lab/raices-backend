/*
 *
 * login.js
 *
 * Created on 22th march
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las funciones del login
'use strict';


// Renderiza a la pagina principal
function login(req, res) {

    let viewVars = {title: 'Home',
               userData: req.user,
               messages: {danger: req.flash('danger'),
                         warning: req.flash('warning'),
                         success: req.flash('success')}
                   };

    res.render('login', viewVars);
}

//Exporta la funcion para ser llamada externamente.
module.exports = {
    login
};