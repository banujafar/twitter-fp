import React, { useState, ChangeEvent } from 'react';
import { CgProfile } from 'react-icons/cg';
import { CiImageOn } from 'react-icons/ci';
import { FaRegSmile } from 'react-icons/fa';
import { HiOutlineGif } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { addPost } from '../../store/features/post/postSlice';

interface IUSER {
  profile_image?: string;
  username: string;
}

const CreatePost: React.FC<{ userData: IUSER }> = ({ userData }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!text.length) {
      return
    }
    dispatch(addPost({content: text}) as any);
  };


  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="bg-white border-b border-gray-200 w-full p-4">
      <div className="flex flex-col sm:flex-row items-start gap-4 ">
        <div className="w-auto flex">
          {userData.profile_image ? (
            <img
              src={userData.profile_image}
              alt={`${userData.username}'s profile`}
              className="w-16 h-16 rounded-full mb-4 sm:mb-0"
            />
          ) : (
            <CgProfile size={44} className="text-gray-500" />
          )}
        </div>
        <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
          <form className="flex-grow" onSubmit={handleSubmit}>
            <div className="border-b border-b-[#eff3f4]">
              <textarea
                value={text}
                onChange={handleChange}
                style={{ minHeight: '3rem' }}
                maxLength={280}
                placeholder="What is happening?!"
                className="resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471] text-black"
              />
            </div>
            <div className="flex items-center gap-4 justify-between mt-5">
              <div className="flex items-center">
                <label
                  htmlFor="imageInput"
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <CiImageOn className="text-blue-500 text-xl" />
                  <input type="file" id="imageInput" accept=".png, .jpg, .jpeg, .gif" className="hidden" />
                </label>
                <label
                  htmlFor="emojiInput"
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <FaRegSmile className="text-blue-500 text-xl" />
                  <input type="file" id="emojiInput" accept=".png, .jpg, .jpeg, .gif" className="hidden" />
                </label>
                <label
                  htmlFor="gifInput"
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <HiOutlineGif className="text-blue-500 text-xl" />
                  <input type="file" id="gifInput" accept=".png, .jpg, .jpeg, .gif" className="hidden" />
                </label>
              </div>
              <button
                type="submit"
                className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
