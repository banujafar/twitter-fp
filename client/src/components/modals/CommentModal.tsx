import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useState } from 'react';
import SinglePost from '../ui/SinglePost';
import { addComment } from '../../store/features/post/postSlice';
const CommentModal = () => {
  const quoteModalContent = useSelector((state: RootState) => state.modal.postData['modalComment']);
  const [text, setText] = useState('');
  const user=useSelector((state:RootState)=>state.auth.user);
  console.log(user)
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = (e: any) => {
    setText(e.target.value);
  };
  const handleSendComment = async (e: any) => {
    e.preventDefault();
    const formData = { comment: text, user_id: quoteModalContent.user.id, post_id: quoteModalContent.id };
    console.log(formData);
    await dispatch(addComment(formData));
  };
 
  return (
    <Modal
      modal={{
        modalId: 'modalComment',
        modalContent: (
          <div className=" bg-transparent">
            <SinglePost postData={quoteModalContent} />
            <div className=" text-gray-500 px-14 py-2">
              Replying to <span className=" text-twitterColor">@{quoteModalContent.user?.username}</span>
            </div>
            <form onSubmit={handleSendComment} className=" flex justify-between items-center mt-2">
              <textarea
                value={text}
                onChange={handleChange}
                style={{ minHeight: '3rem' }}
                maxLength={280}
                placeholder={'Post your reply'}
                className={` resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparent text-white`}
              />
              <button
                type="submit"
                className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium"
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
