import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../../store';
import PostsItem from './PostsItem';
import { IUserPost } from '../../../models/post';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';
import CreatePost from './CreatePost';
import { getPosts } from '../../../store/features/post/postSlice';

const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  // const { data } = useGetPostsQuery();
  const loading = useSelector((state: RootState) => state.post.loading);
  const posts = useSelector((state: RootState) => state.post.post);
  const currentuser = useSelector((state: RootState) => state.auth.user);

  const users = useSelector((state: RootState) => state.user.users);
  const currentUserInfo = users.find((u)=>u.id === currentuser?.userId);
  const currentUserfollowings = currentUserInfo?.following;
  const filteredPosts = posts?.filter((post) =>
  currentUserfollowings?.map((follow) => follow.id).includes(post.user.id) || post.user.id === currentUserInfo?.id
);
  let sortedPosts: IUserPost[];

  const isOpenQuote = useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment = useSelector((state) => modalIsOpenSelector(state, 'modalComment'));
  if (posts) {
    sortedPosts = [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);

      if (dateA < dateB) {
        return 1;
      } else if (dateA > dateB) {
        return -1;
      }

      return dateB.getHours() - dateA.getHours();
    });
  } else {
    sortedPosts = [];
  }
  useEffect(() => {
    // Fetch initial posts
    dispatch(getPosts() as any);
  }, [dispatch]);

  return (
    <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full min-h-screen">
      <CreatePost />
      {loading ? (
        <p>Loading posts...</p>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        sortedPosts.map((post) => <PostsItem postData={post} key={post.id} />)
      ) : (
        <p className='mt-5 text-3xl text-center font-medium'>No Tweets Yet</p>
      )}
      {isOpenQuote && <QuoteModal />}
      {isOpenComment && <CommentModal />}
    </div>
  );
};
export default PostsList;
