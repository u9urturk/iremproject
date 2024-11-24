
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { uid, email, displayName } = action.payload; // Serileştirilebilir alanlar
            state.user = { uid, email, displayName }; // Sadece düz nesneler saklanır
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;