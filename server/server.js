import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'song-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://luminariapex_db_user:ZbW8aUvX5yGYQDyl@cluster0.hsqygo6.mongodb.net/music-player?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema for dynamic data
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    displayName: String,
    bio: String,
    avatar: String
  },
  preferences: {
    genres: [String],
    favoriteArtists: [String],
    mood: String
  },
  settings: {
    theme: { type: String, default: 'light' },
    volume: { type: Number, default: 0.7 },
    audioQuality: { type: String, default: 'high' },
    crossfade: { type: Boolean, default: false },
    crossfadeDuration: { type: Number, default: 5 },
    normalizeVolume: { type: Boolean, default: true },
    privateMode: { type: Boolean, default: false },
    showListeningActivity: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true }
  },
  stats: {
    songsPlayed: { type: Number, default: 0 },
    favoriteSongs: { type: Number, default: 0 },
    playlistsCreated: { type: Number, default: 0 },
    songsUploaded: { type: Number, default: 0 },
    listeningTime: { type: Number, default: 0 } // in minutes
  },
  listeningHistory: [{
    songId: String,
    songTitle: String,
    artist: String,
    playedAt: { type: Date, default: Date.now },
    duration: Number
  }],
  favoriteSongs: [{
    songId: String,
    songTitle: String,
    artist: String,
    addedAt: { type: Date, default: Date.now }
  }],
  uploadedSongs: [{
    songId: String,
    title: String,
    artist: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// In-memory storage for API songs and temporary data
let apiSongsCache = [];
let userUploads = [];

// Music API Service (same as before)
class MusicAPIService {
  async getJamendoTracks(genre = '', limit = 20) {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
        params: {
          client_id: process.env.JAMENDO_CLIENT_ID || 'YOUR_JAMENDO_CLIENT_ID',
          format: 'json',
          limit: limit,
          tags: genre,
          order: 'popularity_total',
          include: 'musicinfo'
        }
      });

      return response.data.results.map(track => ({
        id: `jamendo_${track.id}`,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        genre: track.tags || 'Various',
        duration: Math.floor(track.duration),
        fileUrl: track.audio,
        coverArt: track.album_image || '/uploads/default-cover.jpg',
        plays: track.popularity_total || 0,
        releaseYear: new Date(track.releasedate).getFullYear(),
        source: 'jamendo',
        mood: this.getMoodFromTags(track.tags)
      }));
    } catch (error) {
      console.error('Jamendo API error:', error.message);
      return [];
    }
  }

  async getDeezerTracks(genre = '', limit = 20) {
    try {
      const response = await axios.get(`https://api.deezer.com/search`, {
        params: {
          q: genre ? `genre:"${genre}"` : '',
          limit: limit
        }
      });

      return response.data.data.map(track => ({
        id: `deezer_${track.id}`,
        title: track.title,
        artist: track.artist.name,
        album: track.album?.title || 'Single',
        genre: genre || 'Various',
        duration: Math.floor(track.duration),
        fileUrl: track.preview,
        coverArt: track.album?.cover_medium || '/uploads/default-cover.jpg',
        plays: track.rank || 0,
        releaseYear: new Date().getFullYear(),
        source: 'deezer',
        mood: 'energetic'
      }));
    } catch (error) {
      console.error('Deezer API error:', error.message);
      return [];
    }
  }

  getMoodFromTags(tags) {
    if (!tags) return 'energetic';
    const tagString = tags.toLowerCase();
    if (tagString.includes('happy') || tagString.includes('joyful')) return 'happy';
    if (tagString.includes('sad') || tagString.includes('melancholy')) return 'sad';
    if (tagString.includes('calm') || tagString.includes('peaceful')) return 'calm';
    if (tagString.includes('romantic') || tagString.includes('love')) return 'romantic';
    if (tagString.includes('focus') || tagString.includes('study')) return 'focused';
    return 'energetic';
  }

  getSampleTracks() {
    return [
      {
        id: 'sample_1',
        title: 'Summer Vibes',
        artist: 'Independent Artist',
        album: 'Demo Tracks',
        genre: 'Pop',
        duration: 180,
        fileUrl: '/uploads/sample1.mp3',
        coverArt: '/uploads/default-cover.jpg',
        plays: 154,
        releaseYear: 2024,
        source: 'sample',
        mood: 'happy'
      }
    ];
  }
}

