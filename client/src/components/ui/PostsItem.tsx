import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import { formattedDate } from '../../utils/FormatDate';
import { IUserPost } from '../../models/post';
import { IUser } from '../../models/user';


const UserAvatar:React.FC<{user:IUser,size:number}> = ({ user,size }) => (
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

const renderImages = (img:any, id:number) => {
  if (Array.isArray(img)) {
    return img.map((imgUrl) => (
      <img key={id} src={`/src/assets/uploads/${imgUrl}`} alt="post img" className="mt-4 w-full max-w-full" />
    ));
  } else if (img) {
    return <img src={`/src/assets/uploads/${img}`} alt="post img" className="mt-4 w-full max-w-full" />;
  }
  return null;
};

const PostsItem:React.FC<{postData:IUserPost}> = ({ postData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const handleRetweet = () => {
    setIsDropdownOpen(true);
  };
console.log(postData)
  const handleOpenQuoteModal = () => {
    dispatch(setIsOpen({ id: 'modalQuote', isOpen: true, postData: postData }));
  };

  useEffect(() => {
    const handleOutsideClick = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="tweet-container bg-white border-b border-gray-200 w-full p-4">
      <div className="flex sm:flex-row items-start gap-4">
        <div className="w-auto">
          <UserAvatar user={postData.user} size={44} />
        </div>
        <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
          <div className="flex flex-col flex-grow mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/profile/${postData.user?.username}`} className="font-bold text-lg hover:underline">
                {postData.user?.username}
              </Link>
              <p className='text-gray-500'>{formattedDate(postData.created_date)}</p>
            </div>
            <p className="text-gray-800">{postData.content}</p>
            {renderImages(postData.img, postData.id)}
            
          </div>
          {postData.retweetFrom && !!postData.retweetFrom.length && (
            <div className='border-gray-200 border p-2 rounded-2xl'>
              <div className=" flex gap-2">
                <UserAvatar user={postData.retweetFrom[0].retweetedFromPost?.user} size={30} />
                <div className="flex items-center gap-2 mb-2">
                    <Link
                      to={`/profile/${postData.retweetFrom[0].retweetedFromPost?.user?.username}`}
                      className="font-bold text-lg hover:underline"
                    >
                      {postData.retweetFrom[0].user?.username}
                    </Link>
                    <p className='text-gray-500'>{formattedDate(postData.created_date)}</p>
                  </div>
              </div>
              <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
                <div className="flex flex-col flex-grow">
                  
                  <p className="text-gray-800">{postData.retweetFrom[0].retweetedFromPost?.content}</p>
                  {renderImages(
                    postData.retweetFrom[0].retweetedFromPost?.img,
                    postData.retweetFrom[0].retweetedFromPost?.id,
                  )}
                </div>
              </div>
            </div>
          )}
         

          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex items-center text-gray-500 cursor-pointer hover:text-twitterColor">
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
  );
};

export default PostsItem;
