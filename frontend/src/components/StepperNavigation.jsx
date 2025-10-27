import { useState } from "react";
import {
    IoArrowBackOutline,
    IoArrowForwardOutline,
    IoReload,
} from "react-icons/io5";

const StepperNavigation = ({
    currentStep,
    handlePrevious,
    handleNext,
    canProceed,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    
    const requiresConfirmation = currentStep === 1;

    const handleNextClick = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        await handleNext();
        setTimeout(() => setIsProcessing(false), 1500);
    };

    return (
        <div className="flex justify-between items-center px-6 mt-4">
            {currentStep > 0 ? (
                <button
                    onClick={handlePrevious}
                    className="mb-5 px-5 py-2 inline-flex items-center text-sm cursor-pointer text-white bg-[#496B24FF] hover:bg-[#3e5c1f] transition-all"
                >
                    <IoArrowBackOutline className="mr-2 text-md" />
                    Back
                </button>
            ) : (
                <div />
            )}

            {currentStep < 2 && (
                <button
                    onClick={handleNextClick}
                    disabled={
                        isProcessing || (requiresConfirmation && !canProceed)
                    }
                    className={`mb-5 px-5 py-2 inline-flex items-center justify-center text-sm text-white transition-all min-w-[100px] ${
                        isProcessing || (requiresConfirmation && !canProceed)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#496B24FF] hover:bg-[#3e5c1f] cursor-pointer"
                    }`}
                >
                    {isProcessing ? (
                        <IoReload className="animate-spin text-lg" />
                    ) : (
                        <>
                            Next
                            <IoArrowForwardOutline className="ml-2 text-md" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default StepperNavigation;
