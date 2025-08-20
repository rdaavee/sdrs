import React from "react";

const RequestDetailsForm = () => {
    return (
        <div className="border border-gray-500 rounded-xs overflow-hidden">
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

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        <p className="text-gray-400 text-[10px]">
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
