import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
  };

  const postModalSlice = createSlice({
    name: 'postModal',
    initialState,
    reducers: {
        setPostModal: (state, action) => {
            state.isOpen = action.payload.isOpen;
        },
    }
  });

  export const { setPostModal } = postModalSlice.actions;
  
  export default postModalSlice.reducer;