const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Coupon = sequelize.define('Coupon', {
    min_purchase: {
        type: DataTypes.FLOAT
    },
    max_discount: {
        type: DataTypes.FLOAT
    },
    discount: {
        type: DataTypes.FLOAT
    },
    limit: {
        type: DataTypes.INTEGER
    },
    restaurant_id: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER
    },
    total_uses: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'coupons',
    timestamps: false
});

Coupon.scope('active', {
    where: {
        status: 1
    }
});

Coupon.scope('valid', {
    where: {
        expire_date: {
            [Op.gte]: new Date()
        },
        start_date: {
            [Op.lte]: new Date()
        }
    }
});

module.exports = Coupon;
