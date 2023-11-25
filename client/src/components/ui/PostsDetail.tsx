import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import SinglePost from './SinglePost';
import { IoMdArrowBack } from 'react-icons/io';

const PostsDetail = () => {
  const { userid, postid } = useParams<{ userid?: string | undefined; postid?: string | undefined }>();
  const posts = useSelector((state: RootState) => state.post.post);
  const userId = parseInt(userid ?? '0', 10);
  const postId = parseInt(postid ?? '0', 10);

  const selectedData = posts.filter((post) => post.user.id === userId && post.id === postId);

  return (
    <>
      <div className="border-b border-gray-200 w-full p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
          <button type="button" className="flex items-center justify-center">
            <Link to="/" className="flex text-2xl">
              <IoMdArrowBack />
            </Link>
          </button>
          <h1 className="text-2xl font-semibold">Post</h1>
        </div>
      </div>

      {selectedData.length > 0 &&
        selectedData.map((data) => (
          <div key={data.id} className="tweet-container cursor-pointer bg-white border-b border-gray-200 w-full p-4 transition ease-in hover:bg-[#f7f7f7]">
            <SinglePost postData={data} />
            <div className="flex items-center justify-between gap-4 mt-4 px-12">
              <div className="flex items-center text-gray-500 cursor-pointer hover:text-twitterColor">
                <FaRegComment />
                <span className="ml-1">{data.comments?.length}</span>
              </div>
              <div className="relative cursor-pointer">
                <div className="flex items-center text-gray-500 hover:text-green-500">
                  <AiOutlineRetweet className="text-xl" />
                  <span className="ml-1">{data.retweets?.length}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-500 cursor-pointer hover:text-[#f91880]">
                <FaRegHeart />
                <span className="ml-1">{data.likes?.length}</span>
              </div>

              <div className="flex items-center text-gray-500 cursor-pointer">
                <BsFillShareFill />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostsDetail;
