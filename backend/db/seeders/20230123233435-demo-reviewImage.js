'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
  options.tableName = "reviewImages"
  return queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      image: "http://test.url.org"
    },
    {
      reviewId: 1,
      image: "http://test2.url.org"
    },
    {
      reviewId: 2,
      image: "https://test3.url.org"
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
    options.tableName= 'reviewImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      reviewId: {[Op.in]: [1,2]}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
