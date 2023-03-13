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
      spotId: 2,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048032/APARTMENTS-MAIN_i_xv0b5f.jpg',
      preview: true
    },
    {
    spotId: 3,
    url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048085/boston-neighborhoods-guide_ll5te9.jpg',
    preview: true
    },
    {
      spotId: 4,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678048121/Newbury-Street-480x270_z0zcjp.jpg',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678670700/1-city-point_atnaru.webp',
      preview: true
    },
    {
      spotId: 6,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678298719/RH-3509Lanewood-1098__e0tycr.jpg',
      preview: true
    },
    {
      spotId: 7,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678670700/maxresdefault_knyhzq.jpg',
      preview: true
    },
      {
      spotId: 8,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678670025/Hogwarts-Castle_rbktae.jpg',
      preview: true
    },
    {
      spotId: 9,
      url: 'https://res.cloudinary.com/dip4w3xmy/image/upload/v1678670113/Death_star1_lemgqh.png',
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
