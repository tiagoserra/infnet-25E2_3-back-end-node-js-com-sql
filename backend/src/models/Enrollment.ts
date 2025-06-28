import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum EnrollmentStatus {
    IN_PROGRESS = 'in_progress',
    CONCLUDED = 'concluded',
    CANCELED = 'canceled',
    FAIL = 'fail'
}

interface EnrollmentAttributes {
    id?: number;
    enrollDate: Date;
    conclusionDate?: Date;
    userId: number;
    courseId: number;
    status: EnrollmentStatus;
}

interface EnrollmentCreationAttributes extends Omit<EnrollmentAttributes, 'id'> {}

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
    public id!: number;
    public enrollDate!: Date;
    public conclusionDate?: Date;
    public userId!: number;
    public courseId!: number;
    public status!: EnrollmentStatus;
}

Enrollment.init({
    enrollDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    conclusionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('in_progress', 'concluded', 'canceled', 'fail'),
        allowNull: false,
        defaultValue: 'in_progress'
    }
}, {
    sequelize,
    tableName: 'enrollments',
    timestamps: false,
    modelName: 'Enrollment',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'courseId']
        }
    ]
});

export default Enrollment; 