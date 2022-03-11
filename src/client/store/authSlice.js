import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../utils/axios';
import { usernameUpdated, allCalendarsUpdated, calendarEventsUpdated } from './userSlice';

const initialState = {
  accessToken: null,
  refreshToken: null,
  userId: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    accessTokenUpdated(state, action) {
      state.accessToken = action.payload;
    },
    refreshTokenUpdated(state, action) {
      state.refreshToken = action.payload;
    },
    userIdUpdated(state, action) {
      state.userId = action.payload;
    },
    userLoggedOut(state) {
      state = initialState;
    }
  }
});

export const { accessTokenUpdated, refreshTokenUpdated, userIdUpdated, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;

export const logoutUser = () => (dispatch) => {
  dispatch(userLoggedOut());
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post('/login', data);

    return Promise.resolve(res.data).then((res) => {
      const userId = res.id;
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      dispatch(userIdUpdated(userId));
      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
    });
  } catch (err) {
    if (err.response.data.name === 'AuthorizationError') {
      // unauthorize user
      dispatch(accessTokenUpdated(null));
    }
    return Promise.reject(err);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post('/register', data);

    return Promise.resolve(res.data).then((res) => {
      const userId = res.id;
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      dispatch(userIdUpdated(userId));
      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
