import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IUserPost } from '../../../models/post';
import { IUser } from '../../../models/user';

interface ModalState {
  isOpen: { [key: string]: boolean };
  postData: { [key: string]: IUserPost };
  postHost: { [key: string]: IUser };
}

export const initialState: ModalState = {
  isOpen: {},
  postData: {},
  postHost: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsOpen: (
      state: ModalState,
      action: PayloadAction<{ id: string; isOpen: boolean; postData?: IUserPost; postHost?: IUser }>,
    ) => {
      const { id, isOpen, postData, postHost } = action.payload;
      state.isOpen[id] = isOpen;
      if (postData) {
        state.postData[id] = postData;
      }
      if (postHost) {
        state.postHost[id] = postHost;
      }
    },
  },
});

<<<<<<< HEAD
export const setIsOpen = (payload: { id: string; isOpen: boolean; postData?: IUserPost }) => {
=======
export const setIsOpen = (payload: { id: string; isOpen: boolean; postData?: IUserPost; postHost?: IUser }) => {
>>>>>>> 7e34fa2 (Improve client and server side code,which are done following changes:)
  return {
    type: 'modal/setIsOpen',
    payload,
  };
};

const modalSelector = (state: RootState) => state.modal;

const isOpenSelector = createSelector([modalSelector], (modal) => modal.isOpen);

export const modalIsOpenSelector = createSelector([isOpenSelector, (state, id) => id], (isOpen: any, id) => isOpen[id]);
export default modalSlice.reducer;
