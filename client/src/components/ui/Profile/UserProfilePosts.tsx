import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import PostsItem from '../PostsItem';
import { useEffect } from 'react';
import { getPosts } from '../../../store/features/post/postSlice';

const UserProfilePosts = ({ username }: { username: string | undefined }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.post);
  const loading = useSelector((state: RootState) => state.post.loading);
  const currentUsersPosts = posts.filter((post) => post.user.username == username);

  useEffect(() => {
    dispatch(getPosts() as any);
  }, [dispatch]);


  return (
    <>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        currentUsersPosts.map((post) => <PostsItem postData={post} key={post.id} />)
      ) : (
        <p>No posts found</p>
      )}
    </>
  );
};

export default UserProfilePosts;