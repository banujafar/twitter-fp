import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchNotifications, readNotifications } from '../store/features/notifications/notificationSlice';
import { IoPerson } from 'react-icons/io5';
import { UserAvatar } from '../components/ui/Posts/SinglePost';
const Notifications = () => {
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { users } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = user?.userId;
  const [showSenderInfo, setShowSenderInfo] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchNotifications(userId));
  console.log(notifications);
  }, []);

  useEffect(() => {
    dispatch(readNotifications(userId));
  }, [dispatch]);
  const handleHover = (notificationId: number) => {
    setShowSenderInfo(notificationId);
  };
  console.log(showSenderInfo);
  return (
    <div className="w-[80%] border-r border-gray-200 min-h-screen ">
      <h1 className="p-4 text-xl text-twitterColor">Notifications</h1>
      <ul>
        {notifications?.map((notification: any, index: number) => {
          const senderUser = users.find((user) => user.username === notification.senderName);
          console.log(notification);
          return (
            <li key={index} className="border-b p-4 border-gray-200">
              <IoPerson className=" text-twitterColor" />
              <Link
                to={`/profile/${notification?.senderName}`}
                className=" font-semibold"
                onMouseEnter={() => handleHover(notification.id)}
              >
                {notification.senderName}
              </Link>
              {` ${notification.type}`}

              {notification.type === 'followed' ? <span> you</span>:
              notification.type === 'created' ? (
                <Link to={`/post/${senderUser?.id}/${notification.postId}`}>post</Link>
              ):
              <Link
                to={`/post/${notification.type === 'retweeted' ? senderUser?.id : user?.userId}/${notification.postId}`}
              >
                {' '}
                your post
              </Link>}

              {showSenderInfo === notification.id && (
                <div className="sender-info border border-gray-200 rounded-xl w-1/2 p-4">
                  {senderUser && <UserAvatar user={senderUser} size={12} />}
                  <h1>@{senderUser?.username}</h1>
                  <span className=" font-semibold">{senderUser?.following?.length} </span>{' '}
                  <span className="text-sm text-gray-500">Following </span>
                  <span className=" font-semibold">{senderUser?.followers?.length} </span>{' '}
                  <span className="text-sm text-gray-500">Followers </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Notifications;
