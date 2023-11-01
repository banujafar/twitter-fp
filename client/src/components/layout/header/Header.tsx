import { BsTwitter, BsPeopleFill, BsPeople } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { RiFileList2Line, RiFileList2Fill } from "react-icons/ri";
import {
  BiEnvelope,
  BiSolidEnvelope,
  BiSolidUser,
  BiUser,
} from "react-icons/bi";
import userImage from "../../../assets/images/user.jpg";

const Header = () => {
  const location = useLocation();

  return (
    <header className="min-w-[275px] h-screen max-w-full sticky top-0 left-0 overflow-y-auto bg-white">
      <div className="w-full px-2">
        <div className="py-2 px-3 flex items-start">
          <h1 className="text-3xl text-twitterColor">
            <Link to="/">
              <BsTwitter />
            </Link>
          </h1>
        </div>
        <div className="w-full">
          <nav className="flex items-start flex-col">
            <Link
              to="/"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full items-center">
                <div className="relative">
                  {location.pathname === "/" ? (
                    <GoHomeFill
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <GoHome style={{ width: "1.75rem", height: "1.75rem" }} />
                  )}

                  <div className="rounded-full absolute top-[-4px] right-[1px] w-2 h-2 bg-cyan-500"></div>
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/" ? "font-bold" : ""
                  }`}
                >
                  Home
                </div>
              </div>
            </Link>
            <Link
              to="/explore"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/explore" ? (
                    <IoSearch style={{ width: "1.75rem", height: "1.75rem" }} />
                  ) : (
                    <IoSearchOutline
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/explore" ? "font-bold" : ""
                  }`}
                >
                  Explore
                </div>
              </div>
            </Link>
            <Link
              to="/notifications"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/notifications" ? (
                    <IoMdNotifications
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <IoMdNotificationsOutline
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/notifications" ? "font-bold" : ""
                  }`}
                >
                  Notifications
                </div>
              </div>
            </Link>
            <Link
              to="/messages"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/messages" ? (
                    <BiSolidEnvelope
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <BiEnvelope
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/messages" ? "font-bold" : ""
                  }`}
                >
                  Messages
                </div>
              </div>
            </Link>
            <Link
              to="/lists"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/lists" ? (
                    <RiFileList2Fill
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <RiFileList2Line
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/lists" ? "font-bold" : ""
                  }`}
                >
                  Lists
                </div>
              </div>
            </Link>
            <Link
              to="/communities"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/communities" ? (
                    <BsPeopleFill
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <BsPeople style={{ width: "1.75rem", height: "1.75rem" }} />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/communities" ? "font-bold" : ""
                  }`}
                >
                  Communities
                </div>
              </div>
            </Link>
            <Link
              to="/profile"
              className="hover:bg-navHoverColor transition ease-in rounded-full"
            >
              <div className="flex p-3 w-full">
                <div className="relative">
                  {location.pathname === "/profile" ? (
                    <BiSolidUser
                      style={{ width: "1.75rem", height: "1.75rem" }}
                    />
                  ) : (
                    <BiUser style={{ width: "1.75rem", height: "1.75rem" }} />
                  )}
                </div>
                <div
                  className={`mr-4 ml-5 text-xl ${
                    location.pathname === "/profile" ? "font-bold" : ""
                  }`}
                >
                  Profile
                </div>
              </div>
            </Link>
          </nav>
        </div>
        <div className="mt-1 mb-1">
          <button className="flex items-center justify-center shadow w-[211px] min-w-[52px] min-h-[52px] text-base cursor-pointer bg-twitterColor hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl">
            Post
          </button>
        </div>
        <div className="mt-3 mb-3">
          <div className="p-3 hover:bg-navHoverColor transition ease-in cursor-pointer rounded-full">
            <div className="flex items-center">
              <div className="w-11 h-11">
                <img src={userImage} alt="profile" />
              </div>
              <div className="ml-2">
                <h3 className="font-bold text-base">Username</h3>
                <span className="text-[#536471] text-base">&#64;username</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
