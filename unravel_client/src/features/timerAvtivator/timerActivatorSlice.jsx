import { createSlice } from "@reduxjs/toolkit";

export const timerActivatorSlice = createSlice({
  name: "timerActivator",
  initialState: {
    timerActive: false,
  },
  reducers: {
    setTimerActivatorOn: (state) => {
      state.timerActive = true;
    },
    setTimerActivatorOff: (state) => {
      state.timerActive = false;
    },
  },
});

export const { setTimerActivatorOn, setTimerActivatorOff } =
  timerActivatorSlice.actions;
export default timerActivatorSlice.reducer;
