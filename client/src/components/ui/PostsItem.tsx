import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { IUserPost } from '../../models/post';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import { formattedDate } from '../../utils/FormatDate';

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleRetweet = () => {
    setIsDropdownOpen(true);
  };

  const handleOpenQuoteModal = () => {
    dispatch(setIsOpen({ id: 'modalQuote', isOpen: true, postData: postData }));
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="tweet-container bg-white  border-b  border-gray-200  w-full p-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-auto">
            <Link to={`/profile/${postData.user?.username}`} className="flex">
              {postData.user?.profilePhoto ? (
                <img
                  src={postData.user?.profilePhoto}
                  alt={`${postData.user?.username}'s profile`}
                  className="w-16 h-16 rounded-full mb-4 sm:mb-0"
                />
              ) : (
                <CgProfile size={44} className="text-gray-500" />
              )}
            </Link>
          </div>
          <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/profile/${postData.user?.username}`} className="font-bold text-lg hover:underline">
                  {postData.user?.username}
                </Link>
                <p className="text-gray-500 overflow-hidden max-w-maxW16">{postData.user?.username}</p>
                <span className="text-gray-500">{formattedDate(postData.created_date)}</span>
              </div>

              <p className="text-gray-800">{postData.content}</p>
              {Array.isArray(postData.img)
                ? postData.img.map((imgUrl) => (
                    <img
                      key={postData.id}
                      src={`/src/assets/uploads/${imgUrl}`}
                      alt="post img"
                      className="mt-4 w-full max-w-full"
                    />
                  ))
                : postData.img && (
                    <img
                      src={`/src/assets/uploads/${postData.img}`}
                      alt="post img"
                      className="mt-4 w-full max-w-full"
                    />
                  )}
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center  text-gray-500 cursor-pointer hover:text-twitterColor">
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
                    <li
                      className="flex items-center gap-2 text-gray-700 hover:text-green-500"
                      onClick={handleOpenQuoteModal}
                    >
                      <CiEdit className="text-lg" />
                      <span>Quote</span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="flex items-center text-gray-500 cursor-pointer hover:text-[#f91880]">
                <FaRegHeart />
                <span className="ml-1">36</span>
              </div>
              <div className="flex items-center text-gray-500 cursor-pointer">
                <BsFillShareFill />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsItem;
