/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const postModel = require('../models/postModels');
const { isOwner, getPostsByQueryparams } = require('../utils/utilFunctions');

const addPosts = async (req, res) => {
  try {
    const {
      image, title, description, tags,
    } = req.body;
    // getting userId and username from req.user
    const { _id, username } = req.user;
    // Create post in our database
    const post = await postModel.create({
      username,
      image,
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
  const toUpdate = {};
  if (image) toUpdate.image = image;
  if (description) toUpdate.description = description;
  if (title) toUpdate.title = title;
  if (tags.length) toUpdate.tags = tags;
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
