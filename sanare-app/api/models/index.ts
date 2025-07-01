import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Provider extends Model {
  public providerid!: string;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public password!: string;
  public createdat!: Date;
}

Provider.init(
  {
    providerid: {
      type: DataTypes.STRING(8),
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'provider',
    timestamps: false,
  }
);

export class Patient extends Model {
  public patientid!: string;
  public firstname!: string;
  public lastname!: string;
  public providerid!: string;
  public email!: string;
  public dob?: string;
  public password?: string; // Added password field
  public createdat!: Date;
}

Patient.init(
  {
    patientid: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      field: 'patientid',
    },
    firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'firstname',
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'lastname',
    },
    providerid: {
      type: DataTypes.STRING(8),
      references: {
        model: Provider,
        key: 'providerid',
      },
      field: 'providerid',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'dob',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Allow null for legacy patients
      field: 'password',
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
  },
  {
    sequelize,
    tableName: 'patient',
    timestamps: false,
  }
);

export class Note extends Model {
  public noteid!: string;
  public patientid!: string;
  public notetitle?: string;
  public notecontent?: string;
  public sessiondate!: Date;
  public createdat!: Date;
  public updatedat!: Date;
  public isshared!: boolean;
  public ack!: boolean;
  public comments?: string;
}

Note.init(
  {
    noteid: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      field: 'noteid',
    },
    patientid: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'patientid',
    },
    notetitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'notetitle',
    },
    notecontent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notecontent',
    },
    sessiondate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'sessiondate',
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedat',
    },
    isshared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'isshared',
    },
    ack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'ack',
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comments',
    },
  },
  {
    sequelize,
    tableName: 'notes',
    timestamps: false,
  }
);

export class Journal extends Model {
  public entryid!: string;
  public patientid!: string;
  public title!: string;
  public content?: string;
  public createdat!: Date;
  public updatedat!: Date;
}

Journal.init(
  {
    entryid: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      field: 'entryid',
    },
    patientid: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'patientid',
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'title',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content',
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedat',
    },
  },
  {
    sequelize,
    tableName: 'journal',
    timestamps: false,
  }
);

export class Goal extends Model {
  public goalid!: string;
  public patientid!: string;
  public title!: string;
  public description?: string;
  public iscomplete!: boolean;
  public createdat!: Date;
  public updatedat!: Date;
  public completedat?: Date;
}

Goal.init(
  {
    goalid: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      field: 'goalid',
    },
    patientid: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'patientid',
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
    iscomplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'iscomplete',
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedat',
    },
    completedat: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completedat',
    },
  },
  {
    sequelize,
    tableName: 'goals',
    timestamps: false,
  }
);

export class Task extends Model {
  public taskid!: string;
  public goalid?: string;
  public title!: string;
  public iscompleted!: boolean;
  public createdat!: Date;
  public updatedat!: Date;
}

Task.init(
  {
    taskid: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      field: 'taskid',
    },
    goalid: {
      type: DataTypes.STRING(8),
      allowNull: true, // allow orphan tasks
      field: 'goalid',
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'title',
    },
    iscompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'iscompleted',
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedat',
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: false,
  }
);

Provider.hasMany(Patient, { foreignKey: 'providerid' });
Patient.belongsTo(Provider, { foreignKey: 'providerid' });
Patient.hasMany(Note, { foreignKey: 'patientid' });
Note.belongsTo(Patient, { foreignKey: 'patientid' });
Patient.hasMany(Journal, { foreignKey: 'patientid' });
Journal.belongsTo(Patient, { foreignKey: 'patientid' });
Patient.hasMany(Goal, { foreignKey: 'patientid' });
Goal.belongsTo(Patient, { foreignKey: 'patientid' });
Goal.hasMany(Task, { foreignKey: 'goalid', as: 'tasks' });
Task.belongsTo(Goal, { foreignKey: 'goalid', as: 'goal' });
