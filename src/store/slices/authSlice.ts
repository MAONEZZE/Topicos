import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; email: string }>) => {//Reducer
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      sessionStorage.setItem('lastLogin', new Date().toISOString());
      //uma função que recebe o estado atual e uma ação (action) e modifica o estado global.
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('lastLogin');
    },
    restoreSession: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
