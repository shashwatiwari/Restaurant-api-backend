// const { Food, Category } = require('../models');

// class ProductLogic {
//     static async getLatestProducts({ limit, offset, restaurant_id, category_id, type = 'all' }) {
//         let paginator = await Food.findAll({
//             where: {
//                 restaurant_id: restaurant_id,
//                 type: type
//             },
//             include: [{
//                 model: Category,
//                 where: {
//                     [Op.or]: [{ id: category_id }, { parent_id: category_id }]
//                 }
//             }],
//             order: [['name', 'ASC']],
//             limit: limit,
//             offset: offset
//         });

//         const total_size = await Food.count({
//             where: {
//                 restaurant_id: restaurant_id,
//                 type: type
//             }
//         });

//         return {
//             total_size: total_size,
//             limit: limit,
//             offset: offset,
//             products: paginator
//         };
//     }
// }

// module.exports = ProductLogic;
