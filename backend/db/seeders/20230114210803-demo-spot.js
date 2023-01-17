'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
  options.tableName = "Spots";
  return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '1 chestnut pl',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 8.88,
      lng: 1.23,
      name: 'test',
      price: 5.99,
      avgRating: 4.6,
      previewImage: "test.url",
      description: 'Test'
    },
    {
      ownerId: 2,
      address: '69 boylston st',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 12.12,
      lng: 13.13,
      name: 'test',
      price: 10.99,
      avgRating: 4.8,
      previewImage: "test.url",
      description: 'Test'
    },
    {
      ownerId: 3,
      address: '78 newbury st',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 18.18,
      lng: 19.23,
      name: 'test',
      price: 16.00,
      avgRating: 4.2,
      previewImage: "test.url",
      description: 'Test'
    }
  ],{})
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
  options.tableName = "Spots"
  const Op = Sequelize.Op
  return queryInterface.bulkDelete(options, {
    address: {[Op.in]: ['1 chestnut pl','69 boylston st','78 newbury st']}
  }, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
