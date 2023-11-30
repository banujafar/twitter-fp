import {  useSelector } from 'react-redux';
import { RootState } from '../../../store';
import PostsItem from './PostsItem';
import { IUserPost } from '../../../models/post';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';
import { useGetPostsQuery } from '../../../store/features/post/postsApi';
import CreatePost from './CreatePost';

const PostsList = () => {
  // const dispatch = useDispatch();

  const { data } = useGetPostsQuery();
  const loading = useSelector((state: RootState) => state.post.loading);
  let sortedPosts: IUserPost[];
  const isOpenQuote = useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment = useSelector((state) => modalIsOpenSelector(state, 'modalComment'));
  if (data) {
    sortedPosts = [...data].sort((a, b) => {
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

  return (
    <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full">
      <CreatePost />
      {loading ? (
        <p>Loading posts...</p>
      ) : data && data.length > 0 ? (
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
