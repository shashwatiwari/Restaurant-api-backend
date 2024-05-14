const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);
const { VendorEmployee, Vendor, Restaurant, EmployeeRole } = require('../models/Models');
const { validationResult } = require('express-validator');
const ProductLogic = require('../Logic/ProductLogic');
const Helpers = require('../helpers/Helpers');

const secret_key = process.env.SECRET_KEY;

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the employee with the given email
        const employee = await VendorEmployee.findOne({ where: { email: email }, include: [] });

        if (!employee || !bcrypt.compareSync(password, employee.password)) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        const token = jwt.sign({ email: email }, secret_key, { expiresIn: '1h' });

        // Find vendor using vendor_id from employee
        const vendor = await Vendor.findByPk(employee.vendor_id);

        if (!vendor) {
            return res.status(500).json({ message: 'Vendor not found' });
        }

        if (vendor.status === 0) {
            return res.status(403).json({ errors: [{ code: 'auth-002', message: 'Inactive vendor warning (vendor status zero)' }] });
        }

        // Find restaurant using vendor_id from employee
        const restaurant = await Restaurant.findByPk(employee.vendor_id);

        if (!restaurant) {
            return res.status(500).json({ message: 'Restaurant not found' });
        }

        if (restaurant.status === 0) {
            return res.status(403).json({ errors: [{ code: 'auth-002', message: 'Inactive vendor warning (restaurant status zero)' }] });
        }

        let firstLogin = employee.auth_token === '' ? 'true' : 'false';

        employee.auth_token = token;
        await employee.save();

        // Find employee role
        const employeeRole = await EmployeeRole.findByPk(employee.employee_role_id);

        if (!employeeRole) {
            return res.status(500).json({ message: 'Employee role not found' });
        }

        const parsedModulesArray = JSON.parse(employeeRole.modules);

        return res.status(200).json({
            token,
            first_login: firstLogin,
            role_name: employeeRole.name,
            role: parsedModulesArray
            // zone_wise_topic: vendor.restaurants[0].zone.restaurant_wise_topic
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token);
        const decoded = await verifyAsync(token, secret_key);

        const vendoremployee = decoded;
        // console.log(vendoremployee)

        const vendorid = vendoremployee.vendor_id;
        console.log(vendorid);

        pool.query('SELECT food.category_id AS categories FROM food JOIN categories ON food.category_id = categories.id WHERE food.restaurant_id = ? AND categories.status = 1 GROUP BY categories.id', [vendoremployee.restaurant_id], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server error' });
            }

            const category_ids = results;

            pool.query('SELECT * FROM vendors WHERE id = ?', [vendorid], async (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Server error' });
                }

                const vendor = results[0];

                const restaurant = Helpers.restaurant_data_formatting(vendor.restaurants[0], false);
                const discount = Helpers.get_restaurant_discount(vendor.restaurants[0]);
                delete restaurant.discount;
                restaurant.discount = discount;
                restaurant.schedules = restaurant.schedules.get();

                vendor.order_count = vendor.orders.length;
                vendor.todays_order_count = vendor.todaysorders.length;
                vendor.this_week_order_count = vendor.this_week_orders.length;
                vendor.this_month_order_count = vendor.this_month_orders.length;
                vendor.member_since_days = vendor.created_at.diffInDays();
                vendor.cash_in_hands = parseFloat(vendor.wallet.collected_cash || 0);
                vendor.balance = parseFloat(vendor.wallet.balance || 0);
                vendor.total_earning = parseFloat(vendor.wallet.total_earning || 0);
                vendor.todays_earning = parseFloat(vendor.todays_earning().sum('restaurant_amount'));
                vendor.this_week_earning = parseFloat(vendor.this_week_earning().sum('restaurant_amount'));
                vendor.this_month_earning = parseFloat(vendor.this_month_earning().sum('restaurant_amount'));
                vendor.pos = 1;
                vendor.restaurants = restaurant;
                vendor.userinfo = vendor.userinfo;
                delete vendor.orders;
                delete vendor.rating;
                delete vendor.todaysorders;
                delete vendor.this_week_orders;
                delete vendor.wallet;
                delete vendor.todaysorders;
                delete vendor.this_week_orders;
                delete vendor.this_month_orders;

                if (restaurant.restaurant_model == 'subscription') {
                    if (restaurant.restaurant_sub) {
                        let max_product_uploads;
                        if (restaurant.restaurant_sub.max_product == 'unlimited') {
                            max_product_uploads = -1;
                        } else {
                            max_product_uploads = restaurant.restaurant_sub.max_product - restaurant.foods.length;
                            if (max_product_uploads > 0) {
                                max_product_uploads || 0;
                            } else if (max_product_uploads < 0) {
                                max_product_uploads = 0;
                            }
                        }
                        vendor.subscription = RestaurantSubscription.where('restaurant_id', restaurant.id).with('package').latest().first();
                        vendor.subscription_other_data = {
                            total_bill: parseFloat(SubscriptionTransaction.where('restaurant_id', restaurant.id).where('package_id', vendor.subscription.package.id).sum('paid_amount')),
                            max_product_uploads: parseInt(max_product_uploads)
                        };
                    }
                }

                vendor.category_ids = category_ids.map(category => parseInt(category.categories));

                const modules = await pool.query('SELECT name, modules FROM employee_roles WHERE id = ?', [vendoremployee.employee_role_id]);
                const data = JSON.parse(modules[0]);
                vendor.emp_id = vendoremployee.id;
                vendor.role_name = data.name;
                vendor.emp_f_name = vendoremployee.f_name;
                vendor.emp_email = vendoremployee.email;
                vendor.emp_l_name = vendoremployee.l_name;
                vendor.role = JSON.parse(data.modules);

                const bar_category = await pool.query('SELECT id FROM categories WHERE cat_type = "bar"');
                vendor.bar_categories = bar_category;

                vendor.restaurant_printer = await RestaurantPrinter.where('restaurant_id', restaurant.id).first();

                const printerData = [];
                const restaurant_printer_new = await RestaurantPrinterNew.where('restaurant_id', restaurant.id).get();

                for (const getprinter of restaurant_printer_new) {
                    let mac_printer_ip;
                    if ((getprinter.area_name === 'KDS') && (vendoremployee.mac_ip_kds !== '')) {
                        mac_printer_ip = vendoremployee.mac_ip_kds;
                    } else if ((getprinter.area_name === 'BAR') && (vendoremployee.mac_ip_bar !== '')) {
                        mac_printer_ip = vendoremployee.mac_ip_bar;
                    } else if ((getprinter.area_name === 'Bill') && (vendoremployee.mac_ip_bill !== '')) {
                        mac_printer_ip = vendoremployee.mac_ip_bill;
                    } else {
                        mac_printer_ip = getprinter.mac_printer_ip;
                    }

                    const categories_id = await RestaurantPrinterCategory.where('restaurant_printer_id', getprinter.id).pluck('category_id').toArray();

                    const printer = {
                        id: getprinter.id,
                        restaurant_id: getprinter.restaurant_id,
                        area_name: getprinter.area_name,
                        printer_name: getprinter.printer_name,
                        printer_ip: getprinter.printer_ip,
                        mac_printer_ip: mac_printer_ip,
                        printer_paper_roll: getprinter.printer_paper_roll,
                        categories_id: categories_id,
                    };

                    printerData.push(printer);
                }

                vendor.restaurant_printer_new = printerData;

                vendor.restaurant_printer_config = await RestaurantPrinterConfig.where('restaurant_id', restaurant.id).first();

                return res.status(200).json(vendor);
            });
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error(error);
        return res.status(401).json({ message: ' User Unauthorized' });
    }

};

