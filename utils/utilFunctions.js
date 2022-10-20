/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const moment = require('moment');
const jimp = require('jimp');
const cloudinary = require('cloudinary').v2;
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
  // checking if tags params has multiple tags value in query
  if (query.tags && query.tags.split(',').length) {
    const tagsArray = query.tags.split(',');
    query.tags = { $in: tagsArray };
  }
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

// function to upload image base64 data or uploaded image to cloudinary
const uploadImagesToCloudinary = async (image) => {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true,
  });

  const data = await cloudinary.uploader.upload(image,
    {
      folder: 'postPhoto',
      allowed_formats: ['png', 'jpg', 'jpeg'],
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return err;
      }
      return result.secure_url;
    });
  return data;
};

// checking if image base64 data or image url is valid
const checkImageValidity = async (str) => {
  const validFormat = /\.(jpg|jpeg|png)$/.test(str);
  if (validFormat) return validFormat;
  const buf = Buffer.from(str.split(',')[1], 'base64');
  let result = false;
  if (buf && !validFormat) {
    result = jimp.read(buf).then((img) => {
      if (img.bitmap.width > 0 && img.bitmap.height > 0) {
        return true;
      }
    }).catch((err) => {
      console.log(err);
      return true;
    });
  }

  return result;
};
module.exports = {
  isOwner, getPostsByQueryparams, uploadImagesToCloudinary, checkImageValidity,
};
