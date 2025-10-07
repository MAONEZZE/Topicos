import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import playlistsReducer from './slices/playlistsSlice';
import musicReducer from './slices/musicSlice';

//configureStore → é a função do Redux Toolkit usada para criar o store
export const store = configureStore({//onde o Redux monta o estado global da aplicação
  reducer: {
    auth: authReducer,
    playlists: playlistsReducer,
    music: musicReducer,
  },
  //são os reducers criados por cada slice
});

//permite que qualquer componente acesse o estado global via useSelector() e modifique o estado via useDispatch().S

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
