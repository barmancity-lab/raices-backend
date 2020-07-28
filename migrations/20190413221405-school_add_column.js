'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var sequelize = queryInterface.sequelize;
    return sequelize.transaction(function (t) {
      var migrations = [];
      migrations.push(queryInterface.addColumn(
        'schools',
        'info',
        Sequelize.TEXT
      ));
      migrations.push(queryInterface.addColumn(
        'schools',
        'image',
        Sequelize.STRING
      ));
      return Promise.all(migrations);
    });
  },

  down: function (queryInterface, Sequelize) {

  }







};
