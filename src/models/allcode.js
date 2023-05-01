'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 1 BAC SI CO THEM CO NHIEU PHONG KHAM

      // DINH NGHIA MOI QUAN HE VOI USER 
      // 1 CHUC DANH CO THE THUOC NHIEU USER => LAY CHUC DANH => DA DUOC GAN THANH BIEN positionData
      //  =====> TUONG TU GIOI TINH 
        Allcode.hasMany (models.User, { foreignKey: 'positionId', as: 'positionData'})
        Allcode.hasMany (models.User, {foreignKey: 'gender', as: 'genderData'})
    }
  };
  Allcode.init({ 
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVn: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};