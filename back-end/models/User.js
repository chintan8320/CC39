const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;  
        delete ret._id;     
        delete ret.__v;     
      }
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id;  
        delete ret._id;     
        delete ret.__v;    
      }
    }
  }
);

module.exports = mongoose.model('User', userSchema);
