import PostsList from '../components/ui/PostsList';
import SearchBar from '../components/ui/SearchBar';
const Home = () => {
  return (
    <>
      <PostsList />
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar />
        </div>
        
      </div>
    </>
  );
};
export default Home;
