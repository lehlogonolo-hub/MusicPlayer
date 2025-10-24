import express from 'express';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all songs
router.get('/songs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      mood,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    
    if (genre && genre !== '') query.genre = genre;
    if (mood && mood !== '') query.mood = mood;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const songs = await Song.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('uploadedBy', 'username profile');

    const total = await Song.countDocuments(query);

    res.json({
      songs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ 
      message: 'Error fetching songs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get song by ID
router.get('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('uploadedBy', 'username profile');
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Increment play count
    song.plays += 1;
    await song.save();

    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ 
      message: 'Error fetching song',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get recommendations (protected)
router.get('/recommendations', auth, async (req, res) => {
  try {
    // For demo purposes, return some sample songs
    // In a real app, you'd implement actual recommendation logic
    const recommendations = await Song.find()
      .sort({ plays: -1 })
      .limit(10)
      .populate('uploadedBy', 'username');

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      message: 'Error fetching recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create playlist (protected)
router.post('/playlists', auth, async (req, res) => {
  try {
    const { name, description, isPublic = true, tags = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    const playlist = new Playlist({
      name,
      description,
      isPublic,
      tags,
      owner: req.user._id,
      songs: []
    });

    await playlist.save();
    
    // Add playlist to user's playlists
    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id }
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ 
      message: 'Error creating playlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's playlists (protected)
router.get('/playlists/user', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs')
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    console.error('Get user playlists error:', error);
    res.status(500).json({ 
      message: 'Error fetching playlists',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get playlist by ID
router.get('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'username profile')
      .populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ 
      message: 'Error fetching playlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;