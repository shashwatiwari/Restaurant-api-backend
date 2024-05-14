const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Food = require('./Food');
const Translation = require('./Translation');
const { Op } = require('sequelize');

class Category extends Model { }

Category.init({
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    products_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    underscored: true,
});

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'childes' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
Category.hasMany(Food, { foreignKey: 'category_id', as: 'products' });
Category.hasMany(Translation, { foreignKey: 'translationable_id' });

Category.addScope('active', {
    where: {
        status: 1
    }
});

Category.addScope('translate', {
    include: [{
        model: Translation,
        where: {
            locale: sequelize.where(sequelize.fn('app.locale'), '=', sequelize.col('locale'))
        }
    }]
});

Category.addHook('afterCreate', 'generateSlug', async (category) => {
    category.slug = await generateSlug(category.name);
    await category.save();
});

async function generateSlug(name) {
    let slug = Str.slug(name);
    let maxSlug = await Category.findOne({
        where: {
            slug: { [Op.like]: `${slug}%` }
        },
        order: [['id', 'DESC']],
        attributes: ['slug']
    });

    if (maxSlug) {
        if (maxSlug.slug === slug) {
            slug += '-2';
        } else {
            let parts = maxSlug.slug.split('-');
            let count = parseInt(parts.pop()) + 1;
            slug = `${parts.join('-')}-${count}`;
        }
    }

    return slug;
}

module.exports = Category;
