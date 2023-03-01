import { createSlice } from "@reduxjs/toolkit";

export const showSearchSlice = createSlice({
  name: "search",
  initialState: {
    showSearch: false,
  },
  reducers: {
    setShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
  },
});

export const { setShowSearch } = showSearchSlice.actions;
export default showSearchSlice.reducer;
