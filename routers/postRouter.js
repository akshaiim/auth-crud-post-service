const express = require("express");
const { addPosts, getPosts, updatePost, deletePost } = require("../controllers/postController");
const schema = require("./postInputSchema");
const { validateSchema } = require("../utils/schemaValidation");
const verifyToken = require("../validations/auth");
const router = express.Router();
// route to save user credentials in db
router.post("/", [validateSchema(schema.post_schema), verifyToken], addPosts);
// route to fetch posts
router.get("/", getPosts);
// route to update post
router.patch("/", [validateSchema(schema.update_schema), verifyToken], updatePost)
// route to delete post
router.delete("/", [validateSchema(schema.delete_schema), verifyToken], deletePost)


module.exports = router;