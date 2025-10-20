import { useState, useEffect } from "react";
import { Stepper } from "react-form-stepper";
import Modal from "react-modal";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/found.json";
import {
    IoAttachOutline,
    IoDocumentOutline,
    IoInformation,
    IoSchoolOutline,
} from "react-icons/io5";
import { getRequestReceipt } from "../services/request";
import socket from "../../socket";

Modal.setAppElement("#root");

const steps = { waiting: 0, processing: 1, "for-review": 1, ready: 2, released: 3 };

const TrackRequestContent = ({ reference, code, onTrackingUpdate }) => {
    const [refValue, setRefValue] = useState(reference);
    const [codeValue, setCodeValue] = useState(code);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [requestReceipt, setRequestReceipt] = useState({});

    const fetchReceipt = async (ref, code) => {
        const result = await getRequestReceipt(ref, code);
        if (typeof result === "string") {
            setIsValid(false);
            setError("Invalid reference number and code");
        } else {
            setRequestReceipt(result);
            setIsValid(true);
            setError("");
            setActiveStep(steps[result.status]);
            setShowModal(true);

            onTrackingUpdate(ref, code);
        }
    };

    const handleTrack = async () => {
        if (refValue.trim() && codeValue.trim()) {
            await fetchReceipt(refValue, codeValue);
        }
    };

    useEffect(() => {
        let timer;
        if (showModal) {
            timer = setTimeout(() => {
                setShowModal(false);
            }, 2500);
        }
        return () => clearTimeout(timer);
    }, [showModal]);

    useEffect(() => {
        socket.on("requestUpdated", (data) => {
            setActiveStep(steps[data.status]);
            setRequestReceipt(data);
        });
    }, []);

    useEffect(() => {
        if (reference && code) {
            fetchReceipt(reference, code);
        }
    }, [reference, code]);

    return (
        <div className="space-y-6 m-3 sm:m-5">
            {/* Info cards */}
            <div className="grid grid-item grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border border-gray-300 rounded shadow-xs p-6">
                <div>
                    <h3 className="font-bold tracking-wider mb-2 text-lg sm:text-xl">
                        Office Hours
                    </h3>
                    <hr className="mb-2" />
                    <p>Monday to Friday</p>
                    <p>8:00 AM - 5:00 PM</p>
                </div>
                <div>
                    <h3 className="font-bold tracking-wider mb-2 text-lg sm:text-xl">
                        Contact Us
                    </h3>
                    <hr className="mb-2" />
                    <p>0995-078-5660</p>
                    <p>0961-753-7369</p>
                    <p>0916-921-2125</p>
                    <p>registrar.up@phinmaed.com</p>
                </div>
                <div>
                    <h3 className="font-bold tracking-wider mb-2 text-lg sm:text-xl">
                        Advisory
                    </h3>
                    <hr className="mb-2" />
                    <p className="text-sm sm:text-base">
                        Your document request PIN (6 digit) together with the
                        REFERENCE NO. is now required for tracking. You can find
                        the PIN on the confirmation email sent to you.
                    </p>
                </div>
            </div>

            {/* Input form */}
            <div className="border border-gray-300 rounded shadow-xs p-6">
                <p className="mb-4 text-gray-700 text-sm sm:text-base">
                    Track the status of your document request, please enter the{" "}
                    <strong className="font-bold">REFERENCE NUMBER</strong> and{" "}
                    <strong className="font-bold">CODE</strong> below.
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Reference Number"
                        value={refValue}
                        onChange={(e) => setRefValue(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-b-2 focus:border-b-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-b-2 focus:border-b-green-500"
                    />
                    <button
                        onClick={handleTrack}
                        className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Track
                    </button>
                </div>
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>

            {/* Found Modal */}
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col items-center"
                overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50"
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
            >
                <Lottie
                    animationData={successAnimation}
                    loop={false}
                    className="w-24 h-24 sm:w-32 sm:h-32"
                />
                <h2 className="text-lg sm:text-xl font-semibold text-green-600 text-center">
                    Found
                </h2>
                <p className="mt-2 text-gray-600 text-center text-sm sm:text-base">
                    Your request has been found and is now being tracked.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Closing automatically...
                </p>
            </Modal>

            {/* Request Details */}
            {isValid && (
                <div className="border border-gray-300 rounded shadow-xs p-4 sm:p-6">
                    <div className="flex items-center">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            <IoSchoolOutline className="text-2xl text-gray-600" />
                        </span>
                        <p className="ml-2 text-base sm:text-xl text-gray-500">
                            University of Pangasinan - Dagupan Campus
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="overflow-x-auto mt-6">
                        <Stepper
                            steps={[
                                {
                                    label: "Waiting",
                                    style: { cursor: "default" },
                                },
                                {
                                    label: "Processing",
                                    style: { cursor: "default" },
                                },
                                {
                                    label: "Ready",
                                    style: { cursor: "default" },
                                },
                                {
                                    label: "Released",
                                    style: { cursor: "default" },
                                },
                            ]}
                            activeStep={activeStep}
                            styleConfig={{
                                activeBgColor: "#16A34A",
                                completedBgColor: "#22C55E",
                                inactiveBgColor: "#D1D5DB",
                                labelFontSize: "14px",
                            }}
                        />
                    </div>

                    <hr className="my-6 text-gray-300" />

                    {/* Request Details */}
                    <div className="flex items-center mb-4">
                        <IoInformation className="text-2xl text-gray-600" />
                        <p className="ml-2 text-lg sm:text-xl text-gray-500">
                            Request Details
                        </p>
                    </div>
                    <div className="border border-gray-300 rounded p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-gray-600 text-sm">
                                Request Timestamp :
                                <span className="ml-2 text-gray-900 font-medium">
                                    {new Date(
                                        requestReceipt.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                Reference No. :
                                <span className="ml-2 text-gray-900 font-medium">
                                    {requestReceipt.reference_number}
                                </span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                Student Name :
                                <span className="ml-2 text-gray-900 font-medium">
                                    {requestReceipt.full_name}
                                </span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                Request Status :
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                                    ${
                                        requestReceipt.status === "accepted"
                                            ? "bg-green-100 text-green-700"
                                            : requestReceipt.status ===
                                              "rejected"
                                            ? "bg-red-100 text-red-700"
                                            : requestReceipt.status ===
                                                  "processing" ||
                                              requestReceipt.status ===
                                                  "for-review"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {requestReceipt.status === "for-review"
                                        ? "Processing"
                                        : requestReceipt.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Document Status */}
                    <div className="flex items-center mt-6 mb-3">
                        <IoDocumentOutline className="text-2xl text-gray-600" />
                        <p className="ml-2 text-lg sm:text-xl text-gray-500">
                            Document Status
                        </p>
                    </div>
                    <div className="border border-gray-300 rounded p-4 sm:p-6 mb-5 overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200 divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                                        Document
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requestReceipt.requested_documents &&
                                    JSON.parse(
                                        requestReceipt.requested_documents
                                    ).map((req) => (
                                        <tr key={req[0]}>
                                            <td className="px-4 py-2 text-gray-800">
                                                {req[0]}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                    ${
                                                        requestReceipt.status ===
                                                        "accepted"
                                                            ? "bg-green-100 text-green-700"
                                                            : requestReceipt.status ===
                                                                "rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : requestReceipt.status ===
                                                                "processing" ||
                                                            requestReceipt.status ===
                                                                "for-review"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {requestReceipt.status ===
                                                    "for-review"
                                                        ? "Processing"
                                                        : requestReceipt.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2 text-gray-600 text-sm">
                                                {requestReceipt.status ===
                                                "waiting"
                                                ? "Pending approval"
                                                : requestReceipt.status ===
                                                    "processing"
                                                ? `Expected release: ${new Date(
                                                        new Date(
                                                            requestReceipt.createdAt
                                                        ).setDate(
                                                            new Date(
                                                                requestReceipt.createdAt
                                                            ).getDate() + 7
                                                        )
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}`
                                                : requestReceipt.status ===
                                                    "for-review"
                                                ? "Your request is currently under review by the SDRS Team."
                                                : requestReceipt.status ===
                                                    "accepted"
                                                ? "Your request has been accepted and is awaiting processing."
                                                : requestReceipt.status ===
                                                    "ready"
                                                ? "Please claim your requested document at the Registrar’s Office."
                                                : requestReceipt.status ===
                                                    "rejected"
                                                ? "Your request has been rejected. For more details, please contact the SDRS Team or visit the Registrar’s Office."
                                                : "The document has already been released"}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Attachments */}
                    <div className="flex items-center mt-6 mb-3">
                        <IoAttachOutline className="text-2xl text-gray-600" />
                        <p className="ml-2 text-lg sm:text-xl text-gray-500">
                            Attachment File
                        </p>
                    </div>
                    <div className="border border-gray-300 rounded p-4 sm:p-6 mb-5">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-3">
                            Payment Confirmation
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Attach your official receipt and add comments if
                            needed.
                        </p>
                        <div className="relative">
                            <textarea
                                placeholder="Add comments here..."
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                                value={requestReceipt.comment || ""}
                                onChange={(e) =>
                                    setRequestReceipt((prev) => ({
                                        ...prev,
                                        comment: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                id="fileUpload"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setRequestReceipt((prev) => ({
                                            ...prev,
                                            uploadedReceipt: file,
                                        }));
                                    }
                                }}
                            />
                            <label
                                htmlFor="fileUpload"
                                className="absolute right-3 bottom-3 cursor-pointer text-gray-500 hover:text-green-700"
                            >
                                <IoAttachOutline className="size-7 bg-green-100 p-1 text-green-500 rounded-full" />
                            </label>
                        </div>

                        {requestReceipt.uploadedReceipt && (
                            <div className="mt-3 text-sm text-gray-700">
                                <p>
                                    Attached:{" "}
                                    <span className="font-medium">
                                        {requestReceipt.uploadedReceipt.name}
                                    </span>
                                </p>
                                {requestReceipt.uploadedReceipt.type.startsWith(
                                    "image/"
                                ) && (
                                    <img
                                        src={URL.createObjectURL(
                                            requestReceipt.uploadedReceipt
                                        )}
                                        alt="Preview"
                                        className="mt-2 max-h-40 w-full object-contain rounded border"
                                    />
                                )}
                            </div>
                        )}

                        {requestReceipt.uploadedReceipt && (
                            <button
                                onClick={async () => {
                                    const formData = new FormData();
                                    if (requestReceipt.uploadedReceipt) {
                                        formData.append(
                                            "receipt",
                                            requestReceipt.uploadedReceipt
                                        );
                                    }
                                    formData.append(
                                        "reference_number",
                                        requestReceipt.reference_number
                                    );
                                    if (requestReceipt.comment) {
                                        formData.append(
                                            "comment",
                                            requestReceipt.comment
                                        );
                                    }
                                    try {
                                        const res = await fetch(
                                            "/api/upload-receipt",
                                            {
                                                method: "POST",
                                                body: formData,
                                            }
                                        );
                                        if (res.ok) {
                                            alert("Submitted successfully!");
                                        } else {
                                            alert("Failed to submit.");
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        alert("Error submitting data.");
                                    }
                                }}
                                className="mt-4 w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit
                            </button>
                        )}
                    </div>

                    <p className="text-gray-400 text-[10px]">
                        * NOTICE: Printing of{" "}
                        <span className="font-bold">CLAIM SLIP</span> will be
                        available once all the requested documents are ready.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TrackRequestContent;
