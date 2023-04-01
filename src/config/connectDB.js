import express from "express";

//  Option 2: Passing paramerts separtely (othor dialects)
const { Sequelize } = require('sequelize');
 
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('cnpm', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

let connectDB = async () =>{
    try {
        // await => XU LY BAT DONG BO
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = connectDB;
