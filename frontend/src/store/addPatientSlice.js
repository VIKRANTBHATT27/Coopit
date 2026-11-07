import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     selectedTab: 0,
}

const addPatientSlice = createSlice({
     name: "form",
     initialState,
     reducers: {
          changeValue: (state, action) => {
               state.selectedTab = action.payload;
          }
     }
})


export const { changeValue } = addPatientSlice.actions;


export default addPatientSlice.reducer;