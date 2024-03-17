const fs = require('fs');
const path = require("path");
const pth = '../modules/customers/views/';
const base_url = path.dirname(require.main.filename);
const db = require(base_url + '/config/database.js');
const helpers = require(base_url + '/helpers/custom_helper');
require(base_url + '/src/controllers/lang_controller.js');


let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.addView = (req, res) => {
    helpers.generateNextCode('sa_customers')
    .then(code => {
        locals = Object.assign(locals,{
            title: __('Add customer'),
            link: 'customer',
            code: code,
            metaDescription: '',
            metaKeys: '',
            message: req.flash('message'),
            type: req.flash('type')
          });
        res.render(pth + 'add',locals)
    });
    
}

exports.customerList = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Customers'),
        link: 'customer',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'add',locals)
}

exports.addAction = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Add product'),
        link: 'customer',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'add',locals)
}