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
  const users = useSelector((state: RootState) => state.user.users);
  const favData = posts?.filter((post) => post.likes?.some((like) => like.user.username === username));
  console.log(posts);
  const favusers = users.filter((u) => favData.some((data) => data.user.username === u.username));
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
      <div className={`${currentPath === '/favorites' ? 'w-[80%]' : 'w-full'}`}>
        {!!favData.length ? (
          favData.map((singleFav) => {
            const isRetweet = posts?.filter(
              (post) => post.retweets?.find((retweet: any) => retweet.post.id === singleFav.id),
            );
            console.log(isRetweet);
            return isRetweet && !!isRetweet.length ? (
              <div key={singleFav.id}>
                <div className="cursor-pointer border-b border-gray-200 transition ease-in hover:bg-[#f7f7f7]">
                  <SinglePost postData={singleFav} size={64} />
                  <div className="px-8 border rounded-xl mx-8">
                    <SinglePost postData={isRetweet[0]} size={64} />
                  </div>
                  <TweetActions postData={singleFav} />
                </div>
              </div>
            ) : (
              <div key={singleFav.id}>
                <div className="cursor-pointer border-b border-gray-200 transition ease-in hover:bg-[#f7f7f7]">
                  <SinglePost postData={singleFav} size={64} />
                  <TweetActions postData={singleFav} />
                </div>
              </div>
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
          <SearchBar searchedList={favData} searchedUsers={favusers} />
        </div>
      )}
    </div>
  );
};
export default UserProfileFavorites;
