const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Food = require('./Food');
const User = require('./User');

class Review extends Model { }

Review.init({
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
});

Review.belongsTo(Food, { foreignKey: 'food_id' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Review.addScope('active', {
    where: {
        status: 1
    }
});

module.exports = Review;
