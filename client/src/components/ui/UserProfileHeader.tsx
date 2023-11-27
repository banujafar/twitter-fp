import { IoMdArrowBack } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Favorites from './Favorites';

const UserProfileHeader = ({ userid }: { userid: string | undefined }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isCurrentUser = user?.userId == userid;

  const [activeBtn, setActiveBtn] = useState<string>('posts');
  const handleButtonClick = (buttonType: string) => {
    setActiveBtn(buttonType);
  };

  // All properties will change based on user data.

  return (
    <>
      <div className="border-b border-gray-200 w-full p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
          <button type="button" className="flex items-center justify-center">
            <Link to="/" className="flex text-2xl">
              <IoMdArrowBack />
            </Link>
          </button>
          <h1 className="text-2xl font-semibold">username</h1>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full h-52 bg-[#cfd9de]"></div>
        <div className="px-4 -mt-[4.5rem]">
          <div className="flex justify-between items-center">
            <div className="mb-3 min-w-48 w-36 h-36">
              <img src="../src/assets/images/aside.png" className="rounded-full w-full h-full object-cover" alt="" />
            </div>
            {isCurrentUser ? (
              <div className="pt-10">
                <button
                  type="button"
                  className="cursor-pointer font-medium py-1 px-3 border border-[#cfd9de] bg-white text-black rounded-2xl"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
          <div>
            <h1 className="text-black text-2xl font-bold">username</h1>
            <span className="text-[#536471] text-base mt-1">&#64;username</span>
            <div className="flex items-center text-[#536471] mt-4 text-base">
              <IoLocationOutline />
              <span className="ml-2">Location</span>
            </div>
            <div className="flex items-center mt-4">
              <Link to="/following" className="text-base hover:underline">
                70
                <span className="text-[#536471] ml-1">Following</span>
              </Link>
              <Link to="/followers" className="text-base ml-4 hover:underline">
                280
                <span className="text-[#536471] ml-1">Followers</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-start border-b border-[#eff3f4] mt-4">
          <nav className="w-full">
            <button
              type="button"
              className={`cursor-pointer capitalize py-3 px-6 bg-white text-black hover:bg-navHoverColor ${
                activeBtn === 'posts' ? 'font-semibold' : 'font-normal'
              }`}
              onClick={() => handleButtonClick('posts')}
            >
              posts
            </button>
            <button
              type="button"
              className={`cursor-pointer capitalize py-3 px-6 bg-white text-black hover:bg-navHoverColor ${
                activeBtn === 'likes' ? 'font-semibold' : 'font-normal'
              }`}
              onClick={() => handleButtonClick('likes')}
            >
              likes
            </button>
          </nav>
        </div>
        {activeBtn === 'likes' && <Favorites userId={userid} />}
      </div>
    </>
  );
};

export default UserProfileHeader;
