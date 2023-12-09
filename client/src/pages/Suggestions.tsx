import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { useEffect } from 'react';
import { followUser, getUsers } from '../store/features/user/userSlice';
import { IUser } from '../models/user';

const Suggestions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.user.users);
  const suggestedUsers = users.filter((u)=>u.id !== user?.userId && !u.followers?.find(follower=>follower.id === user?.userId) && u.isVerified)

  useEffect(() => {
    dispatch(getUsers() as any);
  }, [dispatch]);

  const handleFollow = async (target: IUser) => {
    const userId = user?.userId;
    const targetUser = target;

    await dispatch(followUser({ userId, targetUser }) as any);
    await dispatch(getUsers() as any);
  };

  return (
    <div className="border border-gray-200 w-full px-4 overflow-y-auto">
      <div className="flex">
        <div className="w-full max-w-xl">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between border-b border-gray-200 ">
                <div className="py-2 flex items-center">
                  <div className="w-auto">
                    <Link to={`/profile/${u?.username}`} className="flex">
                      {u?.profilePhoto ? (
                        <img
                          src={`https://res.cloudinary.com/dclheeyce/image/upload/v1701517376/${u.profilePhoto}`}
                          alt={`${u.username}'s profile`}
                          className={`w-16 h-16 rounded-full mb-4 sm:mb-0 object-cover`}
                        />
                      ) : (
                        <CgProfile className="text-gray-500 w-16 h-16" />
                      )}
                    </Link>
                  </div>
                  <div className="ml-2">
                    <h1 className="text-lg font-medium">{u?.username}</h1>
                    <Link to={`/profile/${u?.username}`} className="font-semibold text-base text-[#536471]">
                      &#64;{u?.username}
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="capitalize cursor-pointer font-medium py-1 px-3 border border-black bg-black text-white rounded-2xl"
                  onClick={()=>handleFollow(u)}
                  >
                    follow
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>users not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
