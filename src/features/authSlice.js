import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const initialState = {
    user:null,
    isAuthenticated:false
}

console.log('INIITIAL STATE IS', initialState)



const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        userLoggedIn:(state,action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut:(state,action)=>{
            state.user = null;
            state.isAuthenticated = false;
        }
    }
})

export const {userLoggedIn,userLoggedOut} = authSlice.actions;
export default authSlice.reducer;