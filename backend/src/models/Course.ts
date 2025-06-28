import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../../config/database';

interface CourseAttributes {
    id?: number;
    name: string;
    description: string;
    cover?: string;
    startDate: Date;
    endDate: Date;
}

interface CourseCreationAttributes extends Omit<CourseAttributes, 'id'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public cover?: string;
    public startDate!: Date;
    public endDate!: Date;
}

Course.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cover: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'courses',
    timestamps: false,
    modelName: 'Course'
});

export default Course;