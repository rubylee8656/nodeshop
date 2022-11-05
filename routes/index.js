var express = require('express');
var router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');
const upload = require(__dirname + './../modules/upload-img');






router.get(['/', '/list'], async (req, res) => {
    const shop_sql = "SELECT s.*, c.`shop_city`, a.`shop_area`, f.`product_name`, fc.`product_categories` FROM `shop_list` s JOIN `shop_address_city` c ON s.`shop_address_city_sid` = c.`sid` JOIN `shop_address_area` a ON s.`shop_address_area_sid` = a.`sid` JOIN `food_product` f ON s.`sid` = f.`shop_list_sid` JOIN `food_category` fc ON f.`product_categories_sid` = fc.`sid` GROUP BY s.`sid` ORDER BY sid ASC";
    const [shop_rows] = await db.query(shop_sql);
    res.json({ shop_rows });
})
router.get('/city', async (req, res) => {
    const city_sql = "SELECT * FROM `shop_address_city`";
    const [city_rows] = await db.query(city_sql);
    res.json({ city_rows });
})

router.get('/area', async (req, res) => {
    const area_sql = "SELECT `shop_address_area`.* FROM `shop_address_area` JOIN `shop_address_city` ON `shop_address_area`.`shop_city_sid` = `shop_address_city`.`sid`";
    const [area_rows] = await db.query(area_sql);
    // return { area_rows };
    res.json({ area_rows });
})

router.get('/cate', async (req, res) => {
    const cate_sql = "SELECT * FROM `food_category`";
    const [cate_rows] = await db.query(cate_sql);
    res.json({ cate_rows });
})


// router.get(['/', '/list'], async (req, res) => {
//     const data = await getListData(req, res);
//     res.render('shop_list/list', data);
// });

// router.get(['/card'], async (req, res) => {
//     const data = await getListData(req, res);
//     // res.render('shop_list/card', data);
//     res.json(data)
// });

// router.get(['/api', '/api/list'], async (req, res) => {
//     res.json(await getListData(req, res));
// });



// async function getListData(req, res) {
//     const perPage = 10;
//     let page = +req.query.page || 1;
//     if (page < 1) {
//         return res.redirect(req.baseUrl);
//     }
//     let search = req.query.search ? req.query.search : '';
//     let where = ` WHERE 1 `;
//     if (search) {
//         where += ` AND 
//         (
//             \`shop_name\` LIKE ${db.escape('%' + search + '%')}
//             OR
//             \`shop_city\` LIKE ${db.escape('%' + search + '%')}
//             OR
//             \`shop_area\` LIKE ${db.escape('%' + search + '%')}
//             OR
//             \`shop_address_detail\` LIKE ${db.escape('%' + search + '%')}
//         )`;
//     }
//     const t_sql =`SELECT s.*, c.\`shop_city\`, a.\`shop_area\` , COUNT(1) totalRows FROM \`shop_list\` s JOIN \`shop_address_city\` c ON s.\`shop_address_city_sid\` = c.\`sid\` JOIN \`shop_address_area\` a ON s.\`shop_address_area_sid\` = a.\`sid\` ${where}  `;
//     const [[{ totalRows }]] = await db.query(t_sql);

//     let totalPages = 0;
//     let rows = [];
//     if (totalRows > 0) {
//         totalPages = Math.ceil(totalRows / perPage);
//         if (page > totalPages) {
//             return res.redirect(`?page=${totalPages}`);
//         }
//         const sql = `SELECT s.*, c.\`shop_city\`, a.\`shop_area\` FROM \`shop_list\` s JOIN \`shop_address_city\` c ON s.\`shop_address_city_sid\` = c.\`sid\` JOIN \`shop_address_area\` a ON s.\`shop_address_area_sid\` = a.\`sid\` ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage},${perPage} `;
//         [rows] = await db.query(sql);
//     }

//     const city_sql = "SELECT * FROM `shop_address_city`";
//     [city_rows] = await db.query(city_sql);

//     return { totalRows, totalPages, perPage, page, rows, city_rows, search, query: req.query };
// }


module.exports = router;
