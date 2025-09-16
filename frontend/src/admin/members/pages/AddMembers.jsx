import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa";
import {
    createAdminAccount,
    editAdminAccount,
    getAllUsers,
} from "../../../services/admin";
import socket from "../../../../socket";

const roles = ["Super Admin", "Middle Admin", "Staff Admin"];
const statuses = ["Active", "Inactive"];

const AddAdmin = () => {
    const [users, setUsers] = useState([]);
    const [dataForm, setDataForm] = useState({
        full_name: "",
        email_address: "",
        password_hash: "",
        role: "",
        status: true,
    });
    const [dataFormEdit, setDataFormEdit] = useState({
        full_name: "",
        email_address: "",
        password_hash: "",
        role: "",
        status: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setDataForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleEditInputChange = (key, value) => {
        setDataFormEdit((prev) => ({ ...prev, [key]: value }));
    };

    const createAccount = async () => {
        setLoading(true);
        if (
            !dataForm.full_name ||
            !dataForm.email_address ||
            !dataForm.password_hash ||
            !dataForm.role
        ) {
            setLoading(false);
            return;
        }
        try {
            const result = await createAdminAccount(dataForm);
            if (result.message !== "Success") {
                return;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setUsers((prev) => [
                ...prev,
                { ...dataForm, createdAt: new Date().toISOString() },
            ]);
            setDataForm({
                full_name: "",
                email_address: "",
                password_hash: "",
                role: "",
                createdAt: "",
                status: true,
            });
        }
    };
    const editAccount = async () => {
        setLoading(true);
        if (
            !dataFormEdit.full_name ||
            !dataFormEdit.email_address ||
            !dataFormEdit.role
        ) {
            setLoading(false);
            return;
        }
        try {
            const result = await editAdminAccount(dataFormEdit);
            if (result.message !== "Success") {
                return;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setDataFormEdit({
                user_id: "",
                full_name: "",
                email_address: "",
                role: "",
                status: true,
            });
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setUsers(await getAllUsers());
        };
        fetchData();
    }, []);
    useEffect(() => {
        socket.on("updatedUser", (data) => {
            setUsers((prev) =>
                prev.map((req) => (req._id === data._id ? data : req))
            );
        });
        // console.log("tahekhjkadsfhkasf", users);
    }, []);
    if (loading) return <div>Loading</div>;
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
                        onChange={(e) =>
                            handleInputChange("full_name", e.target.value)
                        }
                        value={dataForm.full_name}
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        onChange={(e) =>
                            handleInputChange("email_address", e.target.value)
                        }
                        value={dataForm.email_address}
                    />

                    <select
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={dataForm.role}
                        onChange={(e) =>
                            handleInputChange("role", e.target.value)
                        }
                    >
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
                            onChange={(e) =>
                                handleInputChange(
                                    "password_hash",
                                    e.target.value
                                )
                            }
                            value={dataForm.password_hash}
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

                    <select
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={dataForm.status ? "Active" : "Inactive"}
                        onChange={(e) =>
                            handleInputChange(
                                "status",
                                e.target.value === "Active"
                            )
                        }
                    >
                        {statuses.map((status, index) => (
                            <option key={index} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <button
                        className="col-span-1 md:col-span-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={createAccount}
                    >
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
                                {users &&
                                    users.map((user) => (
                                        <tr className="bg-white hover:bg-gray-100 transition">
                                            <td className="px-4 py-2">
                                                {user.full_name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.email_address}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.status
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-700"
                                                    }`}
                                                >
                                                    {user.status ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.createdAt
                                                    ? new Date(
                                                          user.createdAt
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                          }
                                                      )
                                                    : ""}
                                            </td>
                                            <td className="px-4 py-2 space-x-3">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => {
                                                        setIsEditOpen(true);
                                                        handleEditInputChange(
                                                            "full_name",
                                                            user.full_name
                                                        );
                                                        handleEditInputChange(
                                                            "email_address",
                                                            user.email_address
                                                        );
                                                        handleEditInputChange(
                                                            "role",
                                                            user.role
                                                        );
                                                        handleEditInputChange(
                                                            "status",
                                                            user.status
                                                        );
                                                        handleEditInputChange(
                                                            "user_id",
                                                            user._id
                                                        );
                                                        handleEditInputChange(
                                                            "createdAt",
                                                            user.createdAt
                                                        );
                                                    }}
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700">
                                                    <FaTrash size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {/* <div className="flex justify-end items-center mt-4 space-x-2">
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                            Previous
                        </button>
                        <button className="px-3 py-1 border rounded-md text-sm bg-green-500 text-white">
                            1
                        </button>
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                            Next
                        </button>
                    </div> */}
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
                                        onChange={(e) =>
                                            handleEditInputChange(
                                                "full_name",
                                                e.target.value
                                            )
                                        }
                                        value={dataFormEdit.full_name}
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
                                        onChange={(e) =>
                                            handleEditInputChange(
                                                "email_address",
                                                e.target.value
                                            )
                                        }
                                        value={dataFormEdit.email_address}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Role
                                    </label>
                                    <select
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={dataFormEdit.role}
                                        onChange={(e) =>
                                            handleEditInputChange(
                                                "role",
                                                e.target.value
                                            )
                                        }
                                    >
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
                                    <select
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={
                                            dataFormEdit.status
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        onChange={(e) =>
                                            handleEditInputChange(
                                                "status",
                                                e.target.value === "Active"
                                            )
                                        }
                                    >
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
                                <button
                                    className="bg-[#03b335] hover:bg-[#218838] transition-colors duration-300 text-white px-8 py-2 rounded-lg text-lg font-[500]"
                                    onClick={() => {
                                        editAccount();
                                        setIsEditOpen(false);
                                    }}
                                >
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
