import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userUpdateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    userUpdateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
} = userSlice.actions;
export default userSlice.reducer;
