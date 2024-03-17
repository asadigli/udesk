const path = require("path");
const db = require(path.dirname(require.main.filename) + '/config/database.js');


Number.prototype.pad = function(n) {
    let zeros = n - this.toString().length + 1;
    return new Array(zeros).join('0').slice((zeros || 2) * -1) + this;
}

function generateNextCodeFunction(table_name) {
    return new Promise(function(resolve,reject) {
        db.query("SELECT `code` FROM `"+table_name+"` ORDER BY `code` DESC LIMIT 1", function (error, results) {
            if(error){
                reject(false);
            }else{
                let code = results.length > 0 ? results[0]['code'] : 0;
                let numb = parseInt(code) + 1;
                let new_code = numb.pad(10);
                resolve(new_code)
            } 
        });
    });
}

exports.generateNextCode = async table_name => {
    return generateNextCodeFunction(table_name)
        .then(res => {
            return res;
        });
}


exports.slugify = txt => {
    text = txt.replace('ə','e').replace('ş','sh').replace('ç','ch')
                .replace('ö','o').replace('ü','u').replace('Ə','e')
                .replace('Ş','sh').replace('Ç','ch').replace('Ö','o')
                .replace('Ü','u');
    return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}