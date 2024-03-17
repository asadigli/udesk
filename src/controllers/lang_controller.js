const path = require('path');
const fs = require("fs");
const { I18n } = require('i18n');
const i18n = new I18n()
const configs_datas = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));


i18n.configure({
    locales: configs_datas.languages,
    directory: path.join(path.dirname(require.main.filename), 'languages'),
    defaultLocale: 'az',
    cookie: 'whCookieSecretName',
    register: global
});
// i18n.setLocale('az')
module.export = i18n
