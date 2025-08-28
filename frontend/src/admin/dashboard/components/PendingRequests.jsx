import React, { useState, useEffect, useRef } from "react";

const PendingRequests = ({ requests }) => {
    const [selectedRequest, setSelectedRequest] = useState(requests[0]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuAction = (action, request) => {
        alert(`${action}: ${request.title}`);
        setOpenMenuIndex(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm h-full card-item">
            <h2 className="font-semibold header-text border-b border-[#e3f0eb]">
                Pending Requests
            </h2>
            <div className="header-body-content">
                <ul className="w-full space-y-5 p-4">
                    {requests.map((request, index) => (
                        <li
                            key={index}
                            className={`relative flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer hover:bg-[#f4f4f4] ${
                                selectedRequest === request
                                    ? "text-green-500 bg-[rgba(36,64,52,.03)]"
                                    : "text-[#183b56]"
                            }`}
                            onClick={() => setSelectedRequest(request)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#f5f5f5]">
                                    <img
                                        src={request.icon}
                                        alt="icon"
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-[15px]">
                                        {request.title}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {request.student_id}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMenu(index);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v.01M12 12v.01M12 18v.01"
                                    />
                                </svg>
                            </div>

                            {openMenuIndex === index && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-4 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                                >
                                    <ul className="py-1 text-sm text-gray-700">
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuAction(
                                                    "View",
                                                    request
                                                );
                                            }}
                                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2 text-blue-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            View
                                        </li>
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuAction(
                                                    "Accept",
                                                    request
                                                );
                                            }}
                                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2 text-green-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Accept
                                        </li>
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuAction(
                                                    "Reject",
                                                    request
                                                );
                                            }}
                                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2 text-red-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Reject
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PendingRequests;
