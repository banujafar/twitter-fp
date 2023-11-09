import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Verification = () => {
  const email = useSelector((state: RootState) => state.auth.user?.email);

  return (
    <>
      <div className="bg-black text-white h-screen flex items-center w-2/5 lg:w-2/5 md:full sm:w-full xs:w-full">
        <div className="container mx-auto ">
          <div className="py-3 px-5">
            <h1 className="text-white text-3xl font-semibold">Final Step...</h1>
            <h3 className="text-lg mt-7 text-gray-300">Confirm your email address to complete your Twitter account.</h3>
            <h3 className="text-lg text-gray-300">
              We've sent a verification link to
              <span className="font-bold underline underline-offset-2 ml-1">{email}</span> (if you can't find it, check
              your Spam).
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;
