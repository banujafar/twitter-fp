import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { IUserPost } from '../../../models/post';
//import { likePost, removeLike, retweetPost } from '../../../store/features/post/postSlice';
import { setIsOpen } from '../../../store/features/modal/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { CiEdit } from 'react-icons/ci';
import { BsFillShareFill } from 'react-icons/bs';
// import {
//   useAddLikeMutation,
//   useAddRetweetMutation,
//   useDeleteRetweetMutation,
//   useGetPostsQuery,
//   useRemoveLikeMutation,
// } from '../../../store/features/post/postsApi';
import { getPosts, likePost, removeLike, retweetPost } from '../../../store/features/post/postSlice';
import {  socketRemoveNotification, socketSendNotification } from '../../../utils/socketClient';

const TweetActions: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  // const { data } = useGetPostsQuery();
  const userLikedPosts = postData.likes?.some((like) => like?.user?.id === user?.userId);
  const isRetweeted = postData.retweets?.some((rt: any) => rt?.user?.id === user?.userId);
  // const [deleteRetweet] = useDeleteRetweetMutation();
  // const [addRetweet] = useAddRetweetMutation();
  // const [addLike]=useAddLikeMutation();
  // const [removeLike]=useRemoveLikeMutation()

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(true);
  };

  const handleOpenQuoteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setIsOpen({ id: 'modalQuote', isOpen: true, postData: postData }));
  };

  const handleOpenCommentModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setIsOpen({ id: 'modalComment', isOpen: true, postData: postData }));
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleLike = async (postId: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      let decodedUserId: number = 0;
      if (user?.userId) {
        decodedUserId = user.userId;
      }
      const data = {
        postId: postId,
        userId: decodedUserId,
      };

      if (userLikedPosts) {
        await dispatch(removeLike(data));
        socketRemoveNotification({ username: user?.username, postData, action: 'liked' });
      } else {
        socketSendNotification({ username: user?.username, postData, action: 'liked' });
        await dispatch(likePost(data));
      }

      console.log('liked');
    } catch (err) {
      console.log(err);
    }
  };
  const handlePostRetweet = async (postId: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      let decodedUserId: number = 0;
      if (user?.userId) {
        decodedUserId = user.userId;
      }
      const retweetData = {
        userId: decodedUserId,
        rtwId: postId,
      };

      if (!isRetweeted) {
        await dispatch(retweetPost(retweetData)).then(() => {
          setIsDropdownOpen(false);
          socketSendNotification({ username: user?.username, postData, action: 'retweeted' });
        });
        await dispatch(getPosts() as any);
        // } else {
        //   const findedpost = postData.retweets?.find(
        //     (retweet: any) => retweet.user.id === user?.userId && !retweet.post.content,
        //   );
        //   if (findedpost) {
        //     await deleteRetweet(findedpost.id).then(() => {
        //       setIsDropdownOpen(false);
        //     });
        //   }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-4 px-12 pb-2">
      <div
        className="flex items-center text-gray-500 cursor-pointer hover:text-twitterColor"
        onClick={handleOpenCommentModal}
      >
        <FaRegComment />
        <span className="ml-1">{postData.comments?.length}</span>
      </div>
      <div className="relative cursor-pointer" onClick={handleRetweet} ref={dropdownRef}>
        <div className="flex items-center text-gray-500 hover:text-green-500">
          {!isRetweeted ? (
            <AiOutlineRetweet className="text-xl" />
          ) : (
            <AiOutlineRetweet className="text-2xl text-green-500" />
          )}
          <span className={`ml-1 ${!isRetweeted ? 'text-black' : 'text-green-500'}`}>{postData.retweets?.length}</span>
        </div>
        {isDropdownOpen && (
          <ul className="absolute bg-white top-0 right-0 p-4 rounded-xl border border-gray-300 w-max">
            <li
              className="flex items-center gap-2 text-gray-700 hover:text-green-500 mb-2"
              onClick={(e) => handlePostRetweet(postData.id, e)}
            >
              <AiOutlineRetweet className="text-lg" />
              <span>{/* {!isRetweeted ? 'Repost' : 'Undo Repost'} */}Repost</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 hover:text-green-500" onClick={handleOpenQuoteModal}>
              <CiEdit className="text-lg" />
              <span>Quote</span>
            </li>
          </ul>
        )}
      </div>
      {userLikedPosts ? (
        <div className="flex items-center  cursor-pointer text-[#f91880]" onClick={(e) => handleLike(postData.id, e)}>
          <FaHeart />
          <span className="ml-1">{postData.likes.length}</span>
        </div>
      ) : (
        <div
          className="flex items-center text-gray-500 cursor-pointer hover:text-[#f91880]"
          onClick={(e) => handleLike(postData.id, e)}
        >
          <FaRegHeart />
          <span className="ml-1">{postData.likes?.length}</span>
        </div>
      )}

      <div className="flex items-center text-gray-500 cursor-pointer">
        <BsFillShareFill />
      </div>
    </div>
  );
};
export default TweetActions;
