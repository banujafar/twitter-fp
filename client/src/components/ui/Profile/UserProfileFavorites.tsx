import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import SinglePost from '../Posts/SinglePost';
import TweetActions from '../Posts/TweetActions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPosts } from '../../../store/features/post/postSlice';
import SearchBar from '../Timeline/SearchBar';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';

const UserProfileFavorites: React.FC<{ username: string | undefined }> = ({ username }) => {
  const posts = useSelector((state: RootState) => state.post.post);
  const favData = posts.filter((post) => post.likes?.some((like) => like.user.username === username));
  const isOpenQuote = useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment = useSelector((state) => modalIsOpenSelector(state, 'modalComment'));

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <div className="flex items-start gap-2">
      <div className={`p-4 ${currentPath === '/favorites' ? 'w-[80%]' : 'w-full'}`}>
        {!!favData.length ? (
          favData.map((singleFav) => {
            const isRetweet = posts.filter(
              (post) => post.retweets?.find((retweet: any) => retweet.post.id === singleFav.id),
            );
            console.log(isRetweet);
            return isRetweet && !!isRetweet.length ? (
              <>
                <SinglePost postData={singleFav} size={44} />
                <div className="px-8 border rounded-xl">
                  <SinglePost postData={isRetweet[0]} size={30} />
                </div>
                <TweetActions postData={singleFav} />
              </>
            ) : (
              <>
                <SinglePost postData={singleFav} size={44} />
                <TweetActions postData={singleFav} />
              </>
            );
          })
        ) : (
          <div className="flex justify-center items-center">No Liked Posts</div>
        )}

        {isOpenQuote && <QuoteModal />}
        {isOpenComment && <CommentModal />}
      </div>
      {currentPath === '/favorites' && (
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar searchedList={favData} />
        </div>
      )}
    </div>
  );
};
export default UserProfileFavorites;
