import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl p-2 bg-gray-100 m-2 w-full">
      <CiSearch className="text-gray-500" />
      <input
        type="text"
        placeholder="Search"
        className="flex-grow ml-2 bg-transparent focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
