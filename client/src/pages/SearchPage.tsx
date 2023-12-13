import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/ui/Timeline/SearchBar';
import { AppDispatch, RootState } from '../store';
import { useEffect } from 'react';
import { getPosts } from '../store/features/post/postSlice';

const SearchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.post.post);
  const users=useSelector((state:RootState)=>state.user.users)
  useEffect(() => {
    dispatch(getPosts());
  }, []);
  return (
    <div className="flex flex-col w-full">
      <SearchBar searchedList={posts} searchedUsers={users}/>
    </div>
  );
};

export default SearchPage;
