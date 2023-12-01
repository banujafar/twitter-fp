import React from 'react';
import { IUserPost } from '../../../models/post';
import SinglePost from './SinglePost';
import TweetActions from './TweetActions';
import { useGetPostsQuery } from '../../../store/features/post/postsApi';

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  // const posts = useSelector((state: RootState) => state.post.post) as IUserPost[];
  // const isRetweet = posts.some((post) => post.retweets?.some((retweet: any) => retweet.post.id === postData.id));
   const { data } = useGetPostsQuery();
  const isRetweet = data?.some((post) => post.retweets?.some((retweet: any) => retweet.post.id === postData.id));
  return (
    <>
      {!isRetweet && (
        <div className="tweet-container bg-white  w-full px-4">
          <SinglePost postData={postData} size={44} />
          <TweetActions postData={postData} />
        </div>
      )}
      {!!postData.retweets?.length && (
        <>
          {postData.retweets?.map((retweet: any) => {
            const retweetedPost = data?.find((post) => post.id === retweet.post.id);
            return (
              retweetedPost && (
                <div className="tweet-container bg-white  w-full px-4" key={retweetedPost?.id}>
                  <SinglePost postData={retweetedPost} size={44} />
                  <div className="px-8 border rounded-xl">
                    <SinglePost postData={postData} size={30} />
                  </div>
                  <TweetActions postData={retweetedPost} />
                </div>
              )
            );
          })}
        </>
      )}
    </>
  );
};

export default PostsItem;
