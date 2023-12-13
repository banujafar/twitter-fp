import Modal from './Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CreatePost from '../ui/Posts/CreatePost';
import SinglePost from '../ui/Posts/SinglePost';

const QuoteModal = () => {
  const quoteModalContent = useSelector((state: RootState) => state.modal.postData['modalQuote']);

  return (
    <Modal
      modal={{
        modalId: 'modalQuote',
        modalContent: (
          <>
            <CreatePost
            inModal={true}
              content={
                <>
                  <div className="border-gray-400 border p-2 rounded-2xl flex flex-col ">
                    <div className="flex gap-2 items-center mb-2">
                    <SinglePost postData={quoteModalContent} size={44} />
                    </div>
                    <span className=" text-gray-700">Replying to @{quoteModalContent.user.username}</span>

                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {/* //TODO:IMPROVE THIS LINE */}
                    <a href="#" className=" text-blue-600">
                      Everyone can reply
                    </a>
                  </div>
                </>
              }
            />
          </>
        ),
      }}
    />
  );
};
export default QuoteModal;