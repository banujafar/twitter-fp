import { BsTwitter, BsPeopleFill, BsPeople } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  BiEnvelope,
  BiSolidEnvelope,
  BiSolidUser,
  BiUser,
} from "react-icons/bi";
import userImage from "../../../assets/images/user.jpg";
import { useState } from "react";

const Header = () => {
  const [notifications, setNotifications] = useState(true);
  const [logoutPopover, setLogoutPopover] = useState(false);

  const iconStyle = {
    width: "1.75rem",
    height: "1.75rem",
  };

  const navLinks = [
    {
      to: "/",
      label: "Home",
      icon: GoHome,
      activeIcon: GoHomeFill,
      notifications: () => notifications,
    },
    {
      to: "/explore",
      label: "Explore",
      icon: IoSearchOutline,
      activeIcon: IoSearch,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: IoMdNotificationsOutline,
      activeIcon: IoMdNotifications,
    },
    {
      to: "/messages",
      label: "Messages",
      icon: BiEnvelope,
      activeIcon: BiSolidEnvelope,
    },
    {
      to: "/favorites",
      label: "Favorites",
      icon: AiOutlineHeart,
      activeIcon: AiFillHeart,
    },
    {
      to: "/communities",
      label: "Communities",
      icon: BsPeople,
      activeIcon: BsPeopleFill,
    },
    { to: "/profile", label: "Profile", icon: BiUser, activeIcon: BiSolidUser },
  ];

  const location = useLocation();

  return (
    <header
      className={`${
        logoutPopover
          ? "lg:overflow-y-auto md:overflow-hidden sm:overflow-hidden xs:overflow-hidden"
          : ""
      } min-w-[275px] lg:min-w-[275px] md:w-[88px] sm:min-w-[88px] xs:min-w-[88px] xxs:min-w-[0] h-screen max-w-full sticky top-0 left-0 overflow-y-auto bg-white`}
    >
      <div className="w-full px-2 flex items-start justify-start flex-col lg:items-start md:items-center sm:items-center xs:items-center lg:justify-start md:justify-center sm:justify-center xs:justify-center">
        <div className="py-2 px-3 flex items-start">
          <h1 className="text-3xl text-twitterColor">
            <Link to="/">
              <BsTwitter />
            </Link>
          </h1>
        </div>
        <div className="w-full flex items-center justify-start lg:items-center lg:justify-start md:items-center md:justify-center sm:items-center sm:justify-center xs:items-center xs:justify-center">
          <nav className="relative flex items-start flex-col">
            {navLinks.map((link) => (
              <Link
                to={link.to}
                key={link.to}
                className="hover:bg-navHoverColor transition ease-in rounded-full"
              >
                <div className="flex p-3 w-full items-center">
                  <div className="relative">
                    {location.pathname === link.to ? (
                      <link.activeIcon style={iconStyle} />
                    ) : (
                      <link.icon style={iconStyle} />
                    )}
                    {link.notifications ? (
                      <div className="rounded-full absolute top-[-4px] right-[1px] w-2 h-2 bg-cyan-500"></div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={`mr-4 ml-5 text-xl lg:flex md:hidden sm:hidden xs:hidden  ${
                      location.pathname === link.to ? "font-bold" : ""
                    }`}
                  >
                    {link.label}
                  </div>
                </div>
              </Link>
            ))}
            {logoutPopover ? (
              <div className="lg:-bottom-14 md:fixed md:bottom-16 sm:fixed sm:bottom-16 xs:fixed xs:bottom-16 lg:absolute rounded-md -bottom-14 bg-white shadow-logout absolute flex justify-center items-center min-w-[225px]">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 w-full font-bold text-base"
                >
                  <Link
                    to="/logout"
                    className="w-full py-1 hover:bg-navHoverColor"
                  >
                    Log out @username
                  </Link>
                </button>
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>
        <div className="mt-1 mb-1">
          <button className="flex items-center justify-center shadow w-[211px] lg:w-[211px] md:w-[44px] sm:w-[44px] xs:w-[44px] md:h-[44px] sm:h-[44px] xs:h-[44px] lg:min-h-[52px] md:min-h-[44px] sm:min-h-[44px] xs:min-h-[44px] md:min-w-[44px] sm:min-w-[44px] xs:min-w-[44px] lg:rounded-3xl md:rounded-full sm:rounded-full xs:rounded-full md:p-0 sm:p-0 xs:p-0 min-w-[52px] min-h-[52px] text-base cursor-pointer bg-twitterColor hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-3xl">
            Post
          </button>
        </div>
        <div className="mt-3 mb-3">
          <div
            onClick={() => setLogoutPopover(!logoutPopover)}
            className="p-2 lg:p-2 md:p-0 sm:p-0 xs:p-0 xxs:p-0 hover:bg-navHoverColor transition ease-in cursor-pointer rounded-full"
          >
            <div className="flex items-center">
              <div className="w-11 h-11">
                <img src={userImage} alt="profile" />
              </div>
              <div className="ml-2 mr-8 lg:flex flex-col md:hidden sm:hidden xs:hidden xxs:hidden">
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
