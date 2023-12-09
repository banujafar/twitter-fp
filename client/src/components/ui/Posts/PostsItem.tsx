import React from 'react';
import { RootState } from '../../../store';
import { IUserPost } from '../../../models/post';
import SinglePost from './SinglePost';
import { useSelector } from 'react-redux';
import TweetActions from './TweetActions';
//import { useGetPostsQuery } from '../../../store/features/post/postsApi';

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  const posts = useSelector((state: RootState) => state.post.post) as IUserPost[];
  const isRetweet = posts.some((post) => post.retweets?.some((retweet: any) => retweet.post.id === postData.id));
  //const { data } = useGetPostsQuery();
  //const isRetweet = data?.some((post) => post.retweets?.some((retweet: any) => retweet.post.id === postData.id));
  return (
    <>
      {!isRetweet && (
        <div className="tweet-container bg-white border-b border-gray-200 w-full cursor-pointer transition ease-in hover:bg-[#f7f7f7]">
          <SinglePost postData={postData} size={64} />
          <TweetActions postData={postData} />
        </div>
      )}
      {!!postData.retweets?.length && (
        <>
          {postData.retweets?.map((retweet: any) => {
            const retweetedPost = posts?.find((post) => post.id === retweet.post.id);
            return (
              retweetedPost && (
                <div className="tweet-container bg-white  w-full border-b border-gray-200 cursor-pointer transition ease-in hover:bg-[#f7f7f7]" key={retweetedPost?.id}>
                  <SinglePost postData={retweetedPost} size={64} />
                  <div className="px-8 border rounded-xl border-b border-gray-200 mx-8">
                    <SinglePost postData={postData} size={64} />
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
