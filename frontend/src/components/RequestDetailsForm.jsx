import React, { useState } from "react";
import { requestCode, verifyCode } from "../services/verify";

const RequestDetailsForm = ({ dataForm, handleInputChange }) => {
    const [error, setError] = useState("");
    const [showCodeField, setShowCodeField] = useState(false);
    const [codeMessage, setCodeMessage] = useState("");

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleRequestCode = () => {
        if (!validateEmail(dataForm.email_address)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        setShowCodeField(true);
        requestCode(dataForm.email_address);
    };

    const handleVerifyCode = async () => {
        const isSixDigits = /^\d{6}$/.test(dataForm.verification_code);
        if (isSixDigits) {
            const result = await verifyCode(dataForm.verification_code);
            if (result) {
                handleInputChange("isValidEmail", true);
                setCodeMessage("Code verified.");
            } else {
                setCodeMessage("Invalid code. Enter 6 digits.");
                handleInputChange("isValidEmail", false);
            }
        } else {
            setCodeMessage("Invalid code. Enter 6 digits.");
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

            <div className="p-6 bg-white">
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Student No.
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
                            onChange={(e) =>
                                handleInputChange("full_name", e.target.value)
                            }
                            value={dataForm.full_name}
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
                                handleInputChange(
                                    "current_address",
                                    e.target.value
                                )
                            }
                            value={dataForm.current_address}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Program/Course
                        </label>
                        <input
                            type="text"
                            onChange={(e) =>
                                handleInputChange("course", e.target.value)
                            }
                            value={dataForm.course}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="number"
                            onChange={(e) =>
                                handleInputChange(
                                    "contact_number",
                                    e.target.value
                                )
                            }
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
                                disabled={!dataForm.email_address}
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
                        {(showCodeField || dataForm.isValidEmail) && (
                            <div className="mt-3">
                                <label className="block text-gray-700 mb-1">
                                    Enter 6-digit Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
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
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        className="bg-[#04882a] text-white text-xs px-2 py-1 rounded cursor-pointer"
                                    >
                                        Verify Code
                                    </button>
                                </div>
                                {codeMessage && (
                                    <p
                                        className={`text-xs mt-1 ${
                                            dataForm.code_is_valid
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {codeMessage}
                                    </p>
                                )}
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
