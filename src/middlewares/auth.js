const db = require('./../../config/database.js');
const session = require('express-session');


const updateUserSession = (remember_me) => {
    return new Promise(function(resolve,reject) {
        db.query("SELECT * FROM `users` WHERE remember_me = ?", [remember_me], function (error, results) {
            if(error){
                reject(false);
            }else{
                resolve(results.length > 0 ? results[0] : false)
            } 
        });
    });
    
}

exports.auth = async (req,res,next) => {
    if(!req.session.email){
        let remember_me = req.cookies.rememberMeKey;
        if(remember_me){
            let resp = await updateUserSession(remember_me);
            if(resp){
                let sess = req.session;
                sess.email = resp['email'];
                sess.auth_user = resp['id'];
                sess.name = resp['name'];
                sess.surname = resp['surname'];
                next()
            }else{res.redirect('/login')}
        }else{return res.redirect('/login');}
    }else{
        next()
    }
}

exports.no_auth = (req,res,next) => {
    if(req.session.email){return res.redirect('/profile');}
    next()
}
