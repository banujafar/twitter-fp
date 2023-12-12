import React, { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { UserAvatar } from '../Posts/SinglePost';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const SearchBar: React.FC<{ searchedList: any }> = ({ searchedList }) => {
  const [text, setText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    const debounceFilter = debounce((inputText: string) => {
      if (!inputText.length) {
        setFilteredPosts([]);
      } else {
        setFilteredPosts(
          searchedList?.filter(
            (searchedItem: any) =>
              searchedItem.user?.username?.includes(inputText) || searchedItem.content?.includes(inputText),
          ),
        );
      }
    }, 300);

    debounceFilter(text);
    return () => debounceFilter.cancel();

  }, [text, searchedList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-3xl p-2 bg-gray-100 m-2 w-full relative">
      <CiSearch className="text-gray-500" />
      <input
        type="text"
        value={text}
        placeholder="Search"
        className="flex-grow ml-2 bg-transparent focus:outline-none"
        onChange={handleChange}
      />
      {!!filteredPosts.length && (
        <div className="absolute top-14 left-0 w-full border rounded-xl py-4 px-2 z-50 bg-white h-96 overflow-y-auto">
          {filteredPosts?.map((post: any) => (
            <div key={post.id} className="my-4 px-2  border-gray-300">
              {post.content?.includes(text) ? (
                <Link to={`/post/${post.user?.id}/${post.id}`} className="block text-gray-800">
                  {post.content}
                </Link>
              ) : (
                <Link to={`/post/${post.user?.id}/${post.id}`} className="flex items-center mt-2">
                  <UserAvatar user={post.user} size={30} />
                  <div className="flex flex-col ml-2">
                    <span className="font-bold text-blue-500">{post.user?.username}</span>
                    <span className="text-gray-600">@{post.user?.username}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
