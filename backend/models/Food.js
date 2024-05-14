const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
const Restaurant = require('./Restaurant');
const Review = require('./Review');
const OrderDetail = require('./OrderDetail');
const Tag = require('./Tag');

class Food extends Model { }

Food.init({
    tax: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    avg_rating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    set_menu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviews_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    veg: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    food_stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Food',
    tableName: 'foods',
    timestamps: false,
    underscored: false,
});

Food.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Food.belongsTo(Category, { foreignKey: 'category_id' });
Food.hasMany(Review, { foreignKey: 'food_id' });
Food.hasMany(OrderDetail, { foreignKey: 'food_id' });
Food.belongsToMany(Tag, { through: 'FoodTag', foreignKey: 'food_id' });

module.exports = Food;
