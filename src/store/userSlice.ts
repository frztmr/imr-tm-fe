// untuk menyimpan data user ke redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Ini untuk typescript
interface userState {
    userData: {
        pid: String;
        role_code: String;
        role_name: String;
        uname: String;
    },
    userConfig: {
        dayTheme: true;
    }
}


//ini untuk inisiasi dan untuk mereset data
const initialState: userState = {
    userData: {
        pid: '',
        role_code:'',
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
        login: (state, action: PayloadAction<userState['userData']>) => {
            state.userData = action.payload;
        },
        //menghapus dan inisasi data ke redux
        logout: (state) => {
            state.userData = initialState.userData
        }
        // Add other reducers as needed
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer; 