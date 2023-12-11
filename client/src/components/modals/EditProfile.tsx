import { ChangeEvent, useState } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import { editUser } from '../../store/features/user/userSlice';
const EditProfile = () => {
  const [activeModal, setActiveModal] = useState('photo');
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ profile?: File; header?: File }>({});
  const [location, setLocation] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();
  const handleChangeLocation = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocation(e.target.value);
  };

  const handleFileChange = (event: any, fileType: string) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    setSelectedFile((prevFiles) => ({
      ...prevFiles,
      [fileType]: file,
    }));
  };

  const handleContinue = (e: any) => {
    e.preventDefault();
    switch (activeModal) {
      case 'photo':
        setActiveModal('header');
        break;
      case 'header':
        setActiveModal('bio');
        break;
      case 'bio':
        setActiveModal('location');
        break;
      default:
        setActiveModal('photo');
    }
  };

  const handleChangeBio = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!bio.length && !selectedFile && !location.length) {
      return;
    }
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('location', location);

    if (selectedFile) {
      Object.keys(selectedFile).forEach((fileType) => {
        const file = selectedFile[fileType as keyof typeof selectedFile];
        if (file) {
          formData.append(`${fileType}`, file);
        }
      });
    }
    const userId = user?.userId;
    try {
      await dispatch(editUser({ formData, userId }));
      setBio('');
      setLocation('');
      setSelectedFile({});
      dispatch(setIsOpen({ id: 'modalEditProfile', isOpen: false }));
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };
  return (
    <Modal
      modal={{
        modalId: 'modalEditProfile',
        modalContent: (
          <form
            className="flex flex-col justify-center items-center gap-3"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            {activeModal === 'photo' && (
              <>
                <h1 className=" text-white">Pick a profile picture</h1>
                <div className="relative">
                  {selectedFile && selectedFile['profile'] ? (
                    <img
                      src={URL.createObjectURL(selectedFile['profile'])}
                      alt=""
                      className="w-64 h-64 bg-no-repeat rounded-circle"
                    />
                  ) : (
                    <CgProfile size={184} className="text-gray-500" />
                  )}
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .gif"
                    multiple={false}
                    className="absolute top-0 opacity-0  w-full h-full cursor-pointer z-20 group"
                    onChange={(e) => handleFileChange(e, 'profile')}
                  />
                  {!selectedFile['profile'] && (
                    <div className="absolute top-20 z-10 cursor-pointer left-16 w-12 h-12 bg-black rounded-full flex justify-center items-center group-hover:bg-slate-800">
                      <LuImagePlus className=" text-white " size={24} />
                    </div>
                  )}
                </div>
              </>
            )}
            {activeModal === 'header' && (
              <>
                <h1 className=" text-white">Pick a header picture</h1>
                <div className="relative">
                  {selectedFile && selectedFile['header'] ? (
                    <img src={URL.createObjectURL(selectedFile['header'])} alt="" className="w-52 h-52 bg-no-repeat" />
                  ) : (
                    <div className="bg-transparent w-52 h-52 border rounded-lg -z-10"></div>
                  )}
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .gif"
                    multiple={false}
                    className="absolute top-0 opacity-0  w-full h-full cursor-pointer z-20 group"
                    onChange={(e) => handleFileChange(e, 'header')}
                  />
                  {!selectedFile['header'] && (
                    <div className="absolute top-20 z-10 cursor-pointer left-20 w-12 h-12 bg-black rounded-full flex justify-center items-center group-hover:bg-slate-800">
                      <LuImagePlus className=" text-white " size={24} />
                    </div>
                  )}
                </div>
              </>
            )}
            {activeModal === 'bio' && (
              <>
                <h1 className=" text-white">Describe yourself</h1>
                <textarea
                  value={bio}
                  onChange={handleChangeBio}
                  style={{ minHeight: '3rem' }}
                  maxLength={160}
                  placeholder={'Your bio'}
                  className={`text-white resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparent`}
                />
              </>
            )}
            {activeModal === 'location' && (
              <>
                <h1 className=" text-white">Where do you live?</h1>
                <textarea
                  value={location}
                  onChange={handleChangeLocation}
                  style={{ minHeight: '3rem' }}
                  maxLength={30}
                  placeholder={'Location'}
                  className={`text-white resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparent`}
                />
              </>
            )}
            {activeModal === 'location' ? (
              <button
                className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium flex justify-center items-center w-full"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium flex justify-center items-center w-full"
                onClick={handleContinue}
              >
                Continue
              </button>
            )}
          </form>
        ),
      }}
    />
  );
};
export default EditProfile;
