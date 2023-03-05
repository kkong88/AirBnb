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
      name: 'Luxury apt',
      price: 100.00,
      // avgRating: 4.6,
      // previewImage: "test.url",
      description: 'Check out this great place to have a unique place to stay'
    },
    {
      ownerId: 2,
      address: '69 boylston st',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 12.12,
      lng: 13.13,
      name: 'Back Bay',
      price: 10.99,
      // avgRating: 4.8,
      // previewImage: "test.url",
      description: 'Come checkout beautiful back bay with shops and good eats around'
    },
    {
      ownerId: 3,
      address: '78 newbury st',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 18.18,
      lng: 19.23,
      name: 'Newbury place',
      price: 16.00,
      // avgRating: 4.2,
      // previewImage: "test.url",
      description: 'A place to remember your stay'
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
