'use strict';
module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define('student', {
    name: DataTypes.STRING,
    identification: DataTypes.STRING,
    school: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    grade: DataTypes.INTEGER
  }, {});
  student.associate = function(models) {
    // associations can be defined here
  };
  return student;
};