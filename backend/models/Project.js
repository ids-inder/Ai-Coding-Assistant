const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['web-static', 'web-dynamic', 'web-complex', 'android-app', 'ios-app', 'desktop-app', 'cli-tool', 'library', 'other'],
    default: 'other'
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'other'],
    default: 'javascript'
  },
  conversations: [{
    role: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  files: [{
    name: String,
    content: String,
    language: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
