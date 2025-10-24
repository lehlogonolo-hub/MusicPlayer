import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  artist: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  album: {
    type: String,
    trim: true,
    maxlength: 100
  },
  genre: {
    type: String,
    required: true,
    enum: ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Other']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverArt: {
    type: String,
    default: '/uploads/default-cover.jpg'
  },
  lyrics: {
    type: String
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'focused', '']
  },
  plays: {
    type: Number,
    default: 0
  },
  releaseYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Song', songSchema);