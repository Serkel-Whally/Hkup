const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  phone: { type: String },
  roles: { type: [String], default: ['User'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('User', userSchema);
