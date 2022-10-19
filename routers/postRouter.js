const express = require('express');
const multer = require('multer');
const {
  addPosts, getPosts, updatePost, deletePost,
} = require('../controllers/postController');
const schema = require('./postInputSchema');
const { validateSchema } = require('../utils/schemaValidation');
const verifyToken = require('../validations/auth');

// using multer to handle image upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + file.originalname);
  },
});

// function to allow only jpg/jpeg/png image uploads
function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
    return;
  }
  cb(new Error('Only Jpg, Jpeg and png file types allowed.'), false);
}
const upload = multer({ storage, fileFilter });

const router = express.Router();
// route to save post data in db
router.post('/', [upload.single('image'), validateSchema(schema.postSchema), verifyToken], addPosts);
// route to fetch posts
router.get('/', validateSchema(schema.getSchema, 'query'), getPosts);
// route to update post
router.patch('/', [upload.single('image'), validateSchema(schema.updateSchema), verifyToken], updatePost);
// route to delete post
router.delete('/', [validateSchema(schema.deleteSchema), verifyToken], deletePost);

module.exports = router;
