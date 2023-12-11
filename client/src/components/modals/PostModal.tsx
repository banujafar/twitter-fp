import { useDispatch } from 'react-redux';
import { setPostModal } from '../../store/features/modal/postModalSlice';
import CreatePost from '../ui/Posts/CreatePost';

const PostModal = () => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(setPostModal({ isOpen: false }));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true"  >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleOverlayClick}></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between pb-3 border-b border-navHoverColor">

                <span className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>
                  &#x2715;
                </span>
              </div>

              <div className="mt-1">
               <CreatePost />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;
