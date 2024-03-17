const express = require('express');
const router = express.Router();
const {auth,no_auth} = require('./middlewares/auth');

/* controllers section */
const homeController = require('./controllers/home_controller');
const userController = require('./controllers/user_controller');
const testController = require('./controllers/test_controller');

const cont_path = (name) => {return `./modules/${name}/controllers/${name}_controller`;}
const authController = require(cont_path('auth'));
const productController = require(cont_path('products'));
const salesController = require(cont_path('sales'));
const purchasesController = require(cont_path('purchases'));
const employeesController = require(cont_path('employees'));
const expenseController = require(cont_path('expenses'));
const customerController = require(cont_path('customers'));


/* routes section */
router.get('/',auth,homeController.getHome);
router.get('/table',auth,homeController.getTable);
router.get('/tabs',auth,homeController.getTabs);


// sales routes
router.get('/sale/add',auth,salesController.addPage); 
router.post('/sale/add',auth,salesController.addSale);
router.get('/sale/list',auth,salesController.salesList);
router.get('/sale/check-barcode',auth,salesController.checkBarcode);

// invoices routes
router.get('/purchase/add',auth,purchasesController.addPage); 
router.post('/purchase/add',auth,purchasesController.addInvoice);
router.get('/purchase/list',auth,purchasesController.invoicesList);
router.get('/purchase/check-barcode',auth,purchasesController.checkBarcode);

// employees routes
router.get('/employee/add',auth,employeesController.addPage); 
router.post('/employee/add',auth,employeesController.addEmployee);
router.get('/employee/list',auth,employeesController.employeesList);


router.get('/profile',auth,authController.profilePage);
router.get('/logout',auth,authController.logout);


// product routes
router.get('/product/list',auth,productController.productList);
router.get('/product/add',auth,productController.addPage);
router.post('/product/add',auth,productController.addAction);


// auth routes
router.get('/login',no_auth,authController.loginPage);
router.post('/login/action',no_auth,authController.loginAction);


/* expenses routes */
router.get('/expenses/list',no_auth,expenseController.expensesList);
router.get('/expenses/expenditure/add',no_auth,expenseController.expenditureAddView);
router.get('/expenses/income/add',no_auth,expenseController.incomeAddView);


/* customer routes */
router.get('/customer/add',no_auth,customerController.addView);
router.get('/customer/list',no_auth,customerController.customerList);
router.post('/customer/add/action',no_auth,customerController.addAction);


router.get('/test',testController.testPage);



module.exports = router;