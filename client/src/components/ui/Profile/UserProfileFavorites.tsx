import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import SinglePost from '../Posts/SinglePost';
import TweetActions from '../Posts/TweetActions';
import { useEffect } from 'react';
import { getPosts } from '../../../store/features/post/postSlice';

const UserProfileFavorites: React.FC<{ username: string | undefined }> = ({ username }) => {
  const posts = useSelector((state: RootState) => state.post.post);
  const favData = posts.filter((post) => post.likes?.some((like) => like.user.username === username));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  console.log(favData)
  return (
    !!favData.length ?
    favData.map((singleFav) => {
      const isRetweet = posts.filter((post) => post.retweets?.find((retweet: any) => retweet.post.id === singleFav.id));
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
    }):<div className='flex justify-center items-center mt-8'>No Liked Posts</div>
  );
};
export default UserProfileFavorites;
