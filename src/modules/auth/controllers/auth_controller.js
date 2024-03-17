const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require("path");
const pth = '../modules/auth/views/';
const db = require(path.dirname(require.main.filename) + '/config/database.js');
require(path.dirname(require.main.filename) + '/src/controllers/lang_controller.js');

var sess;

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.loginPage = (req, res) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: __('Login'),
            link: 'login',
            metaDescription: '',
            metaKeys: '',
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render(pth + 'login',locals)
    })
}
// console.log(exist_modules)

exports.profilePage = (req, res) => {
    let {email} = req.session;
    let sql = 'SELECT * FROM `users` WHERE email = ? ';
    db.query(sql,[email],(err) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: req.session.name + ' ' + req.session.surname,
            link: 'profile',
            metaDescription: '',
            metaKeys: '',
            user: req.session, 
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render(pth + 'profile',locals)
    })
}

exports.registerPage = (req, res) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: __('Add user'),
            link: 'registerUser',
            metaDescription: '',
            metaKeys: '',
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render(pth + 'register_user',locals)
    });
}


exports.logout = (req,res) => {
    req.session.destroy((err) => {
        if(err) {return console.log(err);}
        return res.cookie('rememberMeKey',null).redirect('/login');
    });
}


exports.loginAction = (req,res) => {
    let {email,password,rememberme} = req.body;
    let tk = global.token;
    if(!email || !password){
        let msg = (!email ? "'email'" : "'password'") + ' cannot be empty';
        req.flash('message',msg);
        req.flash('type','danger');
        return res.redirect('/login')
    }
    db.query("SELECT * FROM `users` WHERE email = ?", [email], function (error, results) {
        if(error){
            req.flash('message',error.message);
            req.flash('type','danger');
            return res.redirect('/login');
        }else{
            if(results.length > 0){
                bcrypt.compare(password, results[0]['password'], function (pass_check_err, pass_check_res) {
                    if (pass_check_res) {
                        sess = req.session;
                        sess.email = results[0]['email'];
                        sess.auth_user = results[0]['id'];
                        sess.name = results[0]['name'];
                        sess.surname = results[0]['surname'];
                        req.flash('message','Logged in');
                        req.flash('type','success');
                        if(rememberme){
                            // setRememberMe({email:email,tk:tk});
                            db.query("UPDATE `users` SET ? WHERE email = ?", [{remember_me:tk},email], function (error_rm, rsrm) {
                                if(!error_rm){
                                    // res.cookie('rememberMeKey',tk);
                                    return res.cookie('rememberMeKey',tk).redirect('/profile');
                                }else{
                                    return res.cookie('rememberMeKey',null).redirect('/profile');
                                }
                            });
                        }else{
                            db.query("UPDATE `users` SET ? WHERE email = ?", [{remember_me:null},email], function (error_rm, rsrm) {
                                if(!error_rm){
                                    return res.cookie('rememberMeKey',tk).redirect('/profile');
                                }else{
                                    return res.cookie('rememberMeKey',null).redirect('/profile');
                                }
                            });
                        }
                    } else {
                        req.flash('message','Incorrect password');
                        req.flash('type','danger');
                        return res.redirect('/login');
                    }
                });
            }else{
                req.flash('message','No user found');
                req.flash('type','danger');
                return res.redirect('/login');
            }
        } 
     });
}


exports.registerUser = (req, res) => {
    let token = global.token,
        $_rd_link = '/employee/add';
    let {name,surname,email,password,password_confirm} = req.body;
    if(!name || !surname || !email || !password || !password_confirm){
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
    bcrypt.hash(password, saltRounds,function (err, password) {
        let new_list = {name,surname,email,token,password};
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