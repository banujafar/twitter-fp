import { useDispatch, useSelector } from 'react-redux';
import PostsList from '../components/ui/Posts/PostsList';
import SearchBar from '../components/ui/Timeline/SearchBar';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '../store';
import { useEffect, useState } from 'react';
import { addNotification, removeNotification } from '../store/features/notifications/notificationSlice';
import { filterRetweet, getPost, getPosts } from '../store/features/post/postSlice';
import { IUserPost } from '../models/post';
import WhoToFollow from '../components/ui/Timeline/WhoToFollow';
import { getUsers } from '../store/features/user/userSlice';
const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const socket = io('https://twitter-server-73xd.onrender.com');
  const dispatch = useDispatch<AppDispatch>();
  const [lastPosts, setLastPosts] = useState<IUserPost[]>([]);
  const { post } = useSelector((state: RootState) => state.post);
  const posts = useSelector((state: RootState) => state.post.post);
  const users = useSelector((state: RootState) => state.user.users);

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
      dispatch(getPost(data));
    });
    socket?.on('getRetweetedPosts', (data) => {
      dispatch(getPost(data));
    });
    socket?.on('removeRetweetedPosts', (data) => {
      dispatch(filterRetweet(data));
    });
    socket?.on('getUsers', () => {
      dispatch(getUsers());
    });
    socket?.on('getPosts', () => {
      dispatch(getPosts());
    });
  }, [socket]);
console.log(posts)
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
          <SearchBar searchedList={posts} searchedUsers={users} />
        </div>
        <WhoToFollow />
      </div>
    </>
  );
};

export default Home;
