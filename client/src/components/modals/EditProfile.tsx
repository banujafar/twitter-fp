import { ChangeEvent, useState, useRef } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import Modal from './Modal';

const EditProfile = () => {
  const [activeModal, setActiveModal] = useState('photo');
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [location, setLocation] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeLocation = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocation(e.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files) {
      setSelectedFile(Array.from(fileInput.files));
    }
  };

  const handleContinue = () => {
    switch (activeModal) {
      case 'photo':
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
  const handleSubmit = () => {
    

  };
  return (
    <Modal
      modal={{
        modalId: 'modalEditProfile',
        modalContent: (
          <div className="flex justify-center items-center flex-col gap-3">
            {activeModal === 'photo' && (
              <>
                <h1 className=" text-white">Pick a profile picture</h1>
                <div className="relative">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile[0])}
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
                    ref={fileInputRef}
                    name="fileInput"
                    onChange={handleFileChange}
                  />
                  {!selectedFile && (
                    <div className="absolute top-20 z-10 cursor-pointer left-16 w-12 h-12 bg-black rounded-full flex justify-center items-center group-hover:bg-slate-800">
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
                  className={`text-black resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparen`}
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
                  className={`text-black resize-none h-12 w-full overflow-y-hidden py-1 focus:outline-none text-xl font-normal placeholder-[#536471]  bg-transparen`}
                />
                {/* <button className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium" >
              Continue
            </button> */}
              </>
            )}
            <button
              className="bg-twitterColor hover:bg-opacity-80 text-white rounded-3xl px-5 py-2 transition duration-300 font-medium flex justify-center items-center w-full"
              onClick={activeModal === 'location' ? handleSubmit : handleContinue}
            >
              {activeModal === 'location' ? 'Save Changes' : 'Continue'}
            </button>
          </div>
        ),
      }}
    />
  );
};
export default EditProfile;
