import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/found.json";
import {
    IoCardOutline,
    IoCashOutline,
    IoTrashOutline,
    IoAddCircleOutline,
    IoRemoveCircleOutline,
} from "react-icons/io5";
import { saveRequestReceipt } from "../services/request";

const SubmitReview = ({ dataForm, setDataForm, handleInputChange }) => {
    const [referenceNumber, setReferenceNumber] = useState("");
    const [code, setCode] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
        dataForm.payment_method || ""
    );

    const prices = {
        Certificates: 0,
        "Certificate of Transfer Credentials": 120,
        "Certification of Enrollment": 50,
        "Certification of Graduation": 100,
        "Certification of Units Earned": 70,
        "Certification of Good Moral": 60,
        "Certification of Weighted Average": 80,
        "Certification-Med. of Instruction": 90,
        "Certification - Letter of Acceptance": 40,
        "Certification - Letter of Acceptance with SPA": 60,
        "Certification - Course Description": 55,
        Diploma: 100,
        "Form 137": 100,
        "Copy of Grades": 100,
        "Transcript of Records": 30,
    };

    const [documents, setDocuments] = useState(
        dataForm.requested_documents.map((doc, index) => {
            return {
                id: index + 1,
                name: doc[0],
                qty: doc[1],
                price: prices[doc[0]] * doc[1],
            };
        })
    );

    const handleRemove = (id) => {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setDocuments((docs) =>
            docs.map((doc) =>
                doc.id === id
                    ? { ...doc, qty: Math.max(1, doc.qty + delta) }
                    : doc
            )
        );
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        handleInputChange("payment_method", method);
    };

    const total = documents.reduce((sum, doc) => sum + doc.qty * doc.price, 0);

    const submitRequest = async () => {
        setLoading(true);
        if (
            !dataForm.payment_method ||
            (dataForm.payment_method === "online" && !dataForm.paid)
        ) {
            setLoading(false);
            return;
        }
        try {
            const result = await saveRequestReceipt(dataForm);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                setSubmitted(true);
            }, 2500);
            setReferenceNumber(result.reference_number);
            setCode(result.code);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setDataForm({
                student_number: "",
                full_name: "",
                current_address: "",
                course: "",
                contact_number: "",
                email_address: "",
                purpose_of_request: "",
                requested_documents: [],
                isValidEmail: false,
                verification_code: "",
                payment_method: "",
                paid: false,
            });
        }
    };
    useEffect(() => {
        const updatedRequestedDocuments = documents.map((doc) => [
            doc.name,
            doc.qty,
        ]);
        handleInputChange("requested_documents", updatedRequestedDocuments);
    }, [documents]);

    return (
        <div className="p-6 m-10 border border-gray-300 rounded-lg bg-white max-w-5xl mx-auto">
            {!submitted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* left side content */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Requested Documents
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-700">
                            {documents.map((doc) => (
                                <li
                                    key={doc.id}
                                    className="flex justify-between items-center"
                                >
                                    <span>{doc.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(doc.id, -1)
                                            }
                                            className="text-gray-500 hover:text-red-500 text-xl"
                                        >
                                            <IoRemoveCircleOutline />
                                        </button>
                                        <span className="font-medium">
                                            x{doc.qty}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(doc.id, 1)
                                            }
                                            className="text-gray-500 hover:text-green-700 text-xl"
                                        >
                                            <IoAddCircleOutline />
                                        </button>

                                        <button
                                            onClick={() => handleRemove(doc.id)}
                                            className="text-gray-500 hover:text-red-600 ml-2 text-xl"
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {documents.length === 0 && (
                                <p className="text-gray-500 text-center">
                                    No documents selected
                                </p>
                            )}
                        </ul>
                        <div className="mt-4 border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₱ {total}</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Select Payment Method
                        </h2>
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <button
                                onClick={() =>
                                    handlePaymentMethodSelect("online")
                                }
                                className={`w-full px-4 py-3 cursor-pointer rounded-lg border transition-all duration-200 font-medium ${
                                    selectedPaymentMethod === "online"
                                        ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                                        : "border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700"
                                }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <IoCardOutline className="text-xl" />
                                    Online Pay
                                </span>
                            </button>
                            <button
                                onClick={() =>
                                    handlePaymentMethodSelect("cashier")
                                }
                                className={`w-full px-4 py-3 cursor-pointer rounded-lg border transition-all duration-200 font-medium ${
                                    selectedPaymentMethod === "cashier"
                                        ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                                        : "border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700"
                                }`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <IoCashOutline className="text-xl" />
                                    Cash (Pay at Registrar)
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="checkbox"
                                id="confirmation"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label
                                htmlFor="confirmation"
                                className="text-gray-700 text-xs"
                            >
                                I hereby confirm that the information provided
                                herein is accurate
                            </label>
                        </div>

                        <button
                            disabled={
                                !confirmed ||
                                documents.length === 0 ||
                                !selectedPaymentMethod ||
                                loading
                            }
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                                confirmed &&
                                documents.length > 0 &&
                                selectedPaymentMethod &&
                                !loading
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={submitRequest}
                        >
                            {loading ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-lg border border-gray-300 bg-white text-black">
                    <h3 className="text-lg font-semibold mb-2">
                        Submission Result
                    </h3>
                    <p className="text-sm mb-6 text-gray-500">
                        Your document request was submitted successfully. You
                        will receive a confirmation email shortly with your
                        Reference Number and PIN.
                    </p>

                    <table className="w-full border border-gray-400 mb-6">
                        <tbody>
                            <tr className="border border-gray-300">
                                <td className="p-3 font-semibold">
                                    Reference No.
                                </td>
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

                    <p className="text-sm text-gray-500">
                        You will be notified via email or SMS once your
                        documents are ready. <br />
                        You can track the status of your request at
                        <span className="font-semibold"> Track Request </span>
                        using the Reference No. and Code above.
                    </p>
                </div>
            )}

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
                    Success!
                </h2>
                <p className="mt-2 text-gray-600 text-center">
                    Your request has been submitted successfully.
                </p>
                <p className="text-xs text-gray-300 mt-2">
                    Closing automatically...
                </p>
            </Modal>
        </div>
    );
};

export default SubmitReview;
