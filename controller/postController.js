// Assuming you have already required necessary modules and set up your Express router

const Post = require("../models/post");

module.exports.createPost = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'Kindly login or sign up first');
      return res.redirect('/');
    }

    // Assuming that your Post model has a method like 'create' to save a new post
    // If you're using Mongoose, the correct method would be 'create', not 'save'
    const post = {
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId
    };

  
    await Post.create(post); 

    // Assuming you want to redirect to a specific page after post creation
    return res.redirect('/'); 

  } catch (error) {
    console.error('Error in saving post:', error);
    // Handle the error appropriately, you might want to send an error response
    return res.status(500).send('Error in saving post');
  }
};
