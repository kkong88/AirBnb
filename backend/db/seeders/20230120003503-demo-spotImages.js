'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
  options.tableName = "SpotImages"
  return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678047980/383834719_zq1dua.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048032/APARTMENTS-MAIN_i_xv0b5f.jpg',
      preview: true
    },
    {
    spotId: 2,
    url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048085/boston-neighborhoods-guide_ll5te9.jpg',
    preview: true
    },
    {
      spotId: 2,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048121/Newbury-Street-480x270_z0zcjp.jpg',
      preview: true
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
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1,2]}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
