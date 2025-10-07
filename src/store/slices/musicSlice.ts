import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PopularMusicCountry, Song, SongAndPupular } from './playlistsSlice';

interface MusicState {
  searchResults: SongAndPupular[];
  // agora é um mapa de código de país -> lista de músicas
  popularSongs: Record<string, Song[] | PopularMusicCountry[]>;
  loading: boolean;
  error: string | null;
}

const initialState: MusicState = {
  searchResults: [],
  popularSongs: {}, // inicializa como objeto vazio
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<SongAndPupular[]>) => {
      state.searchResults = action.payload;
      state.loading = false;
      state.error = null;
    },
    // aceitar um Record<string, Song[]>
    setPopularSongs: (state, action: PayloadAction<Record<string, Song[] | PopularMusicCountry[]>>) => {
      state.popularSongs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
});

export const { setLoading, setSearchResults, setPopularSongs, setError, clearSearchResults } =
  musicSlice.actions;
export default musicSlice.reducer;
