/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send('All input is required');
    }

    // check if user already exist
    const oldUser = await userModel.find({ email }).catch((e) => { throw e; });

    if (oldUser?.length) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await userModel.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(), // sanitize: convert email username to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ _id: user._id, username }, process.env.SECRET_KEY, { expiresIn: process.env.expiryTime });

    // save user token
    user.token = token;

    // return new user
    return res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: process.env.expiryTime });

      // save user token
      user.token = token;

      // user
      return res.status(200).json({ user, token });
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
