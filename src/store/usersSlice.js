import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    { name: 'Alex', age: 28, bio: 'Loves hiking and coffee.', photo: '' },
    { name: 'Sam', age: 24, bio: 'Music enthusiast and foodie.', photo: '' },
    { name: 'Jordan', age: 31, bio: 'Avid reader and traveler.', photo: '' },
  ],
  currentIndex: 2,
  likedUsers: [],
  dislikedUsers: [],
  messages: {},
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    likeUser: (state) => {
      if (state.currentIndex >= 0) {
        state.likedUsers.push(state.users[state.currentIndex]);
        state.currentIndex -= 1;
      }
    },
    dislikeUser: (state) => {
      if (state.currentIndex >= 0) {
        state.dislikedUsers.push(state.users[state.currentIndex]);
        state.currentIndex -= 1;
      }
    },
    sendMessage: (state, action) => {
      const { recipient, text, sender = 'You' } = action.payload;
      if (!state.messages[recipient]) {
        state.messages[recipient] = [];
      }
      state.messages[recipient].push({ sender, text, timestamp: Date.now() });
    },
  },
});

export const { likeUser, dislikeUser, sendMessage } = usersSlice.actions;
export default usersSlice.reducer;