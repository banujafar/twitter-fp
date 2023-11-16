import React from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import { FaComment, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';

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
    <div className="tweet-container bg-white p-4 border border-gray-200 rounded-md shadow-md w-full">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {profile_image ? (
          <img
            src={profile_image}
            alt={`${username}'s profile`}
            className="w-16 h-16 rounded-full mb-4 sm:mb-0"
          />
        ) : (
          <CgProfile size={64} className="text-gray-500" />
        )}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-bold text-lg">{fullname}</h2>
            <p className="text-gray-500 overflow-hidden max-w-maxW16">{username}</p>
            <span className="text-gray-500">{created_time}</span>
          </div>

          <p className="text-gray-800">{post}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-gray-500">
          <FaComment />
          <span>12</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <AiOutlineRetweet />
          <span>24</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FaRegHeart />
          <span>36</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <BsFillShareFill />
        </div>
      </div>
    </div>
  );
};

export default PostsItem;
