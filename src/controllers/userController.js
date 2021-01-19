const { Mongoose } = require('mongoose');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'Email and Password must be provide' });
  }
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY);
    return res.status(201).send({ token });
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).send({ error: 'Password and Email must be provide' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'Invalid Password or Email' });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid Password or Email' });
  }
};

module.exports = { createUser, loginUser };
