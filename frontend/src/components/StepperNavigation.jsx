import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const StepperNavigation = ({ currentStep, handlePrevious, handleNext }) => {
    return (
        <div className="flex justify-between items-center px-6 mt-4">
            {currentStep > 0 ? (
                <button
                    onClick={handlePrevious}
                    className="mb-5 mt-2 px-5 py-1 border border-gray-300 rounded-xs inline-flex items-center text-xs cursor-pointer hover:bg-green-600 hover:border-green-600 hover:text-white transition-all"
                >
                    <IoArrowBackOutline className="mr-2 text-md" />
                    Back
                </button>
            ) : (
                <div />
            )}

            {currentStep < 2 && (
                <button
                    onClick={handleNext}
                    className="mb-5 mt-2 px-5 py-1 border border-gray-300 rounded-xs inline-flex items-center text-xs cursor-pointer hover:bg-green-600 hover:border-green-600 hover:text-white transition-all"
                >
                    Next
                    <IoArrowForwardOutline className="ml-2 text-md" />
                </button>
            )}
        </div>
    );
};

export default StepperNavigation;
