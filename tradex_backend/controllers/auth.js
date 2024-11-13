const User = require('../models/User');
const middleware = require('../middleware/index');

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).send({
        status: 'Error',
        msg: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).send({
        status: 'Error',
        msg: 'Invalid credentials.',
      });
    }

    // Compare passwords
    const matched = await middleware.comparePassword(user.password, password);

    if (matched) {
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = middleware.createToken(payload);
      return res.status(200).send({ user: payload, token });
    } else {
      return res.status(401).send({
        status: 'Error',
        msg: 'Invalid credentials.',
      });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send({
      status: 'Error',
      msg: 'An error has occurred while logging in.',
    });
  }
};

const Register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Input validation
    if (!email || !password || !username) {
      return res.status(400).send({
        status: 'Error',
        msg: 'Please provide email, username, and password.',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        status: 'Error',
        msg: 'A user with that email already exists.',
      });
    }

    const hashedPassword = await middleware.hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    res.status(201).send({
      status: 'Success',
      msg: 'User registered successfully.',
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).send({
      status: 'Error',
      msg: 'An error has occurred while registering.',
    });
  }
};

module.exports = {
  Login,
  Register,
};