
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkIsAdmin } from '../firebase/userService';


export const fetchUserRole = createAsyncThunk(
    'auth/fetchUserRole',
    async (uid) => {
        const userDoc = await checkIsAdmin(uid);
        return userDoc

    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAdmin: false
    },

    reducers: {
        setUser: (state, action) => {
            const { uid, email, displayName } = action.payload;
            state.user = { uid, email, displayName };
        },
        setUserRole: (state, action) => {
            state.isAdmin = action.payload.isAdmin;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAdmin = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchUserRole.fulfilled, (state, action) => {
            state.isAdmin = action.payload;
        });
    },
});

export const { setUser, clearUser, setUserRole } = authSlice.actions;
export default authSlice.reducer;