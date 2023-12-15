import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IUserPost } from '../../../models/post';

interface ModalState {
  isOpen: { [key: string]: boolean };
  postData: { [key: string]: IUserPost };
}

export const initialState: ModalState = {
  isOpen: {},
  postData: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsOpen: (state: ModalState, action: PayloadAction<{ id: string; isOpen: boolean; postData?: IUserPost }>) => {
      const { id, isOpen, postData } = action.payload;
      state.isOpen[id] = isOpen;
      if (postData) {
        state.postData[id] = postData;
      }
    },
  },
});

export const setIsOpen = (payload: { id: string; isOpen: boolean; postData?: IUserPost }) => {
  return {
    type: 'modal/setIsOpen',
    payload,
  };
};

const modalSelector = (state: RootState) => state.modal;

const isOpenSelector = createSelector([modalSelector], (modal) => modal.isOpen);

export const modalIsOpenSelector = createSelector([isOpenSelector, (_, id) => id], (isOpen: any, id) => isOpen[id]);
export default modalSlice.reducer;
