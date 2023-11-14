import { BsTwitter } from 'react-icons/bs';

const TwitterLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-blue-500 text-white">
      <div className="rounded-full p-6 bg-white">
        <BsTwitter size={60} className="text-blue-500" />
      </div>
    </div>
  );
};

export default TwitterLoader;
