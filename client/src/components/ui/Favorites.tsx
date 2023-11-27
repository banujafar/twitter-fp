import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import SinglePost from './SinglePost';
import TweetActions from './TweetActions';
import { useEffect } from 'react';
import { getPosts } from '../../store/features/post/postSlice';

const Favorites: React.FC<{ userId: string | undefined }> = ({ userId }) => {
  const posts = useSelector((state: RootState) => state.post.post);
  const favData = posts.filter((post) => post.likes?.some((like) => like.user.username === userId));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getAllPosts = async () => {
      await dispatch(getPosts());
    };
    getAllPosts();
  }, [dispatch]);

  return (
    !!favData.length &&
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
    })
  );
};
export default Favorites;
