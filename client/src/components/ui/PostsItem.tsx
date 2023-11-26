import React from 'react';
import { RootState } from '../../store';
import { IUserPost } from '../../models/post';
import SinglePost from './SinglePost';
import { useSelector } from 'react-redux';
import TweetActions from './TweetActions';

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  const posts = useSelector((state: RootState) => state.post.post) as IUserPost[];
  const isRetweet = posts.some((post) => post.retweets?.some((retweet: any) => retweet.post.id === postData.id));

  return (
    !isRetweet && (
      <div className="tweet-container bg-white  w-full px-4">
        <>
          <SinglePost postData={postData} size={44} />
          <TweetActions postData={postData} />
        </>
        {!!postData.retweets?.length && (
          <>
            {postData.retweets?.map((retweet: any) => {
              const retweetedPost = posts.find((post) => post.id === retweet.post.id);
              return (
                retweetedPost && (
                  <div key={retweetedPost?.id}>
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
      </div>
    )
  );
};

export default PostsItem;
