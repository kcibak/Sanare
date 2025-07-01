// Migration to add 'comments' column to 'notes' table if it does not exist
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (!table.comments) {
      await queryInterface.addColumn('notes', 'comments', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (table.comments) {
      await queryInterface.removeColumn('notes', 'comments');
    }
  },
};
