/*
 *
 * sync.js
 *
 * Created on 08th april
 * Copyright © 2019
 * Author Federico Puiggros <b>federico_puiggros@hotmail.com</b>
 *
 */

//Este script se encarga de insertar los datos basicos para que la aplicacion funcione


'use strict';


let db = require('../models');


let actions = [];
actions[0] = {actionName: 'list', actionShow: 'Ver'};
actions[1] = {actionName: 'edit', actionShow: 'Editar'};
actions[2] = {actionName: 'new', actionShow: 'Crear'};
actions[3] = {actionName: 'store', actionShow: 'Guardar'};



db.screen.create({
  screen_show: 'Usuarios',
  screen_name: 'users',
  screen_actions: JSON.stringify(actions),
  school: 'TRIALSCHOOL',
});


db.screen.create({
  screen_show: 'Principal',
  screen_name: 'main',
  screen_actions: JSON.stringify(actions),
  school: 'TRIALSCHOOL',
});

db.screen.create({
  screen_show: 'Alumnos',
  screen_name: 'students',
  screen_actions: JSON.stringify(actions),
  school: 'TRIALSCHOOL',
});

db.screen.create({
  screen_show: 'Permisos de usuario',
  screen_name: 'roles',
  screen_actions: JSON.stringify(actions),
  school: 'TRIALSCHOOL',
});


db.user.create({
  identification: '123456',
  name: 'admin',
  last_name: 'admin',
  password: '$2a$10$mFl4wiY7Pi2/KRaWeeMUZO/6neBjrblqZ.LHPCnmb4vCEXoK0Rcwq',
  email: 'admin@admin.com',
  school: 'TRIALSCHOOL',
  family: 'Puiggros',
  role: 1,
  phone:'123456'
});


db.student.create({
  identification: '29247909',
  name: 'Federico',
  user_id:1,
  email:'email@email.com',
  school: 'TRIALSCHOOL',
  grade: 1
});

db.role.create({
  role: 'Administrador de sistema',
  screen_permissions: '{"users":{"list":"1","edit":"1","new":"1","store":"1"},"main":{"list":"1","edit":"1","new":"1","store":"1"},"students":{"list":"1","edit":"1","new":"1","store":"1"},"roles":{"list":"1","edit":"1","new":"1","store":"1"}}',
  school: 'TRIALSCHOOL',
});

db.grade.create({
  name: '1A',
  school: 'TRIALSCHOOL',
});




