const getProducts = async (req, res) => {
    try {
        const vendoremployee = req.vendoremployee;
        const vendorid = vendoremployee.vendor_id;
        const restaurant_id = vendoremployee.restaurant_id;

        const vendor = await Vendor.findByPk(vendorid);
        const vendorProfile = await Restaurant.findByPk(restaurant_id);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: Helpers.errorProcessor(errors) });
        }

        const type = req.query.type || 'all';
        const food_for = vendorProfile.food_for || 'Normal';
        const products = await ProductLogic.getLatestProducts({
            limit: req.body.limit,
            offset: req.body.offset,
            restaurant_id: vendor.restaurants[0].id,
            category_id: req.body.category_id,
            type: type,
            food_for: food_for
        });

        const formattedProducts = Helpers.productDataFormatting({
            data: products.products,
            multi_data: true,
            trans: false,
            local: req.getLocale()
        });

        return res.status(200).json({ ...products, products: formattedProducts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const employeeResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await verifyAsync(token, secret_key);

        console.log(decoded);

        const { old_password, new_password } = req.body;

        const vendoremployee = await VendorEmployee.findOne({ where: { email: decoded.email }, include: [] });

        if (!vendoremployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        if (!bcrypt.compareSync(old_password, vendoremployee.password)) {
            return res.status(400).json({ error: 'Incorrect old password' });
        }

        vendoremployee.password = bcrypt.hashSync(new_password, 10);
        await vendoremployee.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { login, getProfile, getProducts, employeeResetPassword };
