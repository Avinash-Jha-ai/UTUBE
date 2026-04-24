import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/authSlice';
import videoReducer from '../features/video/state/videoSlice';
import channelReducer from '../features/channel/state/channelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    channel: channelReducer,
  },
});
