import { useDispatch, useSelector } from 'react-redux';
import PostsList from '../components/ui/Posts/PostsList';
import SearchBar from '../components/ui/Timeline/SearchBar';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '../store';
import { useEffect } from 'react';
import {
  addNotification,
  fetchNotifications,
  removeNotification,
} from '../store/features/notifications/notificationSlice';
const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const socket = io('https://twitter-server-73xd.onrender.com');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.emit('newUser', {
      username: user?.username,
    });
  }, []);
  useEffect(() => {
    socket?.on('getNotification', (data) => {
      console.log(data);
      dispatch(addNotification(data));
    });

    socket?.on('getFilteredNotification', (data) => {
      dispatch(removeNotification(data));
    });
  }, [socket]);

  useEffect(() => {
    const userId = user?.userId;
    dispatch(fetchNotifications(userId));
  }, []);

  return (
    <>
      <PostsList />
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar searchedList={[]} />
        </div>
      </div>
    </>
  );
};
export default Home;
