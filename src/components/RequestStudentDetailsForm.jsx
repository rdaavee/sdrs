import React from "react";

const RequestStudentDetailsForm = () => {
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
                            Student ID
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
                            Program (Course)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Year</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestStudentDetailsForm;
