import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { requestCode, verifyCode } from "../services/verify";

import courses from "../constants/courses";

const RequestDetailsForm = ({ dataForm, handleInputChange }) => {
    const [error, setError] = useState("");
    const [showCodeField, setShowCodeField] = useState(false);
    const [cooldown, setCooldown] = useState(0)

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleRequestCode = () => {
        if (!validateEmail(dataForm.email_address)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (cooldown > 0) {
            toast.error(`Please wait ${cooldown}s before requesting again.`);
            return;
        }

        setError("");
        setShowCodeField(true);
        requestCode(dataForm.email_address);

        toast.success("Verification code successfully sent to your email.");

        setCooldown(60);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleVerifyCode = async () => {
        const isSixDigits = /^\d{6}$/.test(dataForm.verification_code);
        if (isSixDigits) {
            const result = await verifyCode(dataForm.verification_code);
            if (result) {
                handleInputChange("isValidEmail", true);
                toast.success("Code Verified.");
            } else {
                toast.error("Invalid code. Enter 6 digits.");
                handleInputChange("isValidEmail", false);
            }
        } else {
            toast.error("Invalid code. Enter 6 digits.");
            handleInputChange("isValidEmail", false);
        }
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-[#04882a] text-white px-4 py-2">
                <p className="font-semibold text-sm uppercase">
                    Student Information
                </p>
            </div>

            <div className="px-3 py-2">
                <p className="font-medium text-gray-500 text-md">
                    <span className="uppercase">Instructions</span>: Please fill out all required information completely. Incomplete details may cause delays in processing your request.
                </p>
            </div>

            <hr />

            <div className="p-6 bg-white">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Student No. <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <input
                            type="text"
                            onChange={(e) =>
                                handleInputChange(
                                    "student_number",
                                    e.target.value
                                )
                            }
                            value={dataForm.student_number}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            onChange={(e) => {
                                handleInputChange("full_name", e.target.value);
                            }}
                            onBlur={(e) => {
                                const formatted = e.target.value.replace(/\s+/g, " ").trim();
                                handleInputChange("full_name", formatted);
                            }}
                            value={dataForm.full_name}
                            placeholder="Enter full name (Last Name, First Name Middle)"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-1">
                        Current Address
                    </label>
                        <input
                            type="text"
                            onChange={(e) =>
                                handleInputChange("current_address", e.target.value)
                            }
                            value={dataForm.current_address}
                            placeholder="Enter your current address"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Courses
                        </label>
                        <select
                            onChange={(e) =>
                                handleInputChange("course", e.target.value)
                            }
                            value={dataForm.course}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            pattern="^[0-9]{11}$"
                            maxLength={11}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                handleInputChange("contact_number", value);
                            }}
                            value={dataForm.contact_number}
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
                                disabled={dataForm.isValidEmail}
                                onChange={(e) =>
                                    handleInputChange(
                                        "email_address",
                                        e.target.value
                                    )
                                }
                                value={dataForm.email_address}
                                className={`w-full border rounded px-3 py-2 ${
                                    error ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={handleRequestCode}
                                disabled={!dataForm.email_address || cooldown > 0}
                                className="bg-[#04882a] text-white text-xs px-1 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cooldown > 0 ? `Request again in ${cooldown}s` : "Request Code"}
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
                        {(showCodeField || dataForm.isValidEmail) && (
                            <div className="mt-3">
                                <label className="block text-gray-700 mb-1">
                                    Enter 6-digit Code
                                </label>
                                <div className="flex w-full gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            disabled={dataForm.isValidEmail}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                handleInputChange(
                                                    "verification_code",
                                                    value
                                                );
                                            }}
                                            value={dataForm.verification_code}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        disabled={!dataForm.verification_code}
                                        className={`bg-[#04882a] text-white text-xs px-3 py-2 rounded 
                                                ${!dataForm.verification_code ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Purpose/s of request
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            onChange={(e) =>
                                handleInputChange(
                                    "purpose_of_request",
                                    e.target.value
                                )
                            }
                            value={dataForm.purpose_of_request}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestDetailsForm;
