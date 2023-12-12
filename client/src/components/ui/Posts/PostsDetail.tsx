import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
// import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import SinglePost, { UserAvatar } from './SinglePost';
import { IoMdArrowBack } from 'react-icons/io';
import { formattedDate } from '../../../utils/FormatDate';
import { IUserPost } from '../../../models/post';
import TweetActions from './TweetActions';
import { modalIsOpenSelector } from '../../../store/features/modal/modalSlice';
import QuoteModal from '../../modals/QuoteModal';
import CommentModal from '../../modals/CommentModal';
import { useEffect } from 'react';
import { getPosts } from '../../../store/features/post/postSlice';

const PostsDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userid, postid } = useParams<{ userid?: string | undefined; postid?: string | undefined }>();
  //const { data } = useGetPostsQuery();
  const posts = useSelector((state: RootState) => state.post.post);
  const userId = parseInt(userid ?? '0', 10);
  const postId = parseInt(postid ?? '0', 10);
  const selectedData = posts?.filter((post: IUserPost) => post.user.id === userId && post.id === postId);

  const isOpenQuote = useSelector((state) => modalIsOpenSelector(state, 'modalQuote'));
  const isOpenComment = useSelector((state) => modalIsOpenSelector(state, 'modalComment'));

  useEffect(() => {
    dispatch(getPosts() as any);
  }, [dispatch]);
  return (
    <>
      <div className="border-b border-gray-200 w-full p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
          <button type="button" className="flex items-center justify-center text-2xl" onClick={() => navigate(-1)}>
            <IoMdArrowBack />
          </button>
          <h1 className="text-2xl font-semibold">Post</h1>
        </div>
      </div>

      {selectedData &&
        selectedData.length > 0 &&
        selectedData?.map((data) => {
          return (
            <>
              {data.retweeted ? (
                <>
                  <div className="border-b border-gray-200">
                    <SinglePost postData={data} size={64} />
                    <div className="px-8 border rounded-xl mx-8">
                      <SinglePost postData={data.retweeted} size={64} />
                    </div>
                    <TweetActions postData={data} />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-gray-200">
                    <SinglePost postData={data} size={64} />
                    <TweetActions postData={data} />
                  </div>
                </>
              )}
              {data.comments.length > 0 &&
                data?.comments?.map((comment, index) => (
                  <div
                    key={index}
                    className="p-4 cursor-pointer bg-white border-b border-gray-200 w-full transition ease-in hover:bg-[#f7f7f7]"
                  >
                    <div className="flex gap-2">
                      <div className="w-auto">
                        <UserAvatar user={comment.user} size={64} />
                      </div>
                      <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full">
                        <div className="flex flex-col flex-grow mb-2 px-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              to={`/profile/${comment.user?.username}`}
                              className="font-bold text-lg hover:underline text-gray-600"
                            >
                              {comment.user?.username}
                            </Link>
                            <p className="text-gray-500">{formattedDate(comment.created_time)}</p>
                          </div>
                          <p className="text-gray-800 text-lg">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {isOpenQuote && <QuoteModal />}
              {isOpenComment && <CommentModal />}
            </>
          );
        })}
    </>
  );
};

export default PostsDetail;
