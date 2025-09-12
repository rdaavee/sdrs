import { motion } from "framer-motion";

const PrivacyModal = ({ onAgree, onCancel }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-t-4 border-t-green-500 rounded-md shadow-md 
                            max-w-3xl w-full mx-auto outline-none flex flex-col 
                            max-h-[80vh] overflow-hidden">
                <div className="bg-white px-6 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-green-600 uppercase">
                        SDRS Privacy Notice
                    </h2>
                </div>

                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        By proceeding, you acknowledge and consent that your personal 
                        information will be collected, used, and processed in accordance 
                        with our Data Privacy Policy, in compliance with the Data Privacy Act.
                    </p>
                    <div className="flex flex-col gap-3 mt-6">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            onClick={onAgree}
                        >
                            I have read, understood, and agree with the SDRS Privacy Note. 
                            I give my express consent to the collection and processing of my personal data in accordance thereto.
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            onClick={onCancel}
                        >
                            I have read, understood, but do not agree with the SDRS Privacy Note. 
                            I do not give my express consent to the collection and processing of my personal data in accordance thereto.
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyModal;
