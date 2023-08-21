const express = require('express');
const { createPost } = require('../controller/postController');

const route = express.Router();

route.post('/create-post',createPost);

module.exports = route;