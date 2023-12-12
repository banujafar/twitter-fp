import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { CiImageOn } from 'react-icons/ci';
import { FaRegSmile } from 'react-icons/fa';
import { HiOutlineGif } from 'react-icons/hi2';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setIsOpen } from '../../../store/features/modal/modalSlice';
import { getUsers } from '../../../store/features/user/userSlice';
import { socketRealTimePosts, socketSendNotification } from '../../../utils/socketClient';
import { setPostModal } from '../../../store/features/modal/postModalSlice';
import { addPost } from '../../../store/features/post/postSlice';

const CreatePost: React.FC<{ content?: any; inModal?: boolean }> = ({ content, inModal }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const quoteModalContent = useSelector((state: RootState) => state.modal.postData['modalQuote']);
  const users = useSelector((state: RootState) => state.user.users);
  const userData = users.find((u) => u.id === user?.userId);
  const currentUserInfo = users.find((singleUser) => singleUser.username == user?.username);

  useEffect(() => {
    dispatch(getUsers() as any);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((!text || !text.trim().length) && !selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('content', text);

    if (user?.userId) {
      formData.append('user_id', user.userId.toString());
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
      const result = await dispatch(addPost(formData));

      if (result.payload) {
        const postId = quoteModalContent ? result.payload?.retweetedPost.id : result.payload?.id;
        console.log(result.payload);
        socketRealTimePosts(postId);
      }

      setText('');
      setSelectedFile(null);

      currentUserInfo?.notifications?.forEach((current) => {
        socketSendNotification({
          username: user?.username,
          receiverName: current.username,
          action: 'created',
        });
      });

      dispatch(setIsOpen({ id: 'modalQuote', isOpen: false }));
      dispatch(setPostModal({ isOpen: false }));
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
      setSelectedFile((prevFiles) => (prevFiles ? [...prevFiles, ...files] : files));
    }
    console.log(inModal);
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
  console.log(content);
  return (
    <div className={`bg-white border-b border-gray-200 w-full p-4`}>
      <div className="flex flex-col sm:flex-row items-start gap-4 ">
        <div className="w-auto flex">
          {userData?.profilePhoto ? (
            <img
              src={`https://res.cloudinary.com/dclheeyce/image/upload/${userData?.profilePhoto}`}
              alt={`${userData.username}'s profile`}
              className="w-16 h-14 rounded-full mb-4 sm:mb-0 object-cover"
            />
          ) : (
            <CgProfile size={64} className="text-gray-500" />
          )}
        </div>
        <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
          <form className="flex-grow" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={content ? 'border-none' : 'border-b border-b-[#eff3f4]'}>
              <textarea
                value={text}
                onChange={handleChange}
                style={{ minHeight: '2.5rem' }}
                maxLength={280}
                placeholder={content ? 'Add a comment' : 'What is happening?!'}
                className={`text-black resize-none h-12 w-[98%] overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471] bg-transparent`}
              />
              {selectedFile &&
                (Array.isArray(selectedFile) ? (
                  selectedFile.map((file, index) => (
                    <div key={index} className="w-full relative mb-4 ">
                      <img src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} className="max-w-full " />
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
                  htmlFor={content ? 'modalImageInput' : 'imageInput'}
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <CiImageOn className="text-blue-500 text-xl" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id={content ? 'modalImageInput' : 'imageInput'}
                    accept=".png, .jpg, .jpeg, .gif"
                    className="hidden"
                    ref={fileInputRef}
                    multiple
                    name="fileInput"
                  />
                </label>
                <label
                  htmlFor={content ? 'modalEmojiInput' : 'emojiInput'}
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <FaRegSmile className="text-blue-500 text-xl" />
                  <input type="file" id="emojiInput" accept=".png, .jpg, .jpeg, .gif" className="hidden" />
                </label>
                <label
                  htmlFor={content ? 'modalGifInput' : 'gifInput'}
                  className="rounded-full hover:bg-blue-100 p-2 flex items-center justify-center cursor-pointer"
                >
                  <HiOutlineGif className="text-blue-500 text-xl" />
                  <input
                    type="file"
                    id={content ? 'modalGifInput' : 'gifInput'}
                    accept=".png, .jpg, .jpeg, .gif"
                    className="hidden"
                  />
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
