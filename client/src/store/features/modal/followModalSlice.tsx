import { createSlice } from "@reduxjs/toolkit";

interface IFollowModal {
    isOpen: boolean,
    data?:string | null
}

const initialState: IFollowModal = {
    isOpen: false,
    data: null
  };

  const followModalSlice = createSlice({
    name: 'followModal',
    initialState,
    reducers: {
        setModal: (state, action) => {
            state.isOpen = action.payload.isOpen;
            state.data = action.payload.data
        },
    },
    extraReducers: (builder) => {
      builder
    }
  });

  export const { setModal } = followModalSlice.actions;
  
  export default followModalSlice.reducer;