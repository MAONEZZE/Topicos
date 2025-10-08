import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Song {
  id: string;
  name: string;
  artist: string;
  genre: string;
  year: string;
  thumbnail?: string;
}

export interface SongAndPupular extends Song, PopularMusicCountry {}

export interface PopularMusicCountry {
  idArtist: string;
  idAlbum: string;
  id: string;
  artist: string;
  album:	string;
  name:	string;
  thumbnail?: string;
  type: string;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  songs: SongAndPupular[];
  createdAt: string;
}

interface PlaylistsState {
  playlists: Playlist[];
}

const loadPlaylistsFromStorage = (): Playlist[] => {
  const stored = localStorage.getItem('playlists');
  return stored ? JSON.parse(stored) : [];
};

const initialState: PlaylistsState = {
  playlists: loadPlaylistsFromStorage(),
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    addPlaylist: (state, action: PayloadAction<Omit<Playlist, 'id' | 'createdAt'>>) => {
      const newPlaylist: Playlist = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      state.playlists.push(newPlaylist);
      localStorage.setItem('playlists', JSON.stringify(state.playlists));
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
        localStorage.setItem('playlists', JSON.stringify(state.playlists));
      }
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
      localStorage.setItem('playlists', JSON.stringify(state.playlists));
    },
    addSongToPlaylist: (state, action: PayloadAction<{ playlistId: string; song: SongAndPupular }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist && !playlist.songs.find(s => s.id === action.payload.song.id)) {
        playlist.songs.push(action.payload.song);
        localStorage.setItem('playlists', JSON.stringify(state.playlists));
      }
    },
    removeSongFromPlaylist: (state, action: PayloadAction<{ playlistId: string; songId: string }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter(s => s.id !== action.payload.songId);
        localStorage.setItem('playlists', JSON.stringify(state.playlists));
      }
    },
  },
});

export const { addPlaylist, updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } = playlistsSlice.actions;
export default playlistsSlice.reducer;
