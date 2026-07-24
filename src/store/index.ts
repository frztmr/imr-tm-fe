import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './TransactionSlice'; // Import your slice
import userReducer from './userSlice'; // Import your slice

const store = configureStore({
  reducer: {
    inventory: inventoryReducer, // Add your reducer here
    userData: userReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;