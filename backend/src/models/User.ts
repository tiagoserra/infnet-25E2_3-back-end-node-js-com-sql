import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum UserType {
    ALUNO = 'aluno',
    PROFESSOR = 'professor',
    ADMIN = 'admin'
}

interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    login: string;
    password: string;
    type: UserType;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public login!: string;
    public password!: string;
    public type!: UserType;
}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('aluno', 'professor', 'admin'),
        allowNull: false,
        defaultValue: 'aluno'
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    modelName: 'User'
});

export default User; 