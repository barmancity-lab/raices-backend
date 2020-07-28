'use strict';
module.exports = (sequelize, DataTypes) => {
  const screen = sequelize.define('screen', {
    screen_show: DataTypes.STRING,
    screen_name: DataTypes.STRING,
    screen_actions: DataTypes.TEXT,
    school: DataTypes.STRING
  }, {});
  screen.associate = function(models) {
    // associations can be defined here
  };
  return screen;
};