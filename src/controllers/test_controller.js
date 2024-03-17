const fs = require('fs'),
    path = require('path');
const db = require('../../config/database.js');
const { reset } = require('nodemon');
const session = require('express-session');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let configs = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));
// let locals = {project_name: configs.project_name};


const axios = require('axios');
const FormData = require('form-data');
serviceCallStarted = false;
let getReport = (sess) => {
    if(serviceCallStarted) return;
    serviceCallStarted = true;
    let count = 0;
    let interval = setInterval(() => {
        count++;
        console.log(count)
    }, 1000);
    var data = new FormData();
    data.append('type', 'repairer_price');
    data.append('customer', '0x80BEE0071BFF7E8111E8DB8BF31B1667');
    data.append('user', 'JCNESFNAJEFacyVeQFlEWTQ4MzQ3MDBPRUshUlRTPyUlI0Akc2Qk');
    var config = {
        method: 'get',
        url: 'https://test-avtohesab.cisct.net/get-reports-in-details?start_date=2021-05-01&end_date=2021-05-31&user=JCNESFNAJEFacyVeQFlEWTM4NDM4NE9FSyFSVFM%2FJSUjQCRzZCQ%3D&short_version=0',
        headers: { 
            'usecret': 'zQSUCsILgF', 
            'version': '2', 
            ...data.getHeaders()
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        // console.log(JSON.stringify(response.data));
        let date_ob = new Date();
        console.log(response.data.code);
        serviceCallStarted = false;
        clearInterval(interval);
        console.log("last result: " + count)
    })
    .catch(function (error) {
        console.log(error);
        serviceCallStarted = false;
        clearInterval(interval);
    });

}
exports.testPage = (req, res) => {
    getReport(serviceCallStarted)
    res.send("hello")
}
