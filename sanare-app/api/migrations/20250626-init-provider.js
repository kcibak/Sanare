"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Example: create a table for providers
    await queryInterface.createTable('provider', {
      providerid: {
        type: Sequelize.STRING(8),
        primaryKey: true
      },
      firstname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdat: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    // Add more createTable calls for other tables as needed
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('provider');
    // Add more dropTable calls for other tables as needed
  }
};
