import { BsTwitter } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setIsOpen } from '../../store/features/modal/modalSlice';

interface IModal {
  modalId: string;
  modalContent: any;
}
const Modal: React.FC<{ modal: IModal }> = ({ modal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleCloseModal = () => {
    dispatch(setIsOpen({ id: modal.modalId, isOpen: false }));
  };
  return (
    <div className='flex justify-center'>
      <div className="z-50 max-w-lg w-2/3 bg-black rounded-lg px-8 pt-8 pb-16 border-gray-700 border-2 fixed top-24 ">
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <span className="text-2xl text-gray-700 cursor-pointer" onClick={handleCloseModal}>
            X
          </span>
          <BsTwitter className="text-4xl" />
        </div>
        {modal.modalContent}
      </div>
    
      <div
        className="fixed z-20 inset-0 bg-black bg-opacity-80 w-full h-full top-0 left-0"
        onClick={handleCloseModal}
      ></div>
    </div>
  );
};
export default Modal;
