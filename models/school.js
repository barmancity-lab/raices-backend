'use strict';
module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define('school', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    code: DataTypes.STRING,
    info:   DataTypes.TEXT,
    image:   DataTypes.STRING
  }, {});
  school.associate = function(models) {
    // associations can be defined here
  };
  return school;
};