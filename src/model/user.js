const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Set the user's password and save
         * @param password The new password
         * @return {Promise<void>} Resolves on success. Rejects on failure. It's as simple as that.
         */
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
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        password: {
            type: DataTypes.CHAR(60),
            allowNull: false
        }
    }, {sequelize, modelName: 'User', paranoid: true});

    /**
     * Authenticates a user
     * @param email The user's email
     * @param password The user's password
     * @return {Promise<User>} Resolves with the user on success. Rejects with the message `'unauthorized'` on failure.
     */
    User.authenticate = async (email, password) => {
        const user = await User.findOne({where: {email}});
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch)
            return user
        else
            throw new Error(`unauthorized`)
    }

    User.associate = (models) => {
        // No associations here (yet?)
    }

    return User;
};
