import React from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

interface IPOSTS {
  fullname: string;
  profile_image?: string;
  username: string;
  created_time: string;
  post: string;
}

const PostsItem: React.FC<{ postData: IPOSTS }> = ({ postData }) => {
  const { profile_image, username, fullname, created_time, post } = postData;

  return (
    <div className="tweet-container bg-white  border-b  border-gray-200  w-full p-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-auto">
          <Link to={`/profile/${fullname}`} className='flex'>
          {profile_image ? (
            <img src={profile_image} alt={`${username}'s profile`} className="w-16 h-16 rounded-full mb-4 sm:mb-0" />
          ) : (
            <CgProfile size={44} className="text-gray-500" />
          )}
          </Link>
        </div>
        <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/profile/${fullname}`} className="font-bold text-lg hover:underline">
                {fullname}
              </Link>
              <p className="text-gray-500 overflow-hidden max-w-maxW16">{username}</p>
              <span className="text-gray-500">{created_time}</span>
            </div>

            <p className="text-gray-800">{post}</p>
          </div>
          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex items-center  text-gray-500 cursor-pointer hover:text-twitterColor">
              <FaRegComment />
              <span className="ml-1">12</span>
            </div>
            <div className="flex items-center text-gray-500 cursor-pointer hover:text-[#00ba7c]">
              <AiOutlineRetweet />
              <span className="ml-1">24</span>
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
