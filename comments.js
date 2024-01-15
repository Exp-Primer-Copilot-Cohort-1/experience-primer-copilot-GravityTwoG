// Create web server with Express
const express = require('express');
const router = express.Router();

// Import comment model
const Comment = require('../models/Comment');

// Import post model
const Post = require('../models/Post');

// Import user model
const User = require('../models/User');

// Import authentication middleware
const { ensureAuthenticated } = require('../config/auth');

// Create comment
router.post('/create', ensureAuthenticated, (req, res) => {
  // Get post id
  const postId = req.body.postId;

  // Create comment
  const newComment = new Comment({
    postId: postId,
    content: req.body.content,
    authorId: req.user._id,
    authorName: req.user.name,
    });

    // Save comment
    newComment.save()
      .then(comment => {
        // Add comment to post
        Post.findById(postId)
          .then(post => {
            post.comments.push(comment);
            post.save()
              .then(() => {
                // Redirect to post
                res.redirect(`/posts/${postId}`);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
}
);