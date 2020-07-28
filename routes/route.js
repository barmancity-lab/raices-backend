/*
 *
 * route.js
 *
 * Created on 22th march
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

// Este modulo implementa las rutas de toda laa aplicacion
'use strict';
var multer  = require('multer');
let bcrypt = require('bcryptjs');
let express = require('express');
let router = express.Router();
let passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('connect-flash');
let db = require('../models');


/******************Files upload**************************/

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname)
  }
})

var upload = multer({ storage: storage })

/*********************End file upload*******************/


// Llamo al controllador Main
let mainController = require('../controllers/main.js');

// Llamo al controllador Login
let loginController = require('../controllers/login.js');

// Llamo al controllador users
let usersController = require('../controllers/users.js');

// Llamo al controllador roles
let rolesController = require('../controllers/roles.js');

// Llamo al controllador students
let studentsController = require('../controllers/students.js');

// Llamo al controllador admin
let adminController = require('../controllers/admin.js');


/******************Ruteos**************************/


/******************LogIn  LogOut*******************/
router.get('/', loginController.login);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }
  res.redirect('/');
});

router.get('/login', function (req, res) {
  res.redirect('/');
});

router.get('/logout', function (req, res) {

  req.logout();

  req.flash('warning', 'Nos vemos pronto');
  res.redirect('/');
});

/******************LogIn  LogOut*******************/


// Realiza el ruteo hacia el controlador admin
router.get('/admin', requireRole('main', 'list'), adminController.adminIndex);

// Realiza el ruteo hacia el controlador admin
router.get('/admin/schools/list', requireRole('main', 'list'), adminController.schoolsList);

// Realiza el ruteo hacia el controlador admin
router.get('/admin/schools/new', requireRole('main', 'list'), adminController.schoolsNew);

// Realiza el ruteo hacia el controlador admin
router.get('/admin/schools/edit/:schoolId', requireRole('main', 'list'), adminController.schoolsEdit);

// Realiza el ruteo hacia el controlador admin
router.post('/admin/schools/store',requireRole('main', 'list') ,upload.single('image') ,adminController.schoolsStore);

// Realiza el ruteo hacia el controlador main
router.get('/main', requireRole('main', 'list'), mainController.index);

// Realiza el ruteo hacia el controlador users/list
router.get('/users/list', requireRole('users', 'list'), usersController.usersList);

// Realiza el ruteo hacia el controlador users/new
router.get('/users/new', requireRole('users', 'new'), usersController.usersNew);

// Realiza el ruteo hacia el controlador users/store
router.post('/users/store', requireRole('users', 'store'), usersController.usersStore);

// Realiza el ruteo hacia el controlador users/edit
router.get('/users/edit/:userId', requireRole('users', 'edit'), usersController.usersEdit);

// Realiza el ruteo hacia el controlador roles/list
router.get('/roles/list', requireRole('roles', 'list'), rolesController.rolesList);

// Realiza el ruteo hacia el controlador roles/new
router.get('/roles/new', requireRole('roles', 'new'), rolesController.rolesNew);

// Realiza el ruteo hacia el controlador roles/store
router.post('/roles/store', requireRole('roles', 'store'), rolesController.rolesStore);

// Realiza el ruteo hacia el controlador users/edit
router.get('/roles/edit/:roleId', requireRole('roles', 'edit'), rolesController.rolesEdit);

// Realiza el ruteo hacia el controlador roles/list
router.get('/students/list', requireRole('students', 'list'), studentsController.studentsList);

// Realiza el ruteo hacia el controlador roles/new
router.get('/students/new', requireRole('students', 'new'), studentsController.studentsNew);

// Realiza el ruteo hacia el controlador roles/store
router.post('/students/store', requireRole('students', 'store'), studentsController.studentsStore);

// Realiza el ruteo hacia el controlador users/edit
router.get('/students/edit/:studentId', requireRole('students', 'edit'), studentsController.studentsEdit);


/************************Autenticacion************************************/

passport.use('local', new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {

    loginAttempt();

    async function loginAttempt() {

      try {
        // Hago la busqueda en la base de datos
        db.user.findAndCountAll({
          where: {identification: username},
          // Si fue exitosa la coneccion con la db
        }).then(user => {

          if (user.count > 0) {
            // Comparo la pass del formulario con la pass de la db
            bcrypt.compare(password, user.rows[0].password, function (err, check) {

              // Si hay un error en la comparacion devuelvo error
              if (err) {
                req.flash('danger', 'Contraseña incorrecta');
                return done();

                // Si no hay errores pregunto si la validacion estuvo ok
              }
              else if (check) {

                // Busco los roles del usuario
                db.role.findOne({
                  where: {id: user.rows[0].role},
                  // Si fue exitosa la coneccion con la db
                }).then(role => {

                  // Subo los datos a session
                  let userSeq = {};
                  userSeq.id = user.rows[0].id;
                  userSeq.email = user.rows[0].email;
                  userSeq.name = user.rows[0].name;
                  userSeq.surname = user.rows[0].last_name;
                  userSeq.role = user.rows[0].role;
                  userSeq.stringPermissions = role.screen_permissions;

                  return done(null, userSeq);
                });

                // Si la pass no es correcta devuelvo error
              }
              else {
                req.flash('danger', 'Contraseña incorrecta');
                return done(null, false);
              }
            });
          } else {
            req.flash('danger', 'No existe usuario');
            return done(null, false);

          }

        })
      }

      catch (e) {
        throw (e);
      }
    };

  }
))
passport.serializeUser((user, done) => {

  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Habilito el acceso segun el los permisos que el usuario tenga asignado
function requireRole(display, action) {
  return function (req, res, next) {
    if (req.isAuthenticated() === true) {

      let roleUser = JSON.parse(req.user.stringPermissions);
      let userPermision = roleUser[display];

      if (userPermision !== undefined) {
        let allowAction = userPermision[action];

        if (allowAction !== undefined && allowAction === '1') {

          next();

        } else {
          res.send(403);
        }
      } else {
        res.send(403);
      }
    } else {
      res.redirect('/');
    }
  }
}


module.exports = router;
