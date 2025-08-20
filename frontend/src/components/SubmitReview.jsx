import React, { useState } from "react";
import {
    IoCardOutline,
    IoCashOutline,
    IoTrashOutline,
    IoAddCircleOutline,
    IoRemoveCircleOutline,
} from "react-icons/io5";

const SubmitReview = () => {
    const [confirmed, setConfirmed] = useState(false);

    const [documents, setDocuments] = useState([
        { id: 1, name: "Certificate of Enrollment", qty: 1, price: 50 },
        { id: 2, name: "Transcript of Records", qty: 2, price: 100 },
        { id: 3, name: "Good Moral Certificate", qty: 1, price: 100 },
    ]);

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

    const total = documents.reduce((sum, doc) => sum + doc.qty * doc.price, 0);

    return (
        <div className="p-6 m-10 border border-gray-300 rounded-lg bg-white max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <button className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 font-medium transition">
                            <span className="inline-flex items-center gap-2">
                                <IoCardOutline className="text-xl" />
                                Online Pay
                            </span>
                        </button>
                        <button className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 font-medium transition">
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
                        disabled={!confirmed || documents.length === 0}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                            confirmed && documents.length > 0
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitReview;
