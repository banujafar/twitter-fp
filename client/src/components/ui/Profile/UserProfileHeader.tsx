import { IoMdArrowBack } from 'react-icons/io';
import { IoLocationOutline, IoNotificationsOffOutline, IoNotificationsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  followUser,
  unfollowUser,
  getUsers,
  notifyUser,
  removeNotifiedUser,
} from '../../../store/features/user/userSlice';
import UserProfileFavorites from './UserProfileFavorites';
import UserProfilePosts from './UserProfilePosts';
import { setModal } from '../../../store/features/modal/followModalSlice';
import FollowListModal from '../../modals/FollowListModal';
import { modalIsOpenSelector, setIsOpen } from '../../../store/features/modal/modalSlice';
import EditProfile from '../../modals/EditProfile';
import { MdOutlineEmail } from 'react-icons/md';
import { createChat } from '../../../store/features/chat/chatSlice';
import { socketRemoveNotification, socketSendNotification } from '../../../utils/socketClient';

const UserProfileHeader = ({ username }: { username: string | undefined }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isCurrentUser = user?.username == username;
  const users = useSelector((state: RootState) => state.user.users);
  const userInfo = users.find((user) => user.username == username);
  const loading = useSelector((state: RootState) => state.user.loading);
  const [activeBtn, setActiveBtn] = useState<string>('posts');
  const isOpenEditProfile = useSelector((state) => modalIsOpenSelector(state, 'modalEditProfile'));
  const isFollowing = userInfo?.followers?.some((follower) => follower.id === user?.userId);
  const isModalOpen = useSelector((state: RootState) => state.followModal.isOpen);
  const isNotified =
    useSelector((state: RootState) => state.user.isNotified) ||
    users
      .find((u) => u.username == user?.username)
      ?.notifications?.some((notifiedUser) => notifiedUser.username === username);
  //     .find((u) => u.username == user?.username)
  //     ?.notifications?.some((notifiedUser) => notifiedUser.username === username);
  // console.log(isNotified,username)
  const handleButtonClick = (buttonType: string) => {
    setActiveBtn(buttonType);
  };
  useEffect(() => {
    dispatch(getUsers() as any);
  }, [dispatch]);

  const handleFollow = async () => {
    const userId = user?.userId;
    const targetUser = userInfo;
    console.log(targetUser);
    if (!isFollowing) {
      await dispatch(followUser({ userId, targetUser }) as any);
      socketSendNotification({
        username: user?.username,
        receiverName: userInfo?.username,
        postId: null,
        action: 'followed',
      });
    } else {
      await dispatch(unfollowUser({ userId, targetUser }) as any);
      await dispatch(getUsers() as any)
      socketRemoveNotification({
        username: user?.username,
        receiverName: userInfo?.username,
        postId: null,
        action: 'unfollowed',
      });
    }

    await dispatch(getUsers() as any);
  };

  const handleNotification = async () => {
    if (isNotified) {
      await dispatch(removeNotifiedUser({ userId: user?.userId, notifiedUser: userInfo }));
    } else {
      await dispatch(notifyUser({ userId: user?.userId, notifiedUser: userInfo }));
      console.log(isNotified);
    }
  };
  const handleOpenModal = (e: React.MouseEvent, listType: 'following' | 'followers') => {
    e.stopPropagation();
    dispatch(setModal({ isOpen: true, data: listType }));
  };

  const handleOpenEditModal = () => {
    dispatch(setIsOpen({ id: 'modalEditProfile', isOpen: true }));
  };

  const handleCreateChat = async () => {
    const firstId = user?.userId;
    const secondId = userInfo?.id;
    await dispatch(createChat({ firstId, secondId }) as any);
    navigate('/messages');
  };
  return (
    <>
      {loading ? (
        <p>Loading user...</p>
      ) : userInfo ? (
        <>
          <div className="border-b border-gray-200 w-full p-4 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <button type="button" className="items-center justify-center flex text-2xl" onClick={() => navigate(-1)}>
                <IoMdArrowBack />
              </button>
              <h1 className="text-2xl font-semibold">{userInfo?.username}</h1>
            </div>
          </div>
          <div className="flex flex-col">
            {userInfo?.headerPhoto ? (
              <img
                src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701720274/${userInfo.headerPhoto}`}
                className="w-full h-52 object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-52 bg-[#cfd9de]"></div>
            )}
            <div className="px-4 -mt-[4.5rem]">
              <div className="flex justify-between items-center">
                <div className="mb-3 min-w-48 w-36 h-36">
                  {userInfo?.profilePhoto ? (
                    <img
                      src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701720274/${userInfo.profilePhoto}`}
                      className="rounded-full w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="rounded-full min-w-48 w-36 h-36 border-2 border-gray-400">
                      <img
                        src="../src/assets/images/profile.png"
                        className="rounded-full w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div className="flex">
                  {isCurrentUser ? (
                    <div className="pt-10" onClick={handleOpenEditModal}>
                      <button
                        type="button"
                        className="cursor-pointer font-medium py-1 px-3 border border-[#cfd9de] bg-white text-black rounded-2xl"
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <>
                      {isFollowing ? (
                        <>
                          <div className="pt-10">
                            <button
                              type="button"
                              className="text-2xl cursor-pointer font-medium py-1 px-3 border border-[#cfd9de] bg-white text-black rounded-2xl"
                              onClick={handleNotification}
                            >
                              {isNotified ? <IoNotificationsOffOutline /> : <IoNotificationsOutline />}
                            </button>
                          </div>
                          <div className="pt-10">
                            <button
                              type="button"
                              className="text-2xl cursor-pointer font-medium py-1 px-3 border border-[#cfd9de] bg-white text-black rounded-2xl"
                              onClick={handleCreateChat}
                            >
                              <MdOutlineEmail />
                            </button>
                          </div>
                        </>
                      ) : (
                        ''
                      )}
                      <div className="pt-10">
                        <button
                          type="button"
                          className={`capitalize cursor-pointer font-medium py-1 px-3 border ${
                            isFollowing ? 'border-[#cfd9de] bg-white text-black' : 'border-black bg-black text-white'
                          }  rounded-2xl`}
                          onClick={handleFollow}
                        >
                          {isFollowing ? 'unfollow' : 'follow'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-black text-2xl font-bold">{userInfo?.username}</h1>
                <span className="text-[#536471] text-base mt-1">&#64;{userInfo?.username}</span>
                <div className="flex items-center text-[#536471] mt-4 text-base">
                  <IoLocationOutline />
                  <span className="ml-2">{userInfo?.country ? userInfo.country : 'Location'}</span>
                </div>
                {userInfo?.bio && (
                  <div className="flex items-center text-[#536471] mt-4 text-base">
                    <span className="ml-2">{userInfo.bio}</span>
                  </div>
                )}
                <div className="flex items-center mt-4">
                  <span
                    className="text-base hover:underline cursor-pointer"
                    onClick={(e) => handleOpenModal(e, 'following')}
                  >
                    {userInfo.following?.length}
                    <span className="text-[#536471] ml-1">Following</span>
                  </span>
                  <span
                    className="text-base ml-4 hover:underline cursor-pointer"
                    onClick={(e) => handleOpenModal(e, 'followers')}
                  >
                    {userInfo.followers?.length}
                    <span className="text-[#536471] ml-1">Followers</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start border-b border-gray-200 mt-4">
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
          </div>

          {activeBtn === 'likes' ? (
            <UserProfileFavorites username={username} />
          ) : (
            <UserProfilePosts username={username} />
          )}
          {isModalOpen && <FollowListModal username={username} />}
        </>
      ) : (
        <p>User not exists</p>
      )}
      {isOpenEditProfile && <EditProfile />}
    </>
  );
};

export default UserProfileHeader;
