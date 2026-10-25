const mongoose = require('mongoose');
const User = require('../models/userModel');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, age, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, age, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    // Only allow these fields to be updated
    const { name, email, age, role } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (age !== undefined) updates.age = age;
    if (role !== undefined) updates.role = role;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // If the email is changing, make sure nobody else uses it
    if (updates.email) {
      const taken = await User.findOne({ email: updates.email, _id: { $ne: id } });
      if (taken) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,           // return the updated document
      runValidators: true  // apply schema validation on update
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found for update' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.status(200).json({ message: 'User deleted successfully', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};