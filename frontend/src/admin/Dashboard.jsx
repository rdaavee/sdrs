import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import user from "../assets/images/user-img.png";
import dashboard1 from "../assets/svgs/dashbord-icon-01.svg";
import dashboard2 from "../assets/svgs/dashbord-icon-02.svg";
import profile1 from "../assets/svgs/profile-icon-01.svg";
import profile2 from "../assets/svgs/profile-icon-02.svg";
import notification from "../assets/svgs/notification-icon.svg";
import notification1 from "../assets/svgs/notification-icon1.svg";
import notification2 from "../assets/svgs/notification-icon2.svg";
import notification3 from "../assets/svgs/notification-icon3.svg";
import email1 from "../assets/svgs/email-icon-01.svg";
import email2 from "../assets/svgs/email-icon-02.svg";
import note1 from "../assets/svgs/note-icon-01.svg";
import note2 from "../assets/svgs/note-icon-02.svg";
import pen1 from "../assets/svgs/pen-icon-01.svg";
import pen2 from "../assets/svgs/pen-icon-02.svg";
import save1 from "../assets/svgs/save-icon-01.svg";
import save2 from "../assets/svgs/save-icon-02.svg";
import setting1 from "../assets/svgs/setting-icon-01.svg";
import setting2 from "../assets/svgs/setting-icon-02.svg";
import menuOpen from "../assets/svgs/menu-open.png";
import menuClose from "../assets/svgs/menu-close.png";
import deleteIcon from "../assets/svgs/delete-icon-01.svg";
import logout from "../assets/svgs/logout-icon-01.svg";
import logoutDelete from "../assets/svgs/logout-delete.svg";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    const [activeItem, setActiveItem] = useState("Dashboard");
    const [isSidebarActive, setIsSidebarActive] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarActive(!isSidebarActive);
    };

    const closeSidebar = () => {
        setIsSidebarActive(false);
    };

    const navItems = [
        { name: "Add Admin", icon1: profile1, icon2: profile2 },
        { name: "Request List", icon1: note1, icon2: note2 },
        { name: "Saved Admins", icon1: save1, icon2: save2 },
        { name: "Account Settings", icon1: setting1, icon2: setting2 },
    ];

    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleDelete = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        setShowModal(false);
        console.log("user logged out");
    };

    return (
        <>
            <div className="dashboard-wrapper relative w-full flex items-start justify-between bg-[#f0f5f3] min-h-[100vh]">
                <div
                    className={`sidebar bg-white shadow-md pt-[30px] px-[20px] ${
                        isSidebarActive ? "active" : ""
                    }`}
                >
                    <img
                        src={menuClose}
                        alt="menu-close"
                        onClick={closeSidebar}
                        className="w-[30px] h-[30px] absolute right-0 top-0 m-5 cursor-pointer z-20 flex lg:hidden"
                    />
                    <div className="logo w-full text-center mb-5 pb-5">
                        <a href="#">
                            <h2 className="text-4xl font-[600] tracking-wide">
                                SDRS
                            </h2>
                        </a>
                    </div>

                    <div className="admin-info text-center mb-10">
                        <img
                            src={user}
                            alt="user-img"
                            className="w-[110px] h-[110px] mx-auto rounded-[50%]"
                        />
                        <div className="">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="user-name text-xl relative font-[500] py-3 w-full"
                            >
                                Super Admin
                                <ul
                                    className={`dropdown-menu absolute left-1/2 -translate-x-1/2 mt-2 w-[240px] bg-white rounded-md shadow-md p-5 space-y-3 transition-all duration-300 ease-in-out z-10 ${
                                        isOpen
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"
                                    }`}
                                >
                                    <li>
                                        <a
                                            href="#"
                                            className="flex group items-center w-full gap-2"
                                        >
                                            <img
                                                src={profile1}
                                                alt="profile-icon"
                                                className="w-[18px]"
                                            />
                                            <span className="text-lg group-hover:text-[#3c8968] transition-all duration-300">
                                                Profile
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className="flex group items-center w-full gap-2"
                                        >
                                            <img
                                                src={setting1}
                                                alt="profile-icon"
                                                className="w-[18px]"
                                            />
                                            <span className="text-lg group-hover:text-[#3c8968] transition-all duration-300">
                                                Account Settings
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className="flex group items-center w-full gap-2"
                                        >
                                            <img
                                                src={notification}
                                                alt="profile-icon"
                                                className="w-[18px]"
                                            />
                                            <span className="text-lg group-hover:text-[#3c8968] transition-all duration-300">
                                                Notification
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </button>
                        </div>
                    </div>

                    <ul className="dashboard-main-nav">
                        <li>
                            <Link
                                to="/"
                                onClick={() => setActiveItem("Dashboard")}
                                className={`flex items-center w-full gap-2 p-5 rounded-2xl ${
                                    activeItem === "Dashboard" ? "active" : ""
                                }`}
                            >
                                <img
                                    src={dashboard1}
                                    alt="dashboard-icon"
                                    className={`w-[18px] transition-opacity duration-300 ease-in-out ${
                                        activeItem === "Dashboard"
                                            ? "opacity-0 absolute"
                                            : "opacity-100 relative"
                                    }`}
                                />
                                <img
                                    src={dashboard2}
                                    alt="dashboard-icon"
                                    className={`w-[18px] transition-opacity duration-300 ease-in-out ${
                                        activeItem === "Dashboard"
                                            ? "opacity-100 relative"
                                            : "opacity-0 absolute"
                                    }`}
                                />
                                <span className="text-lg ps-2 font-[500]">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={`/pages/${item.name.replace(
                                        /\s/g,
                                        ""
                                    )}`}
                                    onClick={() => setActiveItem(item.name)}
                                    className={`flex items-center w-full gap-2 p-5 rounded-2xl ${
                                        activeItem === item.name ? "active" : ""
                                    }`}
                                >
                                    <img
                                        src={item.icon1}
                                        alt={`${item.name}-icon1`}
                                        className={`w-[18px] transition-opacity duration-300 ease-in-out ${
                                            activeItem === item.name
                                                ? "opacity-0 absolute"
                                                : "opacity-100 relative"
                                        }`}
                                    />

                                    <img
                                        src={item.icon2}
                                        alt={`${item.name}-icon2`}
                                        className={`w-[18px] transition-opacity duration-300 ease-in-out ${
                                            activeItem === item.name
                                                ? "opacity-100 relative"
                                                : "opacity-0 absolute"
                                        }`}
                                    />
                                    <span className="text-lg ps-2 font-[500]">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={handleDelete}
                                className="flex items-center w-full p-5 rounded-2xl gap-2"
                            >
                                <img
                                    src={deleteIcon}
                                    alt="delete-icon"
                                    className="w-[18px]"
                                />
                                <span className="text-lg ps-2 font-[500]">
                                    Delete
                                </span>
                            </button>
                        </li>
                    </ul>

                    <div className="profile-complete-status py-8 px-5">
                        <h4 className="text-xl font-normal">87%</h4>
                        <div className="process-line"></div>
                        <p>Profile Complete</p>
                    </div>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center w-full hover:text-red-500 duration-300 transition-colors gap-2 p-5 rounded-2xl cursor-pointer"
                    >
                        <img
                            src={logout}
                            alt="logout-icon"
                            className="w-[18px]"
                        />
                        <span className="text-lg">Logout</span>
                    </button>

                    {/* delete modal */}
                    {showModal && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
                            <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col items-center text-center">
                                <img
                                    src={deleteIcon}
                                    alt="delete-icon"
                                    className="w-[50px] h-[50px] mb-4"
                                />
                                <h2 className="text-2xl font-semibold text-black mb-2">
                                    Are you sure?
                                </h2>
                                <p className="text-gray-500 mb-6 font-[300] text-center">
                                    Are you sure to delete your account? All
                                    data will be lost.
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={confirmLogout}
                                        className="bg-[#ff2730] hover:bg-[#92070c] transition-colors duration-300 text-white px-8 py-2 rounded-lg text-lg font-[500]"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-[#2c2c50] hover:underline font-[500] text-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* logout modal */}
                    {showLogoutModal && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
                            <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col items-center text-center">
                                <img
                                    src={logout}
                                    alt="delete-icon"
                                    className="w-[50px] h-[50px] mb-4"
                                />
                                <h2 className="text-2xl font-semibold text-black mb-2">
                                    Are you sure?
                                </h2>
                                <p className="text-gray-500 mb-6 font-[300] text-center">
                                    Are you sure you want to logout?
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={() => {
                                            setShowLogoutModal(false);
                                            console.log("user logged out");
                                        }}
                                        className="bg-[#03b335] hover:bg-[#218838] transition-colors duration-300 text-white px-8 py-2 rounded-lg text-lg font-[500]"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowLogoutModal(false)
                                        }
                                        className="text-[#2c2c50] hover:underline font-[500] text-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* main */}
                <div className="main bg-[#f0f5f3] min-h-full h-full w-full ml-[350px] overflow-y-scroll">
                    <div className="nav-main bg-[#f0f5f3] w-full h-[90px] flex items-center justify-end gap-4 z-[9]">
                        <img
                            src={menuOpen}
                            alt="open-menu"
                            className="mr-auto w-[30px] h-[30px] cursor-pointer flex lg:hidden"
                            onClick={toggleSidebar}
                        />
                        <form className="search-form w-[300px] mr-6 relative border-none hidden lg:flex ">
                            <i className="fa-solid fa-magnifying-glass absolute top-[15px] left-4 text-black"></i>
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="w-full px-10 rounded-full font-[300] bg-[rgba(0,0,0,.05)] text-[rgba(0,0,0,.05)] border-none shadow-none focus:outline-none pl-[45px] pr-[15px] h-[45px] text-base"
                            />
                        </form>
                        <button
                            type="button"
                            className="nav-notification relative cursor-pointer"
                            onClick={() => setIsNotification(!isNotification)}
                        >
                            <img
                                src={notification}
                                alt="notification-icon"
                                className="h-[25px] w-[25px]"
                            />
                            <div className="notification-badge">
                                <div
                                    className={`absolute left-[-150px] top-[40px] text-start mt-2 w-[250px] bg-white rounded-xl shadow-md p-5 space-y-4 z-10 transition-all duration-300 ease-in-out ${
                                        isNotification
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"
                                    }`}
                                >
                                    <h3 className="font-semibold text-xl">
                                        Notification
                                    </h3>
                                    <ul className="list-none space-y-2">
                                        <li className="flex items-start relative notification-item">
                                            <img
                                                src={notification1}
                                                alt="notification-icon"
                                                className="w-10 h-10"
                                            />
                                            <div className="ps-2">
                                                <h6 className="text-md text-black font-[500]">
                                                    You have 3 new mails
                                                </h6>
                                                <span className="text-sm text-gray-500 font-[300]">
                                                    1 hour ago
                                                </span>
                                            </div>
                                            <div
                                                className="notification-badge"
                                                style={{ top: "8px" }}
                                            ></div>
                                        </li>

                                        <li className="flex items-start relative notification-item">
                                            <img
                                                src={notification2}
                                                alt="notification-icon"
                                                className="w-10 h-10"
                                            />
                                            <div className="ps-2">
                                                <h6 className="text-md text-black font-[500]">
                                                    You have 1 new mails
                                                </h6>
                                                <span className="text-sm text-gray-500 font-[300]">
                                                    3 hours ago
                                                </span>
                                            </div>
                                            <div
                                                className="notification-badge"
                                                style={{ top: "8px" }}
                                            ></div>
                                        </li>

                                        <li className="flex items-start relative notification-item">
                                            <img
                                                src={notification3}
                                                alt="notification-icon"
                                                className="w-10 h-10"
                                            />
                                            <div className="ps-2">
                                                <h6 className="text-md text-black font-[500]">
                                                    You have 2 new mails
                                                </h6>
                                                <span className="text-sm text-gray-500 font-[300]">
                                                    20 hour ago
                                                </span>
                                            </div>
                                            <div
                                                className="notification-badge"
                                                style={{ top: "8px" }}
                                            ></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </button>
                        <Link
                            to="pages/AccountSettings"
                            className="bg-[#03b335] hover:bg-[#218838] text-white py-3 px-6 text-md font-[500] rounded-full transition duration-300 ml-3"
                            type="button"
                        >
                            Announcements
                        </Link>
                    </div>
                    <div className="content w-full flex flex-col justify-between min-h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
