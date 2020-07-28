'use strict';
module.exports = (sequelize, DataTypes) => {
  const grade = sequelize.define('grade', {
    name: DataTypes.STRING,
    school: DataTypes.STRING
  }, {});
  grade.associate = function(models) {
    // associations can be defined here
  };
  return grade;
};