import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { CiImageOn } from 'react-icons/ci';
import { FaRegSmile } from 'react-icons/fa';
import { HiOutlineGif } from 'react-icons/hi2';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../store/features/post/postSlice';
import { RootState } from '../../store';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '../../models/auth';

const CreatePost = ()=> {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [decodedId, setDecodedId] = useState<number | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const userData = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    const getUsernameFromToken = (authToken: string) => {
      try {
        const decoded: IDecodedToken = jwtDecode(authToken);
        const id = decoded.userId;
        setDecodedId(id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    if (token) {
      getUsernameFromToken(token);
    }
  }, [token]);

  const dispatch = useDispatch();

  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.length) {
      return;
    }

    await dispatch(addPost({ content: text, user_id: decodedId }) as any);
    setText('')
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {userData?.profilePhoto ? (
            <img
              src={userData.profilePhoto}
              alt={`${userData.username}'s profile`}
              className="w-16 h-16 rounded-full mb-4 sm:mb-0"
            />
          ) : (
            <CgProfile size={44} className="text-gray-500" />
          )}
        </div>
        <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
          <form className="flex-grow" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="border-b border-b-[#eff3f4]">
              <textarea
                value={text}
                onChange={handleChange}
                style={{ minHeight: '3rem' }}
                maxLength={280}
                placeholder="What is happening?!"
                className="resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471] text-black"
              />
              {selectedFile ? (
                <div className="w-full relative">
                  <img src={URL.createObjectURL(selectedFile)} alt="" className="max-w-full" />
                  <span
                    className="absolute top-0 right-0 cursor-pointer text-4xl p-2 bg-gray-700 text-white rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <MdClose />
                  </span>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="flex items-center gap-4 justify-between mt-5">
              <div className="flex items-center">
                <label
                  htmlFor="imageInput"
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <CiImageOn className="text-blue-500 text-xl" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="imageInput"
                    accept=".png, .jpg, .jpeg, .gif"
                    className="hidden"
                    ref={fileInputRef}
                    name="imageInput"
                  />
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
