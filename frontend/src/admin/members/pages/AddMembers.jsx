import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa";

const roles = ["Super Admin", "Middle Admin", "Staff Admin"];
const statuses = ["Active", "Inactive"];

const AddAdmin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-3xl font-[500] text-[#244034] py-2">
                Staff Management
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
                {/* Add Form */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
                    <input
                        type="text"
                        placeholder="Enter Full Name"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <select className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        <option value="">Select Role</option>
                        {roles.map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <FaEyeSlash size={18} />
                            ) : (
                                <FaEye size={18} />
                            )}
                        </button>
                    </div>

                    <select className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        {statuses.map((status, index) => (
                            <option key={index} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <button className="col-span-1 md:col-span-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                        Add Admin
                    </button>
                </div>

                {/* List + Search */}
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="border px-3 py-2 rounded-lg w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Full Name
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Role
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Added Date
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white hover:bg-gray-100 transition">
                                    <td className="px-4 py-2">Ranier Tantan</td>
                                    <td className="px-4 py-2">
                                        rata.arcega.up@phinmaed.com
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            Super Admin
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">09/01/2025</td>
                                    <td className="px-4 py-2 space-x-3">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => setIsEditOpen(true)}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-end items-center mt-4 space-x-2">
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                            Previous
                        </button>
                        <button className="px-3 py-1 border rounded-md text-sm bg-green-500 text-white">
                            1
                        </button>
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                            Next
                        </button>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditOpen && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
                        <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col">
                            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
                                Edit Admin
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Role
                                    </label>
                                    <select className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                                        {roles.map((role, index) => (
                                            <option key={index} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Status
                                    </label>
                                    <select className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                                        {statuses.map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-center gap-6 mt-6">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="text-[#2c2c50] hover:underline font-[500] text-lg"
                                >
                                    Cancel
                                </button>
                                <button className="bg-[#03b335] hover:bg-[#218838] transition-colors duration-300 text-white px-8 py-2 rounded-lg text-lg font-[500]">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddAdmin;
