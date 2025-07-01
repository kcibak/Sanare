// Migration to add 'acknowledged' column to 'notes' table if it does not exist
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (!table.acknowledged) {
      await queryInterface.addColumn('notes', 'acknowledged', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('notes');
    if (table.acknowledged) {
      await queryInterface.removeColumn('notes', 'acknowledged');
    }
  },
};
