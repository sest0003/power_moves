const db = require('../models');
const User = db.User;
const { sequelize } = db;
const bcrypt = require('bcrypt');

class UserService {
    async createUser(userData) {
        try {
            const existingUser = await User.findOne({ where: { email: userData.email }});
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = await User.create({
                ...userData,
                password: hashedPassword,
                points: 0,
                teamId: null
            });

            return user;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async loginUser(email, password) {
        try {
            const user = await User.findOne({ where: { email }});
            if (!user) {
                throw new Error('Invalid email or password');
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid email or password');
            }

            return user;
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }

    async updateUser(userId, updateData) {
        try {
            delete updateData.points;
            
            const [updated] = await User.update(updateData, {
                where: { id: userId }
            });
            
            if (!updated) {
                throw new Error('User not found');
            }
            
            return await User.findByPk(userId);
        } catch (error) {
            throw new Error('Update failed: ' + error.message);
        }
    }

    async deleteUser(userId) {
        try {
            const deleted = await User.destroy({
                where: { id: userId }
            });
            
            if (!deleted) {
                throw new Error('User not found');
            }
            return true;
        } catch (error) {
            throw new Error('Delete failed: ' + error.message);
        }
    }

    async updatePoints(userId, points) {
        try {
            const [updated] = await User.update(
                { points: sequelize.literal(`points + ${points}`) },
                { where: { id: userId }}
            );
            
            if (!updated) {
                throw new Error('User not found');
            }
            
            return await User.findByPk(userId);
        } catch (error) {
            throw new Error('Points update failed: ' + error.message);
        }
    }

    async setTeam(userId, teamId) {
        try {
            const [updated] = await User.update(
                { teamId: teamId },
                { where: { id: userId }}
            );
            
            if (!updated) {
                throw new Error('User not found');
            }
            
            return await User.findByPk(userId);
        } catch (error) {
            throw new Error('Team update failed: ' + error.message);
        }
    }
}

module.exports = new UserService(); 