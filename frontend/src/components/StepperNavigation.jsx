import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const StepperNavigation = ({ currentStep, handlePrevious, handleNext }) => {
    return (
        <div className="flex justify-between items-center px-6 mt-4">
            {currentStep > 0 ? (
                <button
                    onClick={handlePrevious}
                    className="mb-5 mt-2 px-5 py-1 border rounded-full inline-flex items-center text-xs bg-gray-100"
                >
                    <FaArrowAltCircleLeft className="mr-2 text-md" />
                    Previous
                </button>
            ) : (
                <div />
            )}

            {currentStep < 2 && (
                <button
                    onClick={handleNext}
                    className="mb-5 mt-2 px-5 py-1 border rounded-full inline-flex items-center text-xs bg-gray-100"
                >
                    Next
                    <FaArrowAltCircleRight className="ml-2 text-md" />
                </button>
            )}
        </div>
    );
};

export default StepperNavigation;
