const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    username: {
        type: String,
        require:true
    },
    mobile: {
        type: String,
    },
    status: {
        type: Number,
        default:1
    },
    avatar: {
        type: String,
    }
},{timestamps: true});

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if password is not modified
  
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = userSchema;