const musicAPI = new MusicAPIService();

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // In production, hash this!
      profile: {
        displayName: username,
        bio: '',
        avatar: ''
      },
      preferences: {
        genres: [],
        favoriteArtists: [],
        mood: ''
      }
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        settings: user.settings,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // In production, use bcrypt to compare passwords
    if (password !== user.password) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        settings: user.settings,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Get user profile with dynamic stats
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent activity
    const recentActivity = user.listeningHistory
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .slice(0, 10);

    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          stats: user.stats,
          preferences: user.preferences
        },
        recentActivity,
        favoriteSongs: user.favoriteSongs.slice(0, 10),
        uploadedSongs: user.uploadedSongs
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update user profile
app.put('/api/users/:id/profile', async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'profile.displayName': displayName,
          'profile.bio': bio,
          'profile.avatar': avatar
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Update user settings
app.put('/api/users/:id/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { settings } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('❌ Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
});

// Record song play
app.post('/api/users/:id/record-play', async (req, res) => {
  try {
    const { songId, songTitle, artist, duration } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { 
          'stats.songsPlayed': 1,
          'stats.listeningTime': Math.floor(duration / 60)
        },
        $push: {
          listeningHistory: {
            songId,
            songTitle,
            artist,
            duration
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Play recorded successfully',
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('❌ Record play error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording play',
      error: error.message
    });
  }
});

// Upload Route (FIXED - with user tracking)
app.post('/api/music/upload', upload.single('audio'), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const { title, artist, album, genre, mood, lyrics, releaseYear, userId } = req.body;

    if (!title || !artist || !genre || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Title, artist, genre, and user ID are required'
      });
    }

    // Create song object
    const song = {
      id: `user_${Date.now()}`,
      title,
      artist,
      album: album || '',
      genre,
      mood: mood || 'energetic',
      lyrics: lyrics || '',
      duration: 180,
      fileUrl: `/uploads/${req.file.filename}`,
      coverArt: '/uploads/default-cover.jpg',
      plays: 0,
      releaseYear: releaseYear ? parseInt(releaseYear) : new Date().getFullYear(),
      uploadedBy: userId,
      uploadedAt: new Date(),
      source: 'user'
    };

    // Add to user uploads array
    userUploads.push(song);

    // Update user stats in database
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.songsUploaded': 1 },
      $push: {
        uploadedSongs: {
          songId: song.id,
          title: song.title,
          artist: song.artist,
          uploadedAt: new Date()
        }
      }
    });

    console.log('✅ Song uploaded successfully:', song.title);

    res.status(201).json({
      success: true,
      message: 'Song uploaded successfully',
      data: { song }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading song',
      error: error.message
    });
  }
});

