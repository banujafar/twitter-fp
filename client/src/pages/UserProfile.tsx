import { useParams } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import UserProfileHeader from '../components/ui/UserProfileHeader';

const UserProfile = () => {
  const { userid } = useParams();
  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full">
        <UserProfileHeader userid={userid} />
      </div>
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
