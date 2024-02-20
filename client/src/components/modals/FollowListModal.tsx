import { useDispatch, useSelector } from 'react-redux';
//import { setModal } from '../../store/features/modal/followModalSlice';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { setIsOpen } from '../../store/features/modal/modalSlice';

const FollowListModal = ({ username }: { username: string | undefined }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.user.users);
  const userInfo = users.find((user) => user.username == username);
  const listType = useSelector((state: RootState) => state.modal.postData)['followModal'];

  const handleCloseModal = () => {
    dispatch(setIsOpen({ isOpen: false, id: 'followModal' }));
  };
  // const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  //   if (e.target === e.currentTarget) {
  //     handleCloseModal();
  //   }
  // };

  return (
    <Modal
      modal={{
        modalId: 'followModal',
        modalContent: (
          <>
            <h1 className="font-bold">{listType === 'following' ? 'Following' : 'Followers'}</h1>

              <ul>
                {(listType === 'followers' ? userInfo?.followers : userInfo?.following)?.map((user) => (
                  <li key={user.id} className="my-2">
                    <Link to={`/profile/${user.username}`} onClick={handleCloseModal}>
                      {user.username}
                    </Link>
                  </li>
                ))}
              </ul>
          </>
        ),
      }}
    />
  );
};

export default FollowListModal;