// Music Routes (same as before, but updated to include user tracking)
app.get('/api/music/songs', async (req, res) => {
  try {
    const { search, genre, mood, page = 1, limit = 20, source = 'all' } = req.query;

    let apiSongs = [];
    let userSongs = [...userUploads];

    if (source === 'all' || source === 'api') {
      const [jamendoSongs, deezerSongs] = await Promise.all([
        musicAPI.getJamendoTracks(genre, limit),
        musicAPI.getDeezerTracks(genre, limit)
      ]);
      
      apiSongs = [...jamendoSongs, ...deezerSongs];
      
      if (apiSongs.length === 0) {
        apiSongs = musicAPI.getSampleTracks();
      }
    }

    let allSongs = [...apiSongs, ...userSongs];

    // Apply filters
    if (search) {
      allSongs = allSongs.filter(song => 
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase()) ||
        song.album.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (genre && genre !== '') {
      allSongs = allSongs.filter(song => 
        song.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    if (mood && mood !== '') {
      allSongs = allSongs.filter(song => 
        song.mood.toLowerCase() === mood.toLowerCase()
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSongs = allSongs.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: 'Songs fetched successfully',
      data: {
        songs: paginatedSongs,
        total: allSongs.length,
        totalPages: Math.ceil(allSongs.length / limit),
        currentPage: parseInt(page),
        sources: {
          api: apiSongs.length,
          user: userSongs.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Get songs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching songs',
      error: error.message
    });
  }
});


app.get('/api/music/songs/:id', async (req, res) => {
  try {
    const songId = req.params.id;
    
    // Check user uploads first
    let song = userUploads.find(s => s.id === songId);
    
    // If not found in uploads, check API songs (would need to implement caching)
    if (!song) {
      // For demo, we'll return a sample response
      // In production, you'd cache API results or re-fetch
      song = {
        id: songId,
        title: 'Track Details',
        artist: 'Various Artists',
        album: 'Unknown Album',
        genre: 'Various',
        duration: 180,
        fileUrl: '/uploads/sample1.mp3',
        coverArt: '/uploads/default-cover.jpg',
        plays: 0,
        releaseYear: 2024,
        source: 'api'
      };
    }

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Increment play count
    song.plays = (song.plays || 0) + 1;

    res.json({
      success: true,
      message: 'Song fetched successfully',
      data: { song }
    });
  } catch (error) {
    console.error('❌ Get song error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message
    });
  }
});

app.get('/api/music/recommendations', async (req, res) => {
  try {
    // Get popular tracks from APIs
    const [jamendoSongs, deezerSongs] = await Promise.all([
      musicAPI.getJamendoTracks('', 10),
      musicAPI.getDeezerTracks('', 10)
    ]);

    let recommendations = [...jamendoSongs, ...deezerSongs, ...userUploads]
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 12);

    // If no recommendations, use sample tracks
    if (recommendations.length === 0) {
      recommendations = musicAPI.getSampleTracks();
    }

    res.json({
      success: true,
      message: 'Recommendations fetched successfully',
      data: recommendations
    });
  } catch (error) {
    console.error('❌ Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// Upload Route for user songs
app.post('/api/music/upload', upload.single('audio'), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const { title, artist, album, genre, mood, lyrics, releaseYear } = req.body;

    // Validation
    if (!title || !artist || !genre) {
      return res.status(400).json({
        success: false,
        message: 'Title, artist, and genre are required'
      });
    }

    // Create song object
    const song = {
      id: `user_${Date.now()}`,
      title,
      artist,
      album: album || '',
      genre,
      mood: mood || 'energetic',
      lyrics: lyrics || '',
      duration: 180, // You'd calculate this from the audio file
      fileUrl: `/uploads/${req.file.filename}`,
      coverArt: '/uploads/default-cover.jpg',
      plays: 0,
      releaseYear: releaseYear ? parseInt(releaseYear) : new Date().getFullYear(),
      uploadedBy: 'user', // In real app, get from auth
      uploadedAt: new Date(),
      source: 'user' // Mark as user upload
    };

    // Add to user uploads
    userUploads.push(song);

    console.log('✅ Song uploaded successfully:', song.title);

    res.status(201).json({
      success: true,
      message: 'Song uploaded successfully',
      data: { song }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading song',
      error: error.message
    });
  }
});

// Get user's uploaded songs
app.get('/api/music/user-uploads', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User uploads fetched successfully',
      data: userUploads
    });
  } catch (error) {
    console.error('❌ Get user uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user uploads',
      error: error.message
    });
  }
});

// Playlist routes
app.get('/api/music/playlists/user', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Playlists fetched successfully',
      data: []
    });
  } catch (error) {
    console.error('❌ Get playlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching playlists',
      error: error.message
    });
  }
});

app.get('/api/music/playlists/:id', (req, res) => {
  try {
    const playlist = {
      id: req.params.id,
      name: 'Sample Playlist',
      description: 'This is a sample playlist',
      owner: { username: 'system' },
      songs: [...userUploads].slice(0, 3),
      isPublic: true,
      plays: 0
    };

    res.json({
      success: true,
      message: 'Playlist fetched successfully',
      data: playlist
    });
  } catch (error) {
    console.error('❌ Get playlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching playlist',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running',
    data: {
      usersCount: users.length,
      userUploadsCount: userUploads.length,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      apis: {
        jamendo: 'Available',
        deezer: 'Available',
        musicbrainz: 'Available'
      }
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working!',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Music Player API Server',
    data: {
      version: '1.0.0',
      endpoints: {
        auth: ['POST /api/auth/register', 'POST /api/auth/login'],
        music: [
          'GET /api/music/songs', 
          'GET /api/music/songs/:id', 
          'GET /api/music/recommendations', 
          'POST /api/music/upload',
          'GET /api/music/user-uploads'
        ],
        system: ['GET /api/health', 'GET /api/test']
      },
      features: {
        external_apis: ['Jamendo', 'Deezer', 'MusicBrainz'],
        user_uploads: true,
        streaming: true
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎵 Music Player Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👤 Database: MongoDB connected`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
});