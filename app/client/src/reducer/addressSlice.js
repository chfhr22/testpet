// features/addressSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const addressSlice = createSlice({
    name: 'address',
    initialState: {
        detailAddress: ''
    },
    reducers: {
        setDetailAddress: (state, action) => {
            state.detailAddress = action.payload;
        }
    }
});

export const { setDetailAddress } = addressSlice.actions;
export default addressSlice.reducer;
