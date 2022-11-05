var express = require('express');
var router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');
const upload = require(__dirname + './../modules/upload-img');



/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

async function getListData(req, res) {
    const perPage = 10;
    let page = +req.query.page || 1;
    if (page < 1) {
        return res.redirect(req.baseUrl);
    }
    let search = req.query.search ? req.query.search : '';
    let where = ` WHERE 1 `;
    if (search) {
        where += ` AND 
        (
            \`shop_name\` LIKE ${db.escape('%' + search + '%')}
            OR
            \`shop_city\` LIKE ${db.escape('%' + search + '%')}
            OR
            \`shop_area\` LIKE ${db.escape('%' + search + '%')}
            OR
            \`shop_address_detail\` LIKE ${db.escape('%' + search + '%')}
        )`;
    }
    const t_sql =`SELECT s.*, c.\`shop_city\`, a.\`shop_area\` , COUNT(1) totalRows FROM \`shop_list\` s JOIN \`shop_address_city\` c ON s.\`shop_address_city_sid\` = c.\`sid\` JOIN \`shop_address_area\` a ON s.\`shop_address_area_sid\` = a.\`sid\` ${where}  `;
    const [[{ totalRows }]] = await db.query(t_sql);

    let totalPages = 0;
    let rows = [];
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
        const sql = `SELECT s.*, c.\`shop_city\`, a.\`shop_area\` FROM \`shop_list\` s JOIN \`shop_address_city\` c ON s.\`shop_address_city_sid\` = c.\`sid\` JOIN \`shop_address_area\` a ON s.\`shop_address_area_sid\` = a.\`sid\` ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage},${perPage} `;
        [rows] = await db.query(sql);
    }

    const city_sql = "SELECT * FROM `shop_address_city`";
    [city_rows] = await db.query(city_sql);

    return { totalRows, totalPages, perPage, page, rows, city_rows, search, query: req.query };
}

//CRUD

/*router.get('/add', async (req, res) => {
    res.locals.title = '新增資料 |' + res.locals.title;
    res.render('address_book/add');
})

router.post('/add', upload.none(), async (req, res) => {
    // res.json(req.body);
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, //除錯用
    };

    //TODO:檢查欄位格式 可用joi

    const sql = "INSERT INTO `address_book`(`name`,`email`,`mobile`,`birthday`,`address`,`created_at`)  VALUES (?,?,?,?,?,NOW())";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
})

//修改資料
router.get('/edit/:sid', async (req, res) => {
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [rows] = await db.query(sql, [req.params.sid]);
    if (!rows || !rows.length) {
        return res.redirect(req.baseUrl); //跳轉道列表頁
    }
    // res.json(rows[0]);
    res.render('address_book/edit', rows[0]);
});
router.put('/edit/:sid', async (req, res) => {
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, //除錯用
    };

    //TODO:檢查欄位格式 可用joi

    const sql = "UPDATE `address_book` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=? WHERE `sid`=?";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
        req.params.sid
    ]);

    console.log(result);
    if (result.affectedRows) output.success = true;
    if (result.changedRows) output.success = true;
    res.json(output);
})

//刪除資料
router.delete('/del/:sid', async (req, res) => {
    const sql = "DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);
    res.json({ success: !!result.affectedRows, result });
});

router.get('/item/:id', async (req, res) => {
    //讀取單筆資料
})
*/
router.get('/card/city/:sid', async (req, res) => {
    const area_sql = "SELECT `shop_address_area`.* FROM `shop_address_area` JOIN `shop_address_city` ON `shop_address_area`.`shop_city_sid` = `shop_address_city`.`sid` WHERE `shop_address_city`.`sid` = ?";
    const [area_rows] = await db.query(area_sql, [req.params.sid]);
    // return { area_rows };
    res.json({ area_rows });
})
router.get('/card/test', async (req, res) => {
    const test_sql = "SELECT s.*, c.`shop_city`, a.`shop_area`, f.`product_name`, fc.`product_categories` FROM `shop_list` s JOIN `shop_address_city` c ON s.`shop_address_city_sid` = c.`sid` JOIN `shop_address_area` a ON s.`shop_address_area_sid` = a.`sid` JOIN `food_product` f ON s.`sid` = f.`shop_list_sid` JOIN `food_category` fc ON f.`product_categories_sid` = fc.`sid` GROUP BY s.`sid` ORDER BY sid ASC";
    const [test_rows] = await db.query(test_sql);
    res.json({ test_rows });
})

router.get(['/', '/list'], async (req, res) => {
    const data = await getListData(req, res);
    res.render('shop_list/list', data);
});

router.get(['/card'], async (req, res) => {
    const data = await getListData(req, res);
    // res.render('shop_list/card', data);
    res.json(data)
});

router.get(['/api', '/api/list'], async (req, res) => {
    res.json(await getListData(req, res));
});

module.exports = router;
