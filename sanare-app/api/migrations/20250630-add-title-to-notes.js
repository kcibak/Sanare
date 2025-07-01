// Migration to add 'title' column to 'notes' table if it does not exist
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (!table.title) {
      await queryInterface.addColumn('notes', 'title', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (table.title) {
      await queryInterface.removeColumn('notes', 'title');
    }
  },
};
