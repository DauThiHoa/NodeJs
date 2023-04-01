'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 1 BAC SI CO THEM CO NHIEU PHONG KHAM

    }
  };
  Clinic.init({ 
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};