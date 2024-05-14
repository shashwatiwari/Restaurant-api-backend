const { VendorEmployee, Vendor, Restaurant, EmployeeRole } = require('../models/Models');

class Helpers {
    static async restaurant_data_formatting(data, multi_data = false) {
        let storage = [];
        let cuisines = [];

        if (multi_data) {
            for (const item of data) {
                // Simulating the load method, assuming 'cuisine' is a relation
                item.cuisine = await CuisineModel.findById(item.cuisine_id);
                // Simulating the Coupon::Where method
                item.coupons = await CouponModel.find({
                    $or: [
                        { coupon_type: 'restaurant_wise', data: { $in: [item.id] }, customer_id: { $in: ['all'] } },
                        { restaurant_id: item.id }
                    ],
                    active: true,
                    valid: true
                });

                // Simulating other transformations and calculations
                item.self_delivery_system = item.restaurant_model === 'subscription' && item.restaurant_sub ? item.restaurant_sub.self_delivery : null;
                item.restaurant_status = item.status;
                item.available_time_starts = item.opening_time ? item.opening_time.format('H:i') : null;
                item.available_time_ends = item.closeing_time ? item.closeing_time.format('H:i') : null;
                let ratings = RestaurantLogic.calculate_restaurant_rating(item.rating);
                let positive_rating = RestaurantLogic.calculate_positive_rating(item.rating);
                item.positive_rating = parseInt(positive_rating.rating);
                item.avg_rating = parseInt(ratings.rating);
                item.rating_count = parseInt(ratings.total);
                // Assuming other transformations and calculations
                storage.push(item);
            }
        } else {
            // Simulating the load method, assuming 'cuisine' is a relation
            data.cuisine = await CuisineModel.findById(data.cuisine_id);
            // Simulating the Coupon::Where method
            data.coupons = await CouponModel.find({
                $or: [
                    { coupon_type: 'restaurant_wise', data: { $in: [data.id] }, customer_id: { $in: ['all'] } },
                    { restaurant_id: data.id }
                ],
                active: true,
                valid: true
            });

            // Simulating other transformations and calculations
            data.self_delivery_system = data.restaurant_model === 'subscription' && data.restaurant_sub ? data.restaurant_sub.self_delivery : null;
            data.restaurant_status = data.status;
            data.available_time_starts = data.opening_time ? data.opening_time.format('H:i') : null;
            data.available_time_ends = data.closeing_time ? data.closeing_time.format('H:i') : null;
            let ratings = RestaurantLogic.calculate_restaurant_rating(data.rating);
            let positive_rating = RestaurantLogic.calculate_positive_rating(data.rating);
            data.positive_rating = parseInt(positive_rating.rating);
            data.avg_rating = parseInt(ratings.rating);
            data.rating_count = parseInt(ratings.total);
            // Assuming other transformations and calculations
        }

        return multi_data ? storage : data;
    }

    static get_restaurant_discount(restaurant) {
        if (restaurant.discount) {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toISOString().split('T')[1].split('.')[0];

            if (restaurant.discount.start_date <= currentDate &&
                restaurant.discount.end_date >= currentDate &&
                restaurant.discount.start_time <= currentTime &&
                restaurant.discount.end_time >= currentTime) {
                return {
                    discount: restaurant.discount.discount,
                    min_purchase: restaurant.discount.min_purchase,
                    max_discount: restaurant.discount.max_discount
                };
            }
        }
        return null;
    }
}


