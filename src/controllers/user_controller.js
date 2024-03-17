const fs = require('fs');
const db = require('../../config/database.js');
const path = require('path');
require(path.dirname(require.main.filename) + '/src/controllers/lang_controller.js');

let configs = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));
let locals = {project_name: configs.project_name};


exports.list = (req, res) => {
    let sql = 'SELECT * FROM `users`';
    db.query(sql,(err,result) => {
        if(err) throw err;
        locals = Object.assign(locals,{
            title: __('Employees'),
            link: 'employees',
            metaDescription: 'Page Description',
            metaKeys: 'Page Header',
            users: result
          });
        //   console.log(result);
        res.render('employees',locals)
    })
    
}