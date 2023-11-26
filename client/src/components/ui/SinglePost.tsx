import { Link, useNavigate } from 'react-router-dom';
import { IUserPost } from '../../models/post';
import { CgProfile } from 'react-icons/cg';
import { IUser } from '../../models/user';
import { formattedDate } from '../../utils/FormatDate';

const UserAvatar: React.FC<{ user: IUser; size: number }> = ({ user, size }) => (
  <Link to={`/profile/${user?.username}`} className="flex">
    {user?.profilePhoto ? (
      <img
        src={user?.profilePhoto}
        alt={`${user?.username}'s profile`}
        className={`w-16 h-16 rounded-full mb-4 sm:mb-0`}
      />
    ) : (
      <CgProfile size={size} className="text-gray-500" />
    )}
  </Link>
);

const renderImages = (img: any, id: number) => {
  if (Array.isArray(img)) {
    return img.map((imgUrl) => (
      <img key={id} src={`/src/assets/uploads/${imgUrl}`} alt="post img" className="mt-4 w-full max-w-full" />
    ));
  } else if (img) {
    return <img src={`/src/assets/uploads/${img}`} alt="post img" className="mt-4 w-full max-w-full" />;
  }
  return null;
};

const SinglePost: React.FC<{ postData: IUserPost; size: number }> = ({ postData, size }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 flex-col py-2 " onClick={() => navigate(`/post/${postData.user.id}/${postData.id}`)}>
      <div className="w-11/12 xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 xs:w-full ">
        <div className="flex flex-col flex-grow mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-auto">
              <UserAvatar user={postData.user} size={size} />
            </div>
            <Link
              to={`/profile/${postData.user?.username}`}
              className="font-bold text-lg hover:underline text-gray-600"
            >
              {postData.user?.username}
            </Link>
            <p className="text-gray-500">{formattedDate(postData.created_date)}</p>
          </div>
          <p className="text-gray-800 ">{postData.content}</p>
          {renderImages(postData.img, postData.id)}
        </div>
      </div>
    </div>
  );
};
export default SinglePost;
