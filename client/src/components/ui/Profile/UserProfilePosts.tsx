import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect } from 'react';
import { getPosts } from '../../../store/features/post/postSlice';
import SinglePost from '../Posts/SinglePost';
import TweetActions from '../Posts/TweetActions';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';
import { IUserPost } from '../../../models/post';

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

  let sortedPosts: IUserPost[];

  if (posts) {
    sortedPosts = [...currentUsersPosts].sort((a, b) => {
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
    <>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        sortedPosts.map((postData) => {
          const isRetweet = posts.filter(
            (singlePost) => singlePost.retweets?.find((retweet: any) => retweet.post.id === postData.id),
          );
          return isRetweet && !!isRetweet.length ? (
            <>
              <div className="cursor-pointer border-b border-gray-200 transition ease-in hover:bg-[#f7f7f7]">
                <SinglePost postData={postData} size={64} />
                <div className="px-8 border rounded-xl mx-8">
                  <SinglePost postData={isRetweet[0]} size={64} />
                </div>
                <TweetActions postData={postData} />
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-gray-200 cursor-pointer transition ease-in hover:bg-[#f7f7f7]">
                <SinglePost postData={postData} size={64} />
                <TweetActions postData={postData} />
              </div>
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
