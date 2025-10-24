import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Navbar from './components/Layout/Navbar';
import Player from './components/Player/Player';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import './App.css';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search title="Search" />} />
                <Route path="/library" element={<Library title="Library" />} />
                <Route path="/playlist/:id" element={<Playlist title="Playlist" />} />
                <Route path="/upload" element={<Upload title="Upload" />} />
                <Route path="/profile" element={<Profile title="Profile" />} />
                <Route path="/settings" element={<Settings title="Settings" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Player />
          </div>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;