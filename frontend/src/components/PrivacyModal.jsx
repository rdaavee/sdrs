import { motion } from "framer-motion";

const PrivacyModal = ({ onAgree, onCancel, note }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 px-5">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-t-4 border-t-green-700 rounded-md shadow-md 
                            max-w-3xl w-full mx-auto outline-none flex flex-col 
                            max-h-[80vh] overflow-hidden"
            >
                <div className="bg-white px-6 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-green-700 uppercase">
                        Data Privacy Statement / Personal Data Consent
                    </h2>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="border border-gray-300 rounded-sm p-2 border-dashed">
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            By accomplishing this School Form, the requesting
                            party:
                        </p>
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-2">
                            <li>
                                Certifies that the information provided is true
                                and complete.
                            </li>
                            <li>
                                Acknowledges that the confidentiality of
                                information is protected by the{" "}
                                <span className="font-semibold">
                                    Data Privacy Act of 2012 (RA 10173)
                                </span>
                                .
                            </li>
                            <li>
                                Authorizes the release of any and all academic,
                                financial, and other information that may be
                                requested by the government for regulatory
                                purposes, or by affiliates of the School to aid
                                in achieving its purpose. Such information shall
                                remain with the School until the consent is
                                revoked in writing.
                            </li>
                        </ol>
                    </div>

                    <hr className="mt-4 border-dashed" />

                    {note && (
                        <div className="text-xs text-gray-500 italic mt-4 bg-amber-100 p-1.5 border border-amber-400">
                            {note}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-6">
                        <button
                            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
                            onClick={onAgree}
                        >
                            I have read, understood, and agree. I give my
                            express consent.
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            onClick={onCancel}
                        >
                            I have read, understood, but do not agree. I
                            withhold my consent.
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyModal;
