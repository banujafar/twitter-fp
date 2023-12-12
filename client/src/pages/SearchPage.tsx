import { useSelector } from "react-redux";
import SearchBar from "../components/ui/Timeline/SearchBar"
import { RootState } from "../store";

const SearchPage = () => {
  const posts = useSelector((state: RootState) => state.post.post);

  return (
    <div className="flex flex-col w-full">
        <SearchBar searchedList={posts}/>
    </div>
  )
}

export default SearchPage