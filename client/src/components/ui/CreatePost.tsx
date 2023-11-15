import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { CiImageOn } from 'react-icons/ci';
import { FaRegSmile } from 'react-icons/fa';
import { HiOutlineGif } from 'react-icons/hi2';

interface IUSER {
  profile_image?: string;
  username: string;
}

const CreatePost: React.FC<{ userData: IUSER }> = ({ userData }) => {
  return (
    <div className="tweet-container bg-white p-4 border border-gray-200 rounded-md shadow-md w-full">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {userData.profile_image ? (
          <img
            src={userData.profile_image}
            alt={`${userData.username}'s profile`}
            className="w-16 h-16 rounded-full mb-4 sm:mb-0"
          />
        ) : (
          <CgProfile size={64} className="text-gray-500" />
        )}
        <form className="flex-grow">
          <textarea
            placeholder="What's happening?"
            className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-4 justify-between">
            <div className='flex items-center gap-4'>
              <CiImageOn className="text-blue-500 cursor-pointer" />
              <FaRegSmile className="text-blue-500 cursor-pointer" />
              <HiOutlineGif className="text-blue-500 cursor-pointer" />
            </div>
            <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2 hover:bg-blue-600 transition duration-300">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
