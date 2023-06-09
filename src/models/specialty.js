'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
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
  Specialty.init({ 
    name: DataTypes.STRING,  
    image: DataTypes.STRING,  
    descriptionHTML: DataTypes.STRING,  
    descriptionMarkdown: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};