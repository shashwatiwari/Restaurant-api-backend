const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const VendorEmployee = sequelize.define('vendor_employees', {
    f_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    l_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employee_role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    mac_ip_kds: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mac_ip_bar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mac_ip_bill: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vendor_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    restaurant_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    remember_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    firebase_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    auth_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
    {
        timestamps: false, // Disable Sequelize's timestamps (created_at, updated_at)
        tableName: 'vendor_employees' // Define the table name explicitly
    });

const EmployeeRole = sequelize.define('employee_roles', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unsigned: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    parent_role: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    modules: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    restaurant_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unsigned: true
    }
}, {
    timestamps: false, // Disable Sequelize's timestamps (created_at, updated_at)
    tableName: 'employee_roles' // Define the table name explicitly
});

const Restaurant = sequelize.define('restaurants', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unsigned: true
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    latitude: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    longitude: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    footer_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    minimum_order: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    comission: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: true
    },
    schedule_order: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    opening_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '10:00:00'
    },
    closeing_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '23:00:00'
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    vendor_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unsigned: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    free_delivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    cover_photo: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    delivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    take_away: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    food_section: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    tax: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    zone_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unsigned: true
    },
    reviews_section: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    off_day: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: ''
    },
    gst: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    self_delivery_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    pos_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    minimum_shipping_charge: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    delivery_time: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: '30-40'
    },
    veg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    non_veg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    order_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    total_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    per_km_shipping_charge: {
        type: DataTypes.DOUBLE(16, 3),
        allowNull: true,
        unsigned: true
    },
    restaurant_model: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'commission'
    },
    maximum_shipping_charge: {
        type: DataTypes.DOUBLE(23, 3),
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    order_subscription_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
    },
    business_type: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    gst_tax: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    fssai: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    def_ord_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    upi_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    food_for: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    feed_back: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    food_date: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_percentage: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: true
    },
    discount_type: {
        type: DataTypes.STRING(25),
        allowNull: true
    },
    pay_upi: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 'Yes'
    },
    pay_cc: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 'Yes'
    },
    pay_tab: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 'Yes'
    },
    discount_text: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Discount'
    },
    currency: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pay_cash: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: 'Yes'
    },
    settelment_report: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    reported_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'created_at'
    },
    cancel_order_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5
    },
    room: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'No'
    },
    inventory: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'No'
    },
    takeaway: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: 'No'
    },
    tip: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: 'Yes'
    }

}, {
    timestamps: false, // Disable Sequelize's timestamps (created_at, updated_at)
    tableName: 'restaurants' // Define the table name explicitly
});

const Vendor = sequelize.define('vendors', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unsigned: true
    },
    f_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    l_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'phone'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'email'
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    bank_name: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    branch: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    holder_name: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    account_no: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1
    },
    firebase_token: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    auth_token: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    fcm_token_web: {
        type: DataTypes.STRING(191),
        allowNull: true
    }
}, {
    timestamps: false, // Disable Sequelize's timestamps (created_at, updated_at)
    tableName: 'vendors' // Define the table name explicitly
});

module.exports = { VendorEmployee, EmployeeRole, Restaurant, Vendor };
