const fs = require('fs');
const path = require("path");
const pth = '../modules/products/views/';
const base_path = path.dirname(require.main.filename);
const db = require(base_path + '/config/database.js');
const helpers = require(base_path + '/helpers/custom_helper');
require(base_path + '/src/controllers/lang_controller.js');

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.addPage = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Add product'),
        link: 'product',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'add',locals)
}

let getMainID = () => {
    let key = Math.ceil(Math.random()*10000000000);
    // db.query('SELECT * FROM products WHERE main_id = ?', [key], function (err, rows) {
    //     if(err){
    //         getMainID();
    //     }else{
    //         if(rows.length){
    //             getMainID();
    //         }else{
    //             return key;
    //         }
    //     }
    // });
    return key;
}

exports.addAction = (req, res) => {
    let {barcode,name,price,quantity} = req.body;
    let slug = helpers.slugify(name),
        main_id = getMainID();

    let list = {
        slug: slug + '-' + main_id,
        barcode: barcode,
        name: name,
        main_id: main_id,
        user_id: req.session.auth_user
    };
    if(!name || !barcode || !price || !quantity){
        let msg = (!name ? "'name'" : (!barcode ? "'barcode'" : (!price ? "'price" : "'quantity'"))) + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect('/product/add')
    }
    db.query(`INSERT INTO products SET ?`,list,function(error,result){
        if(error){
            req.flash('message',error.message);
            req.flash('type','danger');
            return res.redirect('/product/add')
        }else{
            let product_id = result.insertId;
            db.query(`INSERT INTO product_quantities SET ?`,{product_id:product_id,quantity:quantity},function(error2,result2){
                if(error2){
                    req.flash('message',error2.message);
                    req.flash('type','danger');
                    return res.redirect('/product/add')
                }else{
                    db.query(`INSERT INTO product_prices SET ?`,{product_id:product_id,price:price},function(error3,result3){
                        if(error3){
                            req.flash('message',error3.message);
                            req.flash('type','danger');
                            return res.redirect('/product/add')
                        }else{
                            req.flash('message','Successfully added!');
                            req.flash('type','success');
                            return res.redirect('/product/add')
                        }
                    });
                }
            });
        }
    });
}


exports.productList = (req,res) => {
    let sql = `SELECT pr.*,
                (SELECT price FROM product_prices WHERE product_id = pr.id ORDER BY id DESC LIMIT 1) as price,
                (SELECT quantity FROM product_quantities WHERE product_id = pr.id ORDER BY id DESC LIMIT 1) as quantity
                FROM products pr WHERE deleted_at IS NULL ORDER BY id DESC`;
    db.query(sql,function(error,result){
        if(!error){
            locals = Object.assign(locals,{
                title: __('Product'),
                link: 'product',
                metaDescription: '',
                metaKeys: '',
                message: req.flash('message'),
                type: req.flash('type'),
                products: result
              });
            res.render(pth + 'list',locals);
        }else{
            res.send(error);
        }
    });
    
}