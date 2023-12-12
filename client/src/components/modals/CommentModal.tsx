import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useState } from 'react';
//import { addComment } from '../../store/features/post/postSlice';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import SinglePost from '../ui/Posts/SinglePost';
//import { useAddCommentMutation } from '../../store/features/post/postsApi';
import { addComment } from '../../store/features/post/postSlice';
import { socketSendNotification } from '../../utils/socketClient';
import { Link } from 'react-router-dom';
const CommentModal = () => {
  const quoteModalContent = useSelector((state: RootState) => state.modal.postData['modalComment']);
  const [text, setText] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);
  //const [addComment] = useAddCommentMutation();
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = (e: any) => {
    setText(e.target.value);
  };
  const handleSendComment = async (e: any) => {
    e.preventDefault();
    if (user?.userId) {
      await dispatch(addComment({ comment: text, userId: user?.userId, postId: quoteModalContent.id })).then(() => {
        dispatch(setIsOpen({ id: 'modalComment', isOpen: false }));
        socketSendNotification({
          username: user?.username,
          receiverName: quoteModalContent?.user?.username,
          postId: quoteModalContent?.id,
          action: 'added comment',
        });
      });
    }
  };

  const handleCloseModal = () => {
    dispatch(setIsOpen({ id: 'modalComment', isOpen: false }));
  };
  return (
    <Modal
      modal={{
        modalId: 'modalComment',
        modalContent: (
          <div className="bg-transparent ">
            <div className="border-gray-200 border rounded-xl p-2">
              <SinglePost postData={quoteModalContent} size={44} />
              <div className=" text-gray-400 px-4">
                Replying to{' '}
                <Link
                  to={`/profile/${quoteModalContent.user?.username}`}
                  className=" text-twitterColor"
                  onClick={handleCloseModal}
                >
                  @{quoteModalContent.user.username}
                </Link>
              </div>
            </div>
            <form onSubmit={handleSendComment} className={`flex justify-between items-center mt-4 px-2 `}>
              <textarea
                value={text}
                onChange={handleChange}
                style={{
                  minHeight: '2.5rem',
                }}
                maxLength={280}
                placeholder={'Post your reply'}
                className={`resize-none h-4 w-full overflow-y-hidden  focus:outline-twitterColor font-normal placeholder-[#90a3b2]  bg-transparent text-black text-l rounded-xl pt-2`}
              />
              <button
                type="submit"
                className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition text-l duration-300 font-medium"
                onClick={handleSendComment}
              >
                Reply
              </button>
            </form>
          </div>
        ),
      }}
    />
  );
};
export default CommentModal;
