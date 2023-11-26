import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import PostsItem from './PostsItem';
import CreatePost from './CreatePost';
import { useEffect } from 'react';
import { getPosts } from '../../store/features/post/postSlice';
import { IUserPost } from '../../models/post';
import { modalIsOpenSelector } from '../../store/features/modal/modalSlice';
import QuoteModal from '../modals/QuoteModal';
import CommentModal from '../modals/CommentModal';

const PostsList = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.post.post) as IUserPost[];
  const loading = useSelector((state: RootState) => state.post.loading);

  const isOpenQuote= useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment= useSelector((state) => modalIsOpenSelector(state, 'modalComment'));

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_date);
    const dateB = new Date(b.created_date);

    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    }

    return dateB.getHours() - dateA.getHours();
  });

  useEffect(() => {
    dispatch(getPosts() as any);
    
  }, [dispatch]);
  console.log(sortedPosts)
  return (
    <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full">
      <CreatePost />
      {loading ? (
        <p>Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        sortedPosts.map((post) => <PostsItem postData={post} key={post.id} />)
      ) : (
        <p>No posts found</p>
      )}
      {isOpenQuote && <QuoteModal />}
      {isOpenComment && <CommentModal />}
    </div>
  );
};
export default PostsList;
