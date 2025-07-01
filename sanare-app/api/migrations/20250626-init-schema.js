"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Provider table
    await queryInterface.createTable('provider', {
      providerid: { type: Sequelize.STRING(8), primaryKey: true },
      firstname: { type: Sequelize.STRING(100), allowNull: false },
      lastname: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // Patient table
    await queryInterface.createTable('patient', {
      patientid: { type: Sequelize.STRING(8), primaryKey: true },
      firstname: { type: Sequelize.STRING(100), allowNull: false },
      lastname: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(20) },
      providerid: { type: Sequelize.STRING(8), references: { model: 'provider', key: 'providerid' } },
      password: { type: Sequelize.STRING(255) },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // Notes table
    await queryInterface.createTable('notes', {
      noteid: { type: Sequelize.STRING(8), primaryKey: true },
      patientid: { type: Sequelize.STRING(8), allowNull: false, references: { model: 'patient', key: 'patientid' } },
      notecontent: { type: Sequelize.TEXT },
      sessiondate: { type: Sequelize.DATEONLY, allowNull: false },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      isshared: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    });
    await queryInterface.addIndex('notes', ['patientid']);

    // Journal table
    await queryInterface.createTable('journal', {
      entryid: { type: Sequelize.STRING(8), primaryKey: true },
      patientid: { type: Sequelize.STRING(8), allowNull: false, references: { model: 'patient', key: 'patientid' } },
      title: { type: Sequelize.TEXT, allowNull: false },
      content: { type: Sequelize.TEXT },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.addIndex('journal', ['patientid']);

    // Goals table
    await queryInterface.createTable('goals', {
      goalid: { type: Sequelize.STRING(8), primaryKey: true },
      patientid: { type: Sequelize.STRING(8), allowNull: false, references: { model: 'patient', key: 'patientid' } },
      title: { type: Sequelize.TEXT, allowNull: false },
      description: { type: Sequelize.TEXT },
      tasks: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING(20), allowNull: false },
      progress: { type: Sequelize.INTEGER },
      deadline: { type: Sequelize.DATE },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      completedat: { type: Sequelize.DATE }
    });
    await queryInterface.addIndex('goals', ['patientid']);

    // Tasks table
    await queryInterface.createTable('tasks', {
      taskid: { type: Sequelize.STRING(8), primaryKey: true },
      goalid: { type: Sequelize.STRING(8), allowNull: false, references: { model: 'goals', key: 'goalid' }, onDelete: 'CASCADE' },
      title: { type: Sequelize.TEXT, allowNull: false },
      description: { type: Sequelize.TEXT },
      iscompleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedat: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('goals');
    await queryInterface.dropTable('journal');
    await queryInterface.dropTable('notes');
    await queryInterface.dropTable('patient');
    await queryInterface.dropTable('provider');
  }
};
