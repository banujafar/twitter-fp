
import CreatePost from '../ui/Posts/CreatePost';
import Modal from './Modal';

const PostModal = () => {
 
  return (
    <Modal
      modal={{
        modalId: 'postModal',
        modalContent: (
          <>
            <CreatePost />
          </>
        ),
      }}
    />
  );
};

export default PostModal;
