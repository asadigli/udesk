const fs = require('fs');
const path = require("path");
const pth = '../modules/expenses/views/';
const db = require(path.dirname(require.main.filename) + '/config/database.js');
require(path.dirname(require.main.filename) + '/src/controllers/lang_controller.js');

let configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../config/config.json")));
let locals = {project_name: configs.project_name};

exports.expensesList = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Expenses'),
        link: 'product',
        metaDescription: '',
        metaKeys: '',
        message: req.flash('message'),
        type: req.flash('type')
      });
    res.render(pth + 'list',locals)
}

exports.expenditureAddView = (req, res) => {
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

exports.incomeAddView = (req, res) => {
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