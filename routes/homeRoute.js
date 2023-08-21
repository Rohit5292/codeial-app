const express = require('express');
const { home } = require('../controller/homecontroller');
const app = express();
const route = express.Router();

route.get('/',home);
route.get('/home',home);





module.exports= route;