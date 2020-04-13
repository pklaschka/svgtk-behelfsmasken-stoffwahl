const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        async setPassword(password) {
            this.password = await bcrypt.hash(password, 8);
            this.save();
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.CHAR,
            unique: true,
            allowNull: true
        },
        password: {
            type: DataTypes.CHAR,
            allowNull: false
        }
    }, {sequelize, modelName: 'User', paranoid: true});

    User.authenticate = async (email, password) => {
        const user = await User.findOne({where: {email}});
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch)
            return user
        else
            throw new Error('unauthorized')
    }

    User.associate = (models) => {
    }

    return User;
};
