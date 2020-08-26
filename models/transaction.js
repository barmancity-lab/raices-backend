'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('student', {
    amount: DataTypes.INTEGER,
    rq_mp: DataTypes.TEXT
  }, {});
  transactions.associate = function(models) {
    // associations can be defined here
  };
  return transactions;
};