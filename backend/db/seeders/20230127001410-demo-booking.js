'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = "Bookings"
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        startDate: new Date(2023,1,10),
        endDate: new Date(2023,1,20)
      },
      {
      userId: 2,
      spotId: 2,
      startDate: new Date(2023,2,2),
      endDate: new Date(2023,2,8)
      },
      {
        userId: 1,
        spotId: 3,
        startDate: new Date(2023,4,20),
        endDate: new Date(2023,4,28)
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1,2]}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
