// untuk menyimpan data user ke redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userState } from './types'


//ini untuk inisiasi dan untuk mereset data
const initialState: userState = {
    personalData: {
        pid: '',
        role_code: '',
        role_name: '',
        uname: ''
    },
    userConfig: {
        dayTheme: true
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //add data ke redux
        login: (state, action: PayloadAction<userState['personalData']>) => {
            state.personalData = action.payload;
        },
        //menghapus dan inisasi data ke redux
        logout: (state) => {
            state.personalData = initialState.personalData
        }
        // Add other reducers as needed
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer; 