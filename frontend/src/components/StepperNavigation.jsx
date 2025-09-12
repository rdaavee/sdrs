import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const StepperNavigation = ({ currentStep, handlePrevious, handleNext }) => {
    return (
        <div className="flex justify-between items-center px-6 mt-4">
            {currentStep > 0 ? (
                <button
                    onClick={handlePrevious}
                    className="mb-5 px-5 py-2 inline-flex items-center text-sm cursor-pointer text-white bg-green-500 hover:bg-green-600 transition-all"
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
                    className="mb-5 px-5 py-2 inline-flex items-center text-sm cursor-pointer text-white bg-green-500 hover:bg-green-600 transition-all"
                >
                    Next
                    <IoArrowForwardOutline className="ml-2 text-md" />
                </button>
            )}
        </div>
    );
};

export default StepperNavigation;
