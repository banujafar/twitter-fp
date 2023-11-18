import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';

export const initialState = {
  isOpen: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsOpen: (state: any, action: any) => {
      state.isOpen[action.payload.id] = action.payload.isOpen;
    },
  },
});

export const setIsOpen = (payload: { id: string; isOpen: boolean }) => {
  return {
    type: 'modal/setIsOpen',
    payload,
  };
};

const modalSelector = (state: RootState) => state.modal;

const isOpenSelector = createSelector([modalSelector], (modal) => modal.isOpen);

export const modalIsOpenSelector = createSelector([isOpenSelector, (state, id) => id], (isOpen: any, id) => isOpen[id]);
export default modalSlice.reducer;
