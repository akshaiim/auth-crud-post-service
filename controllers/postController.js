/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const postModel = require('../models/postModels');
const {
  isOwner, getPostsByQueryparams, uploadImagesToCloudinary, checkImageValidity,
} = require('../utils/utilFunctions');

const addPosts = async (req, res) => {
  try {
    const {
      image, title, description, tags,
    } = req.body;
    let imageUrl = '';
    // checking if image url or base64 data is valid
    const validImageUrl = await checkImageValidity(image).catch((err) => console.log(err));

    if (validImageUrl && !/\.(jpg|jpeg|png)$/.test(image)) {
      imageUrl = await uploadImagesToCloudinary(image).catch((err) => console.log(err));
    }
    if (req.file?.path) {
      imageUrl = await uploadImagesToCloudinary(req.file.path).catch((err) => console.log(err));
    }
    // getting userId and username from req.user
    const { _id, username } = req.user;
    // if image not in correct format
    if (!(validImageUrl ? image : imageUrl.secure_url)) return res.status(400).send('Please add valid image format.');
    // Create post in our database
    const post = await postModel.create({
      username,
      // if image url is passed in image params of request add imageUrl else add cloduinary url
      image: validImageUrl ? image : imageUrl.secure_url,
      title,
      description,
      tags,
      createdBy: _id,

    });

    // eslint-disable-next-line no-underscore-dangle
    const postId = post._id;
    return res.status(201).send({ message: 'Post created successfully', postId });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(500).send({ message: 'Please add another title, title should be unique' });
    }
    res.status(500).send(err.message);
  }
};

const getPosts = async (req, res) => {
  try {
    // Get Posts from database in descending order of creation
    let posts = [];
    // checking if query is present
    const queryLength = req.query && Object.keys(req.query).length === 0;
    // if no query params return all posts
    if (queryLength) {
      posts = await postModel.find({ }).select(['username', 'image', 'title', 'description', 'tags', 'createdAt']).sort({ createdAt: -1 });
    } else {
      posts = await getPostsByQueryparams(req.query);
    }
    if (posts?.length) {
      return res.status(200).send({ message: 'Success', posts });
    }
    return res.status(200).send({ message: 'No Posts found.' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const updatePost = async (req, res) => {
  const {
    id, image, title, description, tags,
  } = req.body;
  const user = req.user._id;
  let imageUrl = '';
  // checking if image url or base64 data is valid
  const validImageUrl = await checkImageValidity(image).catch((err) => console.log(err));

  if (validImageUrl && !/\.(jpg|jpeg|png)$/.test(image)) {
    imageUrl = await uploadImagesToCloudinary(image).catch((err) => console.log(err));
  }
  if (req.file?.path) {
    imageUrl = await uploadImagesToCloudinary(req.file.path).catch((err) => console.log(err));
  }
  const toUpdate = {};
  if (image) toUpdate.image = image;
  if (imageUrl?.secure_url) toUpdate.image = imageUrl.secure_url;
  if (description) toUpdate.description = description;
  if (title) toUpdate.title = title;
  if (tags?.length) toUpdate.tags = tags;
  // if image key added in request but image data not in correct format
  if (image && !(validImageUrl ? image : imageUrl.secure_url)) return res.status(400).send('Please add valid image format.');
  try {
    // checking if requesting user is the creator/owner of the doc.
    const authorised = await isOwner(id, user);
    // console.log(authorised);
    if (!authorised) throw new Error('You\'re not authorised to perform this action.');
    const updated = await postModel.findByIdAndUpdate({ _id: id }, toUpdate, { new: true });
    if (!updated) {
      // eslint-disable-next-line new-cap
      throw new Error('update failed');
    }

    return res.status(200).send({ message: 'Post successfully updated.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    let deleteById = false;
    const user = req.user._id;
    // checking if requesting user is the creator/owner of the doc.
    const authorised = await isOwner(id, user);
    // console.log(authorised);
    if (!authorised) throw new Error('You\'re not authorised to perform this action.');
    // Delete post by id
    if (id) {
      deleteById = await postModel.findByIdAndDelete({ _id: id }).catch((e) => console.log(e));
    }
    if (deleteById) return res.status(200).send({ message: 'Post deleted successfully.' });
    return res.status(500).send({ message: 'Failed to delete post.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  addPosts, getPosts, updatePost, deletePost,
};
