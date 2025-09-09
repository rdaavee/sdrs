import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import user from "../assets/images/user-img.png";
import dashboard1 from "../assets/svgs/dashbord-icon-01.svg";
import dashboard2 from "../assets/svgs/dashbord-icon-02.svg";
import profile1 from "../assets/svgs/profile-icon-01.svg";
import profile2 from "../assets/svgs/profile-icon-02.svg";
import notification from "../assets/svgs/notification-icon.svg";
import notification1 from "../assets/svgs/notification-icon1.svg";
import notification2 from "../assets/svgs/notification-icon2.svg";
import notification3 from "../assets/svgs/notification-icon3.svg";
import note1 from "../assets/svgs/note-icon-01.svg";
import note2 from "../assets/svgs/note-icon-02.svg";
import setting1 from "../assets/svgs/setting-icon-01.svg";
import menuOpen from "../assets/svgs/menu-open.png";
import menuClose from "../assets/svgs/menu-close.png";
import deleteIcon from "../assets/svgs/delete-icon-01.svg";
import logout from "../assets/svgs/logout-icon-01.svg";
import ShimmerLoader from "../components/ShimmerLoader";
import { cookies, logoutMethod } from "../services/admin";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    const [activeItem, setActiveItem] = useState("Dashboard");
    const [isSidebarActive, setIsSidebarActive] = useState(false);

    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarActive(!isSidebarActive);
    };

    const closeSidebar = () => {
        setIsSidebarActive(false);
    };

    const navItems = [
        {
            name: "Request List",
            path: "/pages/RequestList",
            icon1: note1,
            icon2: note2,
        },
        {
            name: "Staff Management",
            path: "/pages/staff-management",
            icon1: profile1,
            icon2: profile2,
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const notifRef = useRef(null);
    const userRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotification(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    <div className="logo w-full text-start ml-3 mb-5 pb-5">
                        <a href="#">
                            <h2 className="text-4xl font-[600] tracking-wide">
                                SDRS
                            </h2>
                        </a>
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
                    </ul>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center w-full hover:text-red-500 duration-300 transition-colors gap-2 p-5 rounded-2xl cursor-pointer"
                    >
                        <img
                            src={logout}
                            alt="logout-icon"
                            className="w-[18px]"
                        />
                        <span className="text-lg ps-2 font-[500]">Logout</span>
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
                                            logoutMethod();
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 1200);
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
                    <div className="nav-main w-full h-[100px] flex items-center justify-between px-5 z-[9] border-b-1 border-gray-300 shadow-sm">
                        <div className="flex items-center gap-4">
                            <img
                                src={menuOpen}
                                alt="open-menu"
                                className="w-[30px] h-[30px] cursor-pointer lg:hidden"
                                onClick={toggleSidebar}
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Notification */}
                            <div ref={notifRef} className="relative">
                                <button
                                    type="button"
                                    className="nav-notification relative cursor-pointer"
                                    onClick={() =>
                                        setIsNotification(!isNotification)
                                    }
                                >
                                    <img
                                        src={notification}
                                        alt="notification-icon"
                                        className="h-[25px] w-[25px] mt-2"
                                    />
                                </button>

                                <div
                                    className={`absolute right-0 top-[50px] text-start w-[250px] bg-white rounded-xl shadow-md p-5 space-y-4 z-10 transition-all duration-300 ease-in-out ${
                                        isNotification
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"
                                    }`}
                                >
                                    <h3 className="font-semibold text-lg">
                                        Notification
                                    </h3>
                                    <ul className="list-none space-y-3">
                                        <li
                                            className="flex items-start gap-2 cursor-pointer"
                                            onClick={() =>
                                                setIsNotification(false)
                                            }
                                        >
                                            <img
                                                src={notification1}
                                                alt=""
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <h6 className="text-sm font-[500] text-black">
                                                    You have 3 new mails
                                                </h6>
                                                <span className="text-xs text-gray-500 font-[300]">
                                                    1 hour ago
                                                </span>
                                            </div>
                                        </li>
                                        <li
                                            className="flex items-start gap-2 cursor-pointer"
                                            onClick={() =>
                                                setIsNotification(false)
                                            }
                                        >
                                            <img
                                                src={notification2}
                                                alt=""
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <h6 className="text-sm font-[500] text-black">
                                                    You have 1 new mail
                                                </h6>
                                                <span className="text-xs text-gray-500 font-[300]">
                                                    3 hours ago
                                                </span>
                                            </div>
                                        </li>
                                        <li
                                            className="flex items-start gap-2 cursor-pointer"
                                            onClick={() =>
                                                setIsNotification(false)
                                            }
                                        >
                                            <img
                                                src={notification3}
                                                alt=""
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <h6 className="text-sm font-[500] text-black">
                                                    You have 2 new mails
                                                </h6>
                                                <span className="text-xs text-gray-500 font-[300]">
                                                    20 hours ago
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* User dropdown */}
                            <div ref={userRef} className="relative">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-2"
                                >
                                    <img
                                        src={user}
                                        alt="user-img"
                                        className="w-[40px] h-[40px] rounded-full"
                                    />
                                    <span className="text-sm font-[500]">
                                        {cookies.get("role")}
                                    </span>
                                </button>

                                <ul
                                    className={`absolute right-0 mt-3 w-[220px] bg-white rounded-md shadow-md p-4 space-y-3 transition-all duration-300 ease-in-out z-10 ${
                                        isOpen
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"
                                    }`}
                                >
                                    <li onClick={() => setIsOpen(false)}>
                                        <Link
                                            to="/pages/MyProfile"
                                            className="flex items-center gap-2 text-gray-700 hover:text-[#3c8968] transition"
                                        >
                                            <img
                                                src={profile1}
                                                alt="Profile Icon"
                                                className="w-[18px]"
                                            />
                                            <span className="text-sm">
                                                Profile
                                            </span>
                                        </Link>
                                    </li>
                                    <li onClick={() => setIsOpen(false)}>
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 text-gray-700 hover:text-[#3c8968] transition"
                                        >
                                            <img
                                                src={setting1}
                                                alt=""
                                                className="w-[18px]"
                                            />
                                            <span className="text-sm">
                                                Account Settings
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="content w-full flex flex-col justify-between min-h-0 overflow-y-auto">
                        {loading ? <ShimmerLoader /> : <Outlet />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
