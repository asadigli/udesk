const fs = require('fs');
const path = require('path');
require(path.dirname(require.main.filename) + '/src/controllers/lang_controller.js');

let configs = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));
let locals = {project_name: configs.project_name};

// console.log(fs.existsSync('./config/config.json'))


exports.getHome = (req, res) => {
    locals = Object.assign(locals,{
        title: __('Home'),
        link: 'home',
        description: 'Page Description',
        header: 'Page Header'
      });
    res.render('index',locals)
}

exports.getTable = (req, res) => {
  locals = Object.assign(locals,{
      title: __('Table'),
      link: 'table',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('table',locals)
}

exports.getSales = (req, res) => {
  locals = Object.assign(locals,{
      title: __('Sales'),
      link: 'sales',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('sales/add',locals)
}


exports.getTabs = (req, res) => {
  locals = Object.assign(locals,{
      title: __('Tabs'),
      link: 'tabs',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('tabs',locals)
}