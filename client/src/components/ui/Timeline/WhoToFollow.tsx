import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store';
import { IUser } from '../../../models/user';
import { followUser, getUsers } from '../../../store/features/user/userSlice';

const WhoToFollow = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.user.users);
  const suggestedUsers = users
    .filter(
      (u) => u.id !== user?.userId && !u.followers?.find((follower) => follower.id === user?.userId) && u.isVerified,
    )
    .slice(0, 3);

  const handleFollow = async (target: IUser) => {
    const userId = user?.userId;
    const targetUser = target;

    await dispatch(followUser({ userId, targetUser }) as any);
    await dispatch(getUsers() as any);
  };

  return (
    <div className="w-full px-4 py-4 mt-14 rounded-2xl h-auto bg-[#f7f9f9]">
      <h1 className="text-black text-xl font-semibold">Who to follow</h1>
      <div className="flex mt-4">
        <div className="w-full max-w-xl">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="py-2 flex items-center">
                  <div className="w-10">
                    <Link to={`/profile/${u?.username}`} className="flex">
                      {u?.profilePhoto ? (
                        <img
                          src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701517376/${u.profilePhoto}`}
                          alt={`${u.username}'s profile`}
                          className={`w-10 h-10 rounded-full mb-4 sm:mb-0 object-cover`}
                        />
                      ) : (
                        <CgProfile className="text-gray-500 w-10 h-10" />
                      )}
                    </Link>
                  </div>
                  <div className="ml-2 mr-2">
                    <h1 className="text-base font-medium">{u?.username}</h1>
                    <Link to={`/profile/${u?.username}`} className="font-semibold text-sm text-[#536471]">
                      &#64;{u?.username}
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="capitalize cursor-pointer font-medium py-1 px-2 border border-black bg-black text-white rounded-2xl"
                    onClick={() => handleFollow(u)}
                  >
                    follow
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>You are following all the users! 🙃</p>
          )}
        </div>
      
      </div>
      <Link to='/suggestions' className='text-twitterColor font-medium text-base mt-2 inline-block'>
          Show more
        </Link>
    </div>
  );
};

export default WhoToFollow;
