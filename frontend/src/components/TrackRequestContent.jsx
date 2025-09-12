import { useState, useEffect } from "react";
import { Stepper } from "react-form-stepper";
import Modal from "react-modal";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/found.json";
import {
    IoDocumentOutline,
    IoInformation,
    IoSchoolOutline,
} from "react-icons/io5";
import { getRequestReceipt } from "../services/request";
import socket from "../../socket";

Modal.setAppElement("#root");

const steps = { waiting: 0, processing: 1, ready: 2, released: 3 };
const TrackRequestContent = () => {
    const [reference, setReference] = useState("");
    const [code, setCode] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [requestReceipt, setRequestReceipt] = useState({});

    const handleTrack = async () => {
        const result = await getRequestReceipt(reference, code);
        if (typeof result === "string") {
            setIsValid(false);
            setError("Invalid reference number and code");
        } else {
            setRequestReceipt(result);
            setIsValid(true);
            setError("");
            console.log(result.status, steps[result.status]);
            setActiveStep(steps[result.status]);
            setShowModal(true);
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
            console.log("updated", data);
            setActiveStep(steps[data.status]);
            setRequestReceipt(data);
        });
    }, []);

    return (
        <div className="space-y-6 m-5">
            {/* Info grid */}
            <div className="grid-item grid-container border border-gray-300 rounded shadow-xs p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Office Hours</h3>
                    <hr className="mb-2" />
                    <p>Monday to Friday</p>
                    <p>8:00 AM - 5:00 PM</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Contact Us</h3>
                    <hr className="mb-2" />
                    <p>Arellano Street, Dagupan City, 2400, Pangasinan</p>
                    <p>+63 995-078-5660</p>
                    <p>registrar.up@phinmaed.com</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Advisory</h3>
                    <hr className="mb-2" />
                    <p>
                        Your document request PIN (6 digit) together with the
                        REFERENCE NO. is now required for tracking. You can find
                        the PIN on the confirmation email sent to you. You can
                        ask the assistance of the Registration Services office
                        if you accidentally deleted the email.
                    </p>
                </div>
            </div>
            {/* Track Form */}
            <div className="border m-4 border-gray-300 rounded shadow-xs p-6">
                <p className="mb-2 text-gray-700 pText">
                    Track the status of your document request, please enter the{" "}
                    <strong className="font-bold">REFERENCE NUMBER</strong> and{" "}
                    <strong className="font-bold">CODE</strong> below.
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Reference Number"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:border-b-2 focus:border-b-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:border-b-2 focus:border-b-green-500"
                    />
                    <button
                        onClick={handleTrack}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                    >
                        Track
                    </button>
                </div>
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>

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
                    className="w-32 h-32"
                />

                <h2 className="text-xl font-semibold text-green-600 text-center">
                    Found
                </h2>
                <p className="mt-2 text-gray-600 text-center">
                    Your request has been found and is now being tracked.
                </p>
                <p className="text-xs text-gray-300 mt-2">
                    Closing automatically...
                </p>
            </Modal>

            {isValid && (
                <div className="border m-4 border-gray-300 rounded shadow-xs p-6">
                    <div className="inline-flex">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            <IoSchoolOutline className="text-2xl text-gray-600" />
                        </span>

                        <p className="text-xl ml-2 text-gray-500 mt-1">
                            University of Pangasinan - Dagupan Campus
                        </p>
                    </div>

                    <Stepper
                        className="mt-10"
                        steps={[
                            { label: "Waiting" },
                            { label: "Processing" },
                            { label: "Ready" },
                            { label: "Released" },
                        ]}
                        activeStep={activeStep}
                        styleConfig={{
                            activeBgColor: "#16A34A",
                            completedBgColor: "#22C55E",
                            inactiveBgColor: "#D1D5DB",
                            labelFontSize: "14px",
                        }}
                    />

                    <hr className="m-8 text-gray-300" />

                    <div className="inline-flex mt-15">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            <IoInformation className="text-2xl text-gray-600" />
                        </span>
                        <p className="text-xl ml-2 text-gray-500 mt-1">
                            Request Details
                        </p>
                    </div>

                    <div className="border m-3 border-gray-300 rounded p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="text-gray-600 text-sm">
                                Request Timestamp :
                                <span className="ml-2 text-gray-900 font-medium">
                                    {requestReceipt.createdAt}
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
                                <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    {requestReceipt.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex mt-15">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            <IoDocumentOutline className="text-2xl text-gray-600" />
                        </span>
                        <p className="text-xl ml-2 text-gray-500 mt-1">
                            Document Status
                        </p>
                    </div>

                    <div className="border m-3 border-gray-300 rounded p-6 mb-5">
                        <div className="mt-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                Document
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                Remarks
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requestReceipt.requested_documents &&
                                            JSON.parse(
                                                requestReceipt.requested_documents
                                            ).map((req) => (
                                                <tr>
                                                    <td className="px-4 py-2 text-sm text-gray-800">
                                                        {req[0]}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                            {
                                                                requestReceipt.status
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-600">
                                                    {requestReceipt.status === "waiting"
                                                        ? "Pending approval"
                                                        : requestReceipt.status === "processing"
                                                        ? `Expected release: ${new Date(
                                                            new Date(requestReceipt.createdAt).setDate(
                                                                new Date(requestReceipt.createdAt).getDate() + 7
                                                            )
                                                        ).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}`
                                                        : requestReceipt.status === "ready"
                                                        ? "Please claim at the Registrar’s Office"
                                                        : requestReceipt.status === "accepted"
                                                        ? "Your request is already accepted"
                                                        : "Released"}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
