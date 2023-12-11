import { useParams } from 'react-router-dom';
import SearchBar from '../components/ui/Timeline/SearchBar';
import UserProfileHeader from '../components/ui/Profile/UserProfileHeader';
const UserProfile = () => {
  const { username } = useParams();
  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full min-h-screen">
        <UserProfileHeader username={username} />
      </div>
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar searchedList={[]} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
