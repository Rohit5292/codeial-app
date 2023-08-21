const Post = require("../models/post");

module.exports.home =async (req, res, next) => {
  const posts= await Post.find({});
    res.render('home',{posts});
  };