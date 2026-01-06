import { createSlice } from "@reduxjs/toolkit";
import Login from "../pages/LogIn";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    id: null,
    token: null,
    username: null,
    avatar: null,
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user";
      state.id = null;
      state.token = null;
      state.username = null;
      state.avatar = null;
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
    setUser(state, action) {
      const { id, token, username, avatar } = action.payload;
      state.id = id || state.id;
      state.token = token || state.token;
      state.username = username || state.username;
      state.avatar = avatar || state.avatar;
      state.isLoggedIn = true;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
