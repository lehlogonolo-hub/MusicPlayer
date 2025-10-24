import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  coverArt: {
    type: String
  },
  tags: [String],
  plays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Playlist', playlistSchema);