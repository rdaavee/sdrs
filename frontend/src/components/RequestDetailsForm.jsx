import React, { useState } from "react";

const RequestDetailsForm = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleRequestCode = () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        alert(`Code has been requested for: ${email}`);
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-[#04882a] text-white px-4 py-2">
                <p className="font-semibold text-sm uppercase">
                    Student Information
                </p>
            </div>

            <div className="p-6 bg-white">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Student No.
                        </label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Current Address
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Program/Course
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    {/* Email with validation */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border rounded px-3 py-2 ${
                                    error ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={handleRequestCode}
                                disabled={!email}
                                className="bg-[#04882a] text-white text-xs px-1 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Request Code
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                        <p className="text-red-500 text-[10px] mt-1">
                            * Valid and active email is required. The Reference
                            No. for request tracking will be sent to this email
                            address.
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Purpose/s of request
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestDetailsForm;
