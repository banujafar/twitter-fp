import React, { useState, ChangeEvent, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { CiImageOn } from 'react-icons/ci';
import { FaRegSmile } from 'react-icons/fa';
import { HiOutlineGif } from 'react-icons/hi2';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, getPosts } from '../../../store/features/post/postSlice';
import { AppDispatch, RootState } from '../../../store';
// import { jwtDecode } from 'jwt-decode';
// import { IDecodedToken } from '../../models/auth';
import { setIsOpen } from '../../../store/features/modal/modalSlice';

const CreatePost: React.FC<{ content?: any }> = ({ content }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const quoteModalContent = useSelector((state: RootState) => state.modal.postData['modalQuote']);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.length && !selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('content', text);

    // if (decodedId !== null && !isNaN(decodedId)) {
    //   formData.append('user_id', decodedId.toString());
    // }
    if (userData?.userId) {
      formData.append('user_id', userData.userId.toString());
    }

    if (selectedFile) {
      selectedFile.forEach((file) => {
        formData.append('files', file);
      });
    }
    if (quoteModalContent) {
      formData.append('retweeted_id', quoteModalContent.id.toString());
    }

    try {
      if (quoteModalContent && userData?.userId && text) {
        // const { id } = quoteModalContent;
        // const userId = userData?.userId;
        await dispatch(addPost(formData));
      } else {
        await dispatch(addPost(formData) as any);
      }
      setText('');
      setSelectedFile(null);
      await dispatch(getPosts() as any);
      dispatch(setIsOpen({ id: 'modalQuote', isOpen: false }));
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
      setSelectedFile((prevFiles) => (prevFiles ? [...prevFiles, ...files] : files));
    }
  };

  const handleRemoveImage = (index?: number) => {
    if (index !== undefined && selectedFile !== null) {
      const updatedFiles = [...selectedFile];
      updatedFiles.splice(index, 1);
      setSelectedFile(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      setSelectedFile(null);
    }

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
    <div className={`${content ? 'bg-black' : 'bg-white'} border-b border-gray-200 w-full p-4`}>
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
            <div className={content ? 'border-none' : 'border-b border-b-[#eff3f4]'}>
              <textarea
                value={text}
                onChange={handleChange}
                style={{ minHeight: '3rem' }}
                maxLength={280}
                placeholder={content ? 'Add a comment' : 'What is happening?!'}
                className={`text-black resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparent ${
                  content ? 'text-white' : 'text-black'
                }`}
              />
              {selectedFile &&
                (Array.isArray(selectedFile) ? (
                  selectedFile.map((file, index) => (
                    <div key={index} className="w-full relative">
                      <img src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} className="max-w-full" />
                      <span
                        className="absolute top-0 right-0 cursor-pointer text-4xl p-2 bg-gray-700 text-white rounded-full"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <MdClose />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full relative">
                    <img src={URL.createObjectURL(selectedFile)} alt="" className="max-w-full" />
                    <span
                      className="absolute top-0 right-0 cursor-pointer text-4xl p-2 bg-gray-700 text-white rounded-full"
                      onClick={() => handleRemoveImage()}
                    >
                      <MdClose />
                    </span>
                  </div>
                ))}
            </div>
            {content && <div>{content}</div>}
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
                    multiple
                    name="fileInput"
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