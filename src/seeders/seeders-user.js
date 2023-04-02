'use strict';

module.exports = {  
  up: async (queryInterface, Sequelize) => {
  //  THEM DU LIEU
  // TRUYEN NHIEU DU LIEU CUNG 1 LUC 

  return queryInterface.bulkInsert('Users', [{
    email: 'admin@gmail.com', 
    password: '123456', //PLAIN TEXT => HASH PASSWORD => jnskjbccdsazs
    firstName: 'Admin',
    lastName: '123',
    address: 'USA',
    phonenumber: '123456789', 
    gender: true, 
    image: '', 
    roleId: 'R1',  
    positionId: '', 

    createdAt: new Date(),
    updatedAt: new Date()
  }])
  },

  // HAM ROLLBACK
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
