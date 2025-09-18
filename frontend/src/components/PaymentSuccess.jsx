import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/found.json";
import { saveRequestReceipt } from "../services/request";

const PaymentSuccess = () => {
    const [referenceNumber, setReferenceNumber] = useState("");
    const [code, setCode] = useState("");
    const [showModal, setShowModal] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const finalizePayment = async () => {
            try {
                const savedForm =
                    JSON.parse(localStorage.getItem("pendingRequest")) || {};
                const result = await saveRequestReceipt({
                    ...savedForm,
                    paid: true,
                    payment_method: "online",
                });

                setReferenceNumber(result.reference_number);
                setCode(result.code);

                // clear after save
                localStorage.removeItem("pendingRequest");

                setTimeout(() => {
                    setShowModal(false);
                    setSubmitted(true);
                }, 2500);
            } catch (err) {
                console.error("Finalize payment failed:", err);
            }
        };

        finalizePayment();
    }, []);

    if (!submitted) {
        return (
            <Modal
                isOpen={showModal}
                className="bg-white/70 border-t-2 border-t-green-500 rounded-2xl shadow-xl p-6 max-w-sm w-full mx-auto outline-none flex flex-col items-center"
                overlayClassName="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-xl"
            >
                <Lottie
                    animationData={successAnimation}
                    loop={false}
                    className="w-32 h-32"
                />
                <h2 className="text-xl font-semibold text-green-600 text-center">
                    Success!
                </h2>
                <p className="mt-2 text-gray-600 text-center">
                    Your online payment was successful.
                </p>
                <p className="text-xs text-gray-400 mt-2">Loading...</p>
            </Modal>
        );
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="p-6 rounded-md border border-gray-300 bg-white text-black max-w-3xl w-full">
                <h3 className="text-lg font-semibold mb-2">
                    Submission Result
                </h3>
                <p className="text-sm mb-6 text-gray-500 text-justify">
                    Your document request was submitted successfully. Below are
                    your details:
                </p>

                <table className="w-full border border-gray-400 mb-6">
                    <tbody>
                        <tr className="border border-gray-300">
                            <td className="p-3 font-semibold">Reference No.</td>
                            <td className="p-3 text-green-500 font-bold">
                                {referenceNumber}
                            </td>
                        </tr>
                        <tr className="border border-gray-300">
                            <td className="p-3 font-semibold">Code</td>
                            <td className="p-3 text-green-500 font-bold">
                                {code}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="text-sm text-gray-500 text-justify">
                    You will be notified via email or SMS once your documents
                    are ready. You can track the status of your request by
                    navigating back to the Entry Page and selecting{" "}
                    <span className="font-semibold">Track Request</span>, using
                    the Reference No. and Code provided above.
                </p>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => navigate("/EntryPage")}
                        className="text-sm px-4 py-2 bg-green-600 text-white rounded-sm shadow hover:bg-green-700 transition cursor-pointer"
                    >
                        Back to Entry Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
