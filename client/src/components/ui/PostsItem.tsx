import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import { formattedDate } from '../../utils/FormatDate';
import { IUserPost } from '../../models/post';
import { IUser } from '../../models/user';
import { likePost, removeLike } from '../../store/features/post/postSlice';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '../../models/auth';
import SinglePost from './SinglePost';

const UserAvatar: React.FC<{ user: IUser; size: number }> = ({ user, size }) => (
  <Link to={`/profile/${user?.username}`} className="flex">
    {user?.profilePhoto ? (
      <img
        src={user?.profilePhoto}
        alt={`${user?.username}'s profile`}
        className={`w-16 h-16 rounded-full mb-4 sm:mb-0`}
      />
    ) : (
      <CgProfile size={size} className="text-gray-500" />
    )}
  </Link>
);

const renderImages = (img: any, id: number) => {
  if (Array.isArray(img)) {
    return img.map((imgUrl) => (
      <img key={id} src={`/src/assets/uploads/${imgUrl}`} alt="post img" className="mt-4 w-full max-w-full" />
    ));
  } else if (img) {
    return <img src={`/src/assets/uploads/${img}`} alt="post img" className="mt-4 w-full max-w-full" />;
  }
  return null;
};

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  //const [decodedId, setDecodedId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const userLikedPosts = postData.likes?.some((like) => like?.user?.id === user?.userId);
  // useEffect(() => {
  //   const getUsernameFromToken = (authToken: string) => {
  //     try {
  //       const decoded: IDecodedToken = jwtDecode(authToken);
  //       const id = decoded.userId;
  //       setDecodedId(id);
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //     }
  //   };

  //   if (token) {
  //     getUsernameFromToken(token);
  //   }
  // }, [token]);

  const handleRetweet = () => {
    setIsDropdownOpen(true);
  };
  // console.log(postData);
  const handleOpenQuoteModal = () => {
    dispatch(setIsOpen({ id: 'modalQuote', isOpen: true, postData: postData }));
  };
  const handleOpenCommentModal = () => {
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
    e.preventDefault();

    try {
      let decodedUserId: number = 0;
      console.log(user)
      if (user?.userId) {
        decodedUserId = user.userId;
      }
      const data = {
        postId: postId,
        userId: decodedUserId,
      };

      if (userLikedPosts) {
        await dispatch(removeLike(data));
      } else {
        await dispatch(likePost(data));
      }

      console.log('liked');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="tweet-container bg-white border-b border-gray-200 w-full p-4">
      <SinglePost postData={postData} />
      <div className="flex items-center justify-between gap-4 mt-4 px-12">
        <div className="flex items-center text-gray-500 cursor-pointer hover:text-twitterColor"  onClick={handleOpenCommentModal}>
          <FaRegComment />
          <span className="ml-1">12</span>
        </div>
        <div className="relative cursor-pointer" onClick={handleRetweet} ref={dropdownRef}>
          <div className="flex items-center text-gray-500 hover:text-green-500">
            <AiOutlineRetweet className="text-xl" />
            <span className="ml-1">24</span>
          </div>
          {isDropdownOpen && (
            <ul className="absolute bg-white top-0 right-0 p-4 rounded-xl border border-gray-300">
              <li className="flex items-center gap-2 text-gray-700 hover:text-green-500 mb-2">
                <AiOutlineRetweet className="text-lg" />
                <span>Repost</span>
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
    </div>
  );
};

export default PostsItem;
