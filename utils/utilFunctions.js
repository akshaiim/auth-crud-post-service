/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const moment = require('moment');
const postModel = require('../models/postModels');

const isOwner = async (id, user) => {
  const posts = await postModel.find({ _id: id }).select('createdBy').catch((e) => {
    console.log(e);
    throw new Error('Please check docId.');
  });
  // console.log(id, user, posts);
  if (!posts || posts?.length === 0) throw new Error('Please check doc id.');
  if (posts[0].createdBy === user) {
    return true;
  }
  return false;
};

const getPostsByQueryparams = async (query) => {
  if (query.startDate && query.endDate) {
    const startDate = moment.utc(query.startDate).format(); // req.query.startDate = 2016-09-25
    const endDate = moment.utc(query.endDate).format(); // req.query.endDate = 2016-09-25
    // 2022-10-14T10:44:51.853Z startDate and endDate format
    query.createdAt = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  const posts = await postModel.find(query).collation({ locale: 'en', strength: 2 }).select(['username', 'image', 'title', 'description', 'tags', 'createdAt']).sort({ createdAt: -1 });
  // console.log(posts);
  return posts;
};
module.exports = { isOwner, getPostsByQueryparams };
