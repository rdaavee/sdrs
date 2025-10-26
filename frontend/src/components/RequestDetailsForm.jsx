import React, { useState } from "react";
import { toast } from "react-toastify";
import { requestCode, verifyCode } from "../services/verify";
import CourseSelect from "./CourseSelect";

const RequestDetailsForm = ({ dataForm, handleInputChange }) => {
    const [error, setError] = useState("");
    const [showCodeField, setShowCodeField] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const genders = ["Male", "Female"];

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
                <p className="font-medium text-lg uppercase">
                    Student Information
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center p-2 space-y-2 sm:space-y-0 sm:space-x-2">
                <p className="text-sm text-gray-500 leading-snug text-justify">
                    Fill all fields that have asterisk. Incomplete details may
                    cause delays in processing your request.
                </p>
            </div>
            <hr />

            <div className="p-6 bg-white">
                <form className="space-y-4">
                    {/* Email Section */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
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
                                disabled={
                                    !dataForm.email_address || cooldown > 0
                                }
                                className="bg-[#04882a] text-white text-xs px-2 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cooldown > 0
                                    ? `Request again in ${cooldown}s`
                                    : "Request Code"}
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
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        disabled={!dataForm.verification_code}
                                        className={`bg-[#04882a] text-white text-xs px-3 py-2 rounded ${
                                            !dataForm.verification_code
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }`}
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Show rest of form only after verification */}
                    {dataForm.isValidEmail && (
                        <>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <div className="w-full sm:w-auto flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Student No.{" "}
                                        <span className="text-gray-400 text-sm">
                                            (optional)
                                        </span>
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
                                        placeholder="03-2425-012345"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="w-full sm:w-auto flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Courses{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CourseSelect
                                        value={dataForm.course}
                                        onChange={(val) =>
                                            handleInputChange("course", val)
                                        }
                                    />
                                </div>

                                <div className="w-full sm:w-auto">
                                    <label className="block text-gray-700 mb-1">
                                        Gender{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        onChange={(e) =>
                                            handleInputChange(
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                        value={dataForm.gender}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    >
                                        <option value="">Select</option>
                                        {genders.map((gender, index) => (
                                            <option key={index} value={gender}>
                                                {gender}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Full Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        handleInputChange(
                                            "full_name",
                                            e.target.value
                                        )
                                    }
                                    onBlur={(e) => {
                                        const formatted = e.target.value
                                            .replace(/\s+/g, " ")
                                            .trim();
                                        handleInputChange(
                                            "full_name",
                                            formatted
                                        );
                                    }}
                                    value={dataForm.full_name}
                                    placeholder="Enter full name (e.g., Dela Cruz, Maria Santos)"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="w-full sm:w-auto flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Complete Address{" "}
                                        <span className="text-red-500">*</span>
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
                                        placeholder="Enter your current address"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="w-full sm:w-auto flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Contact Number{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        pattern="^[0-9]{11}$"
                                        maxLength={11}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            handleInputChange(
                                                "contact_number",
                                                value
                                            );
                                        }}
                                        value={dataForm.contact_number}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="w-full sm:w-auto flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Birthday{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            handleInputChange(
                                                "birthday",
                                                e.target.value
                                            )
                                        }
                                        value={dataForm.birthday}
                                        placeholder="mm/dd/yyyy"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Rest of your existing fields */}
                            <div className="border border-gray-300 rounded p-3">
                                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4 text-gray-700">
                                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                        <span className="text-[12.5px] whitespace-nowrap">
                                            Last School Attended:
                                        </span>
                                        <input
                                            type="text"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "last_school_attended",
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                dataForm.last_school_attended
                                            }
                                            className="w-full border-b border-gray-300 px-2 py-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 min-w-[120px]">
                                        <span className="text-[12.5px] whitespace-nowrap">
                                            Semester:
                                        </span>
                                        <input
                                            type="text"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "semester",
                                                    e.target.value
                                                )
                                            }
                                            value={dataForm.semester}
                                            className="w-full border-b border-gray-300 px-2 py-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 min-w-[140px]">
                                        <span className="text-[12.5px] whitespace-nowrap">
                                            S.Y.:
                                        </span>
                                        <input
                                            type="text"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "school_year",
                                                    e.target.value
                                                )
                                            }
                                            value={dataForm.school_year}
                                            className="w-full border-b border-gray-300 px-2 py-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                        <span className="text-[12.5px] whitespace-nowrap">
                                            If Graduate, Year Graduated:
                                        </span>
                                        <input
                                            type="text"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "last_school_year_graduated",
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                dataForm.last_school_year_graduated
                                            }
                                            className="w-full border-b border-gray-300 px-2 py-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="w-full md:flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        Elementary School{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            handleInputChange(
                                                "elementary_school",
                                                e.target.value
                                            )
                                        }
                                        value={dataForm.elementary_school}
                                        placeholder="Enter elementary school name"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="w-full md:w-1/3">
                                    <label className="block text-gray-700 mb-1">
                                        Year Graduated{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            handleInputChange(
                                                "elementary_year_graduated",
                                                value
                                            );
                                        }}
                                        value={
                                            dataForm.elementary_year_graduated
                                        }
                                        placeholder="e.g. 2015"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="w-full md:flex-1">
                                    <label className="block text-gray-700 mb-1">
                                        High School{" "}
                                        <span className="text-gray-400 text-sm">
                                            (Senior High School if applicable)
                                        </span>{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            handleInputChange(
                                                "high_school",
                                                e.target.value
                                            )
                                        }
                                        value={dataForm.high_school}
                                        placeholder="Enter high school name"
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                                    />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="block text-gray-700 mb-1">
                                        Year Graduated{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            handleInputChange(
                                                "highschool_year_graduated",
                                                value
                                            );
                                        }}
                                        value={
                                            dataForm.highschool_year_graduated
                                        }
                                        placeholder="e.g. 2021"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">
                                    Purpose/s of request{" "}
                                    <span className="text-red-500">*</span>
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

                            <div className="mt-4">
                                <label className="flex items-start gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={
                                            dataForm.confirm_information ||
                                            false
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "confirm_information",
                                                e.target.checked
                                            )
                                        }
                                        className="mt-1"
                                    />
                                    <span>
                                        I confirm that all information provided
                                        is accurate, and I authorize{" "}
                                        <span className="font-semibold">
                                            SDRS Team
                                        </span>{" "}
                                        to verify my information.
                                    </span>
                                </label>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RequestDetailsForm;
