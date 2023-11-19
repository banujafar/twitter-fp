import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IUserPost } from '../../../models/post';

interface ModalState {
  isOpen: { [key: string]: boolean };
  postData: { [key: string]: IUserPost }; // Adjust the type based on your post data structure
}

export const initialState: ModalState = {
  isOpen: {},
  postData: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsOpen: (state: ModalState, action: PayloadAction<{ id: string; isOpen: boolean; postData?: any }>) => {
      const { id, isOpen, postData } = action.payload;
      state.isOpen[id] = isOpen;
      if (postData) {
        state.postData[id] = postData;
      }
    },
  },
});


export const setIsOpen = (payload: { id: string; isOpen: boolean,postData?:any }) => {
  return {
    type: 'modal/setIsOpen',
    payload,
  };
};

const modalSelector = (state: RootState) => state.modal;

const isOpenSelector = createSelector([modalSelector], (modal) => modal.isOpen);

export const modalIsOpenSelector = createSelector([isOpenSelector, (state, id) => id], (isOpen: any, id) => isOpen[id]);
export default modalSlice.reducer;
