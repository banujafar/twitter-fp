import { useDispatch, useSelector } from 'react-redux';
import PostsList from '../components/ui/Posts/PostsList';
import SearchBar from '../components/ui/Timeline/SearchBar';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '../store';
import { useEffect, useState } from 'react';
import {
  addNotification,
  fetchNotifications,
  removeNotification,
} from '../store/features/notifications/notificationSlice';
import { addPost, retweetPost } from '../store/features/post/postSlice';
import { IUserPost } from '../models/post';

import WhoToFollow from '../components/ui/Timeline/WhoToFollow';
const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const socket = io('http://localhost:3000');
  const dispatch = useDispatch<AppDispatch>();
  const [lastPosts, setLastPosts] = useState<IUserPost[]>([]);
  const { post } = useSelector((state: RootState) => state.post);
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
    socket?.on('getRealTimePosts', (data) => {
      const { content, user_id, files, retweeted_id } = data;
      const formData = new FormData();
      formData.append('content', content);

      if (user?.userId) {
        formData.append('user_id', user_id.toString());
      }

      if (!!files?.length) {
        files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      if (retweeted_id) {
        formData.append('retweeted_id', retweeted_id.toString());
      }
      dispatch(addPost(formData));
    });
    socket?.on('getRetweetedPosts', (data) => {
      dispatch(retweetPost(data));
    });
  }, [socket]);

  useEffect(() => {
    const userId = user?.userId;
    dispatch(fetchNotifications(userId));
  }, []);
  console.log(post);
  useEffect(() => {
    const currentDate = new Date();
    const filteredPosts = post.filter((singlePost) => {
      const postDate = new Date(singlePost.created_date);
      return (
        postDate.getFullYear() === currentDate.getFullYear() &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getDate() === currentDate.getDate() &&
        postDate.getHours() === currentDate.getHours() &&
        postDate.getMinutes() === currentDate.getMinutes()
      );
    });
    setLastPosts(filteredPosts);
  }, [post]);

  const handleScrollToTop = () => {
    setLastPosts([]); // Empty the lastPosts array
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!!lastPosts.length && (
        <div
          className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full px-2 py-1 cursor-pointer"
          onClick={handleScrollToTop}
        >
          {lastPosts.length} new posts
        </div>
      )}
      <PostsList />
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex sticky top-0 right-0">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar searchedList={[]} />
        </div>
          <WhoToFollow />
      </div>
    </>
  );
};

export default Home;
