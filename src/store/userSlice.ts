// untuk menyimpan data user ke redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Ini untuk typescript
interface userState {
    userData: {
        active: number;
        employee_id: number;
        finished_date: null | string;
        firstname: string;
        lastname: string;
        login_trial_time: string;
        registration_nr: string;
        status: number;
        type_id: number;
        uid: string;
        user_level: number;
    },
    userConfig: {
        dayTheme: true;
    }
}


//ini untuk inisiasi dan untuk mereset data
const initialState: userState = {
    userData: {
        active: 0,
        employee_id: 0,
        finished_date: null,
        firstname: '',
        lastname: '',
        login_trial_time: '',
        registration_nr: '',
        status: 0,
        type_id: 0,
        uid: '',
        user_level: 0,
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