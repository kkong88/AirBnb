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
      price: 1000.00,
      // avgRating: 4.6,
      // previewImage: "test.url",
      description: 'Check out this great place to have a unique place to stay'
    },
    {
      ownerId: 1,
      address: '5th street',
      city:'New York',
      state:'NY',
      country: "United states",
      lat: 8.88,
      lng: 1.23,
      name: 'Luxury Beautiful riverfront mid-century house',
      price: 790.00,
      description: 'We are conveniently located minutes from downtown Newburgh, and just over the bridge from the Beacon train station.'
    },
    {
      ownerId: 1,
      address: '69 blackberry lane',
      city:'Boston',
      state:'Ma',
      country: "United states",
      lat: 8.88,
      lng: 1.23,
      name: 'Cozy Home',
      price: 160.00,
      description: "Relax & Rejuvenate w/ panoramic views of White Mountains from any of the 4 decks of Kailaśa Chalet!"
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
      price: 500,
      description: 'Come checkout beautiful back bay with shops and good eats around'
    },
    {
      ownerId: 2,
      address: '17 cottage lane',
      city:'York',
      state:'Me',
      country: "United states",
      lat: 12.12,
      lng: 13.13,
      name: 'Paradise in York',
      price: 690,
      description: 'This vast 6 bedroom property offers you everything you need for your dream vacation: Superb 180 degree ocean view, 3 terrasses'
    },
    {
      ownerId: 2,
      address: '3A rainbow rd',
      city:'Braintree',
      state:'Ma',
      country: "United states",
      lat: 12.12,
      lng: 13.13,
      name: 'Rental unit',
      price: 320,
      description: 'Amazing beautiful apartment with gorgeous sunset view.  A two minute drive to expressway.'
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
      price: 750.00,
      description: 'A place to remember your stay'
    },
    {
      ownerId: 3,
      address: '100 universal city plaze',
      city:'hogsmeade',
      state:'England',
      country: "United Kingdom",
      lat: 18.18,
      lng: 19.23,
      name: 'Hogwarts',
      price: 12000.00,
      description: 'Avada Kedavra'
    },
    {
      ownerId: 3,
      address: 'Unknown location',
      city:'space',
      state:'Galaxy',
      country: "N/A",
      lat: 18.18,
      lng: 19.23,
      name: 'Death Star',
      price: 10000.00,
      description: 'A once in a lifetime experiance'
    },
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
