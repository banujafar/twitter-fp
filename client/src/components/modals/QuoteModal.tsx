import Modal from './Modal';
import { IUserPost } from '../../models/post';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { useEffect } from 'react';

const QuoteModal: React.FC<{ quoteModalContent: IUserPost }> = ({ quoteModalContent }) => {
  //console.log(quoteModalContent);
  useEffect(() => {
    console.log(quoteModalContent);
  }, [quoteModalContent]);

  return (
    <Modal
      modal={{
        modalId: 'modalQuote',
        modalContent: (
          <>
            <div >
              <div className="flex gap-4 py-4">
                <Link to={`/profile/${quoteModalContent.user?.username}`} className="flex">
                  {quoteModalContent.user?.profilePhoto ? (
                    <img
                      src={quoteModalContent.user?.profilePhoto}
                      alt={`${quoteModalContent.user?.username}'s profile`}
                      className="w-16 h-16 rounded-full mb-4 sm:mb-0"
                    />
                  ) : (
                    <CgProfile size={44} className="text-gray-500" />
                  )}
                </Link>
                <input
                  name="comment"
                  id="comment"
                  placeholder="Add a comment"
                  className=" border-none bg-transparent text-lg"
                />
              </div>
              <div className="border-gray-600 border p-2 rounded-2xl flex flex-col ">
                <div className="flex gap-2 items-center mb-2">
                  <Link to={`/profile/${quoteModalContent.user?.username}`} className="flex">
                    {quoteModalContent.user?.profilePhoto ? (
                      <img
                        src={quoteModalContent.user?.profilePhoto}
                        alt={`${quoteModalContent.user?.username}'s profile`}
                        className="w-16 h-16 rounded-full mb-4 sm:mb-0"
                      />
                    ) : (
                      <CgProfile size={44} className="text-gray-500" />
                    )}
                  </Link>
                  <span className="text-gray-400">{quoteModalContent.user.username}</span>
                </div>
                <span className=" text-gray-700">Replying to @{quoteModalContent.user.username}</span>

                <span className=" text-gray-400 ">{quoteModalContent.content}</span>
              </div>
              <div className='flex justify-between items-center mt-2'>
                {/* //TODO:IMPROVE THIS LINE */}
                <a href="#" className=" text-blue-600">
                  Everyone can reply
                </a>
                <button
                  type="submit"
                  className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        ),
      }}
    />
  );
};
export default QuoteModal;
