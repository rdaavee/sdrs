import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SubmitReview = () => {
    const sigCanvas = useRef(null);
    const [confirmed, setConfirmed] = useState(false);

    const clear = () => {
        sigCanvas.current.clear();
        setConfirmed(false);
    };

    return (
        <div className="p-6 border border-gray-100 rounded-lg shadow-md bg-white max-w-sm mx-auto">
            <div
                className="border border-gray-400 mb-4 w-full"
                style={{
                    aspectRatio: "1 / 1",
                    maxWidth: "250px",
                    margin: "0 auto",
                }}
            >
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        width: 250,
                        height: 250,
                    }}
                />
            </div>

            <div className="flex justify-center mb-4">
                <button
                    onClick={clear}
                    className="px-3 py-1 mt-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                    Clear
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
                    className="text-gray-700 text-[10px]"
                >
                    I hereby confirm that the information provided herein is
                    accurate
                </label>
            </div>

            <button
                disabled={!confirmed}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    confirmed
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                Submit
            </button>
        </div>
    );
};

export default SubmitReview;
