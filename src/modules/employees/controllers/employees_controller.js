const fs = require('fs');
const db = require('../../../../config/database.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require("path");
const pth = '../modules/employees/views/';
require(path.dirname(require.main.filename) + '/src/controllers/lang_controller.js');

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.addPage = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Employee'),
        link: 'employee',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'add',locals)
}

async function getMainID() {
    return await getMainIDFirst()
}; 


function getMainIDFirst() {
    return new Promise((resolve, reject) => {
        let key = Math.ceil(Math.random()*10000000000);
        db.query('SELECT * FROM products WHERE main_id = ?', [key], function (err, rows) {
            if(err){
                getMainID();
            }else{
                if(rows.length){
                    getMainID();
                }else{
                    return key;
                }
            }
        });
        return key;
    });
}

exports.addEmployee = (req, res) => {
    let token = global.token,
        $_rd_link = '/employee/add';
    let {name,surname,email,user_role,password,password_confirm} = req.body;
    if(!name || !surname || !email || !password || !password_confirm || !role){
        let msg = (!name ? "'name'" : (!surname ? "'surname'" : (!email ? "'email'" : (!password ? "'password'" : "'password confirm'")))) + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect($_rd_link)
    }
    if(password !== password_confirm){
        req.flash('message','Confirm password does not match');
        req.flash('type','danger');
        return res.redirect($_rd_link)
    }
    let role = ['admin','developer','seller','manager'].includes(user_role) ? user_role : 'seller';
    bcrypt.hash(password, saltRounds,function (err, password) {
        let new_list = {name,surname,email,token,password,role};
        db.query(`INSERT INTO users SET ?`,new_list,function(error,succ){
            if(error){
                req.flash('message',error.message);
                req.flash('type','danger');
                return res.redirect($_rd_link)
            }else{
                req.flash('message','Successfully added!');
                req.flash('type','success');
                return res.redirect($_rd_link)
            }
        });
    });
}


exports.employeesList = (req,res) => {
    let sql = `SELECT * FROM employees ORDER BY id DESC`;
    db.query(sql,function(error,result){
        if(!error){
            locals = Object.assign(locals,{
                title: __('Employee'),
                link: 'employee',
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