import SearchBar from '../components/ui/Timeline/SearchBar';
import PostsDetail from '../components/ui/Posts/PostsDetail';

const Post = () => {
  return (
    <>
      <div className="mx-2 sm:mx-0 xs:mx-0 border border-gray-200 w-full">
        <PostsDetail />
      </div>
      <div className="flex flex-col mx-4 sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
        <div className="sm:hidden xs:hidden xxs:hidden md:hidden lg:flex xl:flex">
          <SearchBar searchedList={[]} />
        </div>
      </div>
    </>
  );
};
export default Post;
