import React from 'react';
import { IUserPost } from '../../../models/post';
import SinglePost from './SinglePost';
import TweetActions from './TweetActions';
//import { useGetPostsQuery } from '../../../store/features/post/postsApi';

const PostsItem: React.FC<{ postData: IUserPost }> = ({ postData }) => {
  //const { data } = useGetPostsQuery();
  return (
    <>
      {!postData.retweeted && (
        <div className="tweet-container bg-white border-b border-gray-200 w-full cursor-pointer transition ease-in hover:bg-[#f7f7f7]">
          <SinglePost postData={postData} size={64} />
          <TweetActions postData={postData} />
        </div>
      )}
      {postData.retweeted && (
        <div
          className="tweet-container bg-white  w-full border-b border-gray-200 cursor-pointer transition ease-in hover:bg-[#f7f7f7]"
          key={postData.retweeted?.id}
        >
          <SinglePost postData={postData} size={64} />
          <div className="px-8 border rounded-xl border-b border-gray-200 mx-8">
            <SinglePost postData={postData.retweeted} size={64} />
          </div>
          <TweetActions postData={postData} />
        </div>
      )}
    </>
  );
};

export default PostsItem;
