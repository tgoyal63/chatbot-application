// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, unique: true },
//     password: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     lastActive: { type: Date, default: Date.now }
// });

// // Hashing the user's password before saving.
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// module.exports = mongoose.model('User', userSchema);
