import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect } from 'react';
import { getPosts } from '../../../store/features/post/postSlice';
import SinglePost from '../Posts/SinglePost';
import TweetActions from '../Posts/TweetActions';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';

const UserProfilePosts = ({ username }: { username: string | undefined }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.post);
  const loading = useSelector((state: RootState) => state.post.loading);
  const currentUsersPosts = posts.filter((post) => post.user.username == username);

  const isOpenQuote = useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment = useSelector((state) => modalIsOpenSelector(state, 'modalComment'));
  useEffect(() => {
    dispatch(getPosts() as any);
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        currentUsersPosts.map((postData) => {
          const isRetweet = posts.filter(
            (singlePost) => singlePost.retweets?.find((retweet: any) => retweet.post.id === postData.id),
          );
          return isRetweet && !!isRetweet.length ? (
            <>
              <SinglePost postData={postData} size={44} />
              <div className="px-8 border rounded-xl">
                <SinglePost postData={isRetweet[0]} size={30} />
              </div>
              <TweetActions postData={postData} />
            </>
          ) : (
            <>
              <SinglePost postData={postData} size={44} />
              <TweetActions postData={postData} />
            </>
          );
        })
      ) : (
        <p>No posts found</p>
      )}

      {isOpenQuote && <QuoteModal />}
      {isOpenComment && <CommentModal />}
    </>
  );
};

export default UserProfilePosts;
