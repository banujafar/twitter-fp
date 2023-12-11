import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchNotifications, readNotifications } from '../store/features/notifications/notificationSlice';

const Notifications = () => {
  const { notifications } = useSelector((state: RootState) => state.notifications);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = user?.userId;

  useEffect(() => {
    dispatch(fetchNotifications(userId));
  }, []);
  
  useEffect(() => {
    dispatch(readNotifications(userId));
  }, [dispatch]);
  console.log(notifications);

  return (
    <div className="w-[80%]">
      <h1>Notifications</h1>
      <ul>
        {notifications?.map((notification: any, index: number) => (
          <li key={index}>
            {`${notification.senderName} ${notification.type}`} your{' '}
            <Link to={`/post/${user?.userId}/${notification.postId}`}>post</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Notifications;
