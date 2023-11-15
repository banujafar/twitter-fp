import PostsList from '../components/ui/PostsList';
import SearchBar from '../components/ui/SearchBar';
const Home = () => {
  return (
    <>
      <PostsList />
      <div className='flex flex-col mx-4 w-[50%] '>
        <div className='sm:hidden xl:flex '>
        <SearchBar />
        </div>
      </div>
    </>
  );
};
export default Home;
