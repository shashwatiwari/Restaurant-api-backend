const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const { Op } = require("sequelize");

const Cuisine = sequelize.define('Cuisine', {
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'cuisines',
    timestamps: false
});

Cuisine.belongsToMany(Restaurant, { through: 'Cuisine_restaurant', foreignKey: 'cuisine_id' });

Cuisine.addHook('beforeCreate', async (cuisine) => {
    cuisine.slug = await cuisine.generateSlug(cuisine.name);
});

Cuisine.prototype.generateSlug = async function (name) {
    let slug = slugify(name);
    let count = 1;
    let uniqueSlug = slug;
    while (await Cuisine.findOne({ where: { slug: uniqueSlug } })) {
        count++;
        uniqueSlug = `${slug}-${count}`;
    }
    return uniqueSlug;
};

module.exports = Cuisine;
