import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsFillShareFill } from 'react-icons/bs';
import SinglePost, { UserAvatar } from './SinglePost';
import { IoMdArrowBack } from 'react-icons/io';
import { formattedDate } from '../../../utils/FormatDate';
import { IUserPost } from '../../../models/post';
import { useGetPostsQuery } from '../../../store/features/post/postsApi';

const PostsDetail = () => {
  const { userid, postid } = useParams<{ userid?: string | undefined; postid?: string | undefined }>();
  const { data } = useGetPostsQuery();
  // const posts = useSelector((state: RootState) => state.post.post);
  const userId = parseInt(userid ?? '0', 10);
  const postId = parseInt(postid ?? '0', 10);

  // const selectedData = posts.filter((post: IUserPost) => post.user.id === userId && post.id === postId);
  const selectedData = data?.filter((post: IUserPost) => post.user.id === userId && post.id === postId);

  const user = useSelector((state: RootState) => state.auth.user);
  const isRetweeted = selectedData?.map((d)=>d.retweets?.some((rt)=>rt.user.id === user?.userId))[0]
  const isLiked = selectedData?.map((d)=>d.likes?.some((lk)=>lk.user.id === user?.userId))[0]
  
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

      {selectedData &&
        selectedData.length > 0 &&
        selectedData?.map((data) => (
          <>
            <div
              key={data.id}
              className="tweet-container cursor-pointer bg-white border-b border-gray-200 w-full p-4 transition ease-in hover:bg-[#f7f7f7]"
            >
              <SinglePost postData={data} size={44} />
              <div className="flex items-center justify-between gap-4 mt-4 px-12">
                <div className="flex items-center text-gray-500 cursor-pointer hover:text-twitterColor">
                  <FaRegComment />
                  <span className="ml-1">{data.comments?.length}</span>
                </div>
                <div className="relative cursor-pointer">
                  <div className="flex items-center text-gray-500 hover:text-green-500">
                    {isRetweeted ? (
                      <AiOutlineRetweet className="text-2xl text-green-500" />
                      ) : (
                      <AiOutlineRetweet className="text-xl" />
                    )}
                    <span className={`ml-1 ${isRetweeted ? 'text-green-500' : 'text-black'}`}>
                      {data.retweets?.length}
                    </span>
                  </div>
                </div>

                {isLiked ? (
                  <div
                    className="flex items-center  cursor-pointer text-[#f91880]"
                  >
                    <FaHeart />
                    <span className="ml-1">{data.likes.length}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500 cursor-pointer hover:text-[#f91880]">
                    <FaRegHeart />
                    <span className="ml-1">{data.likes?.length}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-500 cursor-pointer">
                  <BsFillShareFill />
                </div>
              </div>
            </div>
            {data.comments.length > 0 &&
              data?.comments?.map((comment, index) => (
                <div
                  key={index}
                  className="p-4 cursor-pointer bg-white border-b border-gray-200 w-full transition ease-in hover:bg-[#f7f7f7]"
                >
                  <div className="flex gap-2">
                    <div className="w-auto">
                      <UserAvatar user={data.user} size={44} />
                    </div>
                    <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
                      <div className="flex flex-col flex-grow mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            to={`/profile/${data.user?.username}`}
                            className="font-bold text-lg hover:underline text-gray-600"
                          >
                            {data.user?.username}
                          </Link>
                          <p className="text-gray-500">{formattedDate(comment.created_time)}</p>
                        </div>
                        <p className="text-gray-800">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        ))}
    </>
  );
};

export default PostsDetail;
