const express = require('express');
const {
  addPosts, getPosts, updatePost, deletePost,
} = require('../controllers/postController');
const schema = require('./postInputSchema');
const { validateSchema } = require('../utils/schemaValidation');
const verifyToken = require('../validations/auth');

const router = express.Router();
// route to save post data in db
router.post('/', [validateSchema(schema.postSchema), verifyToken], addPosts);
// route to fetch posts
router.get('/', validateSchema(schema.getSchema, 'query'), getPosts);
// route to update post
router.patch('/', [validateSchema(schema.updateSchema), verifyToken], updatePost);
// route to delete post
router.delete('/', [validateSchema(schema.deleteSchema), verifyToken], deletePost);

module.exports = router;
