/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // console.log(token);

    if (!token) return res.status(401).send('acccess denied');

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid Token');
  }
};

module.exports = verifyToken;
