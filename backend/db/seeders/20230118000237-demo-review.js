'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Amazing place to stay!',
        star: 5
      },
      {
      userId: 1,
      spotId: 1,
      review: 'Could be better',
      star: 3
      },
      {
        userId: 2,
        spotId: 2,
        review: 'It was okay',
        star: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: 'great place to stay',
        star: 4
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Cant wait to go again',
        star: 5
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Not bad',
        star: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: 'WOW this place was amazing, cant wait to go again',
        star: 5
      },
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
    options.tableName = "Reviews"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: [1]}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
