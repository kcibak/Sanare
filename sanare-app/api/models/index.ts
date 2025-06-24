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
  public phone?: string;
  public email!: string;
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
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
  public providerid!: string;
  public content!: string;
  public notetype!: 'private' | 'shared';
  public sessionid?: string;
  public createdat!: Date;
}

Note.init(
  {
    noteid: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      field: 'noteid',
    },
    patientid: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: 'patientid',
    },
    providerid: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'providerid',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
    },
    notetype: {
      type: DataTypes.ENUM('private', 'shared'),
      allowNull: false,
      field: 'notetype',
    },
    sessionid: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: 'sessionid',
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
    tableName: 'note',
    timestamps: false,
  }
);

Provider.hasMany(Patient, { foreignKey: 'providerid' });
Patient.belongsTo(Provider, { foreignKey: 'providerid' });
Patient.hasMany(Note, { foreignKey: 'patientid' });
Note.belongsTo(Patient, { foreignKey: 'patientid' });
Provider.hasMany(Note, { foreignKey: 'providerid' });
Note.belongsTo(Provider, { foreignKey: 'providerid' });
