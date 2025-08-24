import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaRegFile, FaSearch } from "react-icons/fa";

import OfficeHours from "../components/OfficeHours";
import Reminders from "../components/Reminders";
import RequestDetailsTable from "../components/RequestDetailsTable";
import SubmitReview from "../components/SubmitReview";
import StepperNavigation from "../components/StepperNavigation";
import CustomStepper from "../components/Stepper";
import RequestDetailsForm from "../components/RequestDetailsForm";
import TrackRequestContent from "../components/TrackRequestContent";

const EntryPage = () => {
    const [activeTab, setActiveTab] = useState("newRequest");
    const [currentStep, setCurrentStep] = useState(0);
    const steps = ["Welcome", "Request Details", "Submit"];

    const [copies, setCopies] = useState({
        authentication: 1,
        certification: 1,
        diploma: 1,
        form137: 1,
        registrationForm: 1,
        tor: 2,
    });

    const renderContent = () => {
        if (activeTab === "requestTracker") {
            return <TrackRequestContent />;
        }

        switch (currentStep) {
            case 0:
                return (
                    <>
                        <OfficeHours />
                        <Reminders />
                    </>
                );
            case 1:
                return (
                    <div className="m-10 p-6 border border-gray-300 rounded shadow-xs bg-white">
                        <h2 className="text-xl mb-4 text-gray-500">
                            Step 1 : REQUEST DETAILS
                        </h2>
                        <hr className="m-7 text-gray-300" />
                        <RequestDetailsTable
                            copies={copies}
                            setCopies={setCopies}
                        />
                        <hr className="mt-7 mb-7 text-gray-300" />
                        <RequestDetailsForm />
                    </div>
                );
            case 2:
                return (
                    <div className="m-10 p-6 border border-gray-300 rounded shadow-xs bg-white">
                        <h2 className="text-xl mb-4 text-gray-500">
                            Step 2 : PAYMENT / SUBMIT
                        </h2>
                        <hr className="m-7 text-gray-300" />
                        <SubmitReview />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container shadow-lg">
            <div className="flex flex-column text-white text-center entry-header">
                <div className="mb-5">
                    <h1 className="font-bold text-3xl">
                        PHINMA - University of Pangasinan
                        <br />
                        Online Document Request
                    </h1>

                    <h6 className="mt-3 mx-auto px-2">
                        Already submitted a request? Click{" "}
                        <strong>Track Request</strong> below to track its
                        status.
                    </h6>
                </div>
            </div>

            <div className="tabs gap-3 d-flex align-items-center mt-5">
                <button
                    data-id="newRequest"
                    className={`tab-button ${
                        activeTab === "newRequest" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("newRequest")}
                >
                    <FaRegFile className="icon" /> New Request
                </button>

                <button
                    data-id="requestTracker"
                    className={`tab-button ${
                        activeTab === "requestTracker" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("requestTracker")}
                >
                    <FaSearch className="icon" /> Track Request
                </button>
            </div>

            <hr
                className={`tab-divider ${
                    activeTab === "newRequest"
                        ? "new-request-divider"
                        : activeTab === "requestTracker"
                        ? "tracker-divider"
                        : ""
                }`}
            />

            <div className="w-full max-w-7xl mx-auto mt-10">
                {activeTab === "newRequest" && (
                    <>
                        <CustomStepper
                            currentStep={currentStep}
                            steps={steps}
                        />
                        <hr className="text-gray-300 mr-10 ml-10" />
                    </>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab + currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            {activeTab === "newRequest" && (
                <StepperNavigation
                    currentStep={currentStep}
                    handlePrevious={() => setCurrentStep((s) => s - 1)}
                    handleNext={() => setCurrentStep((s) => s + 1)}
                />
            )}
        </div>
    );
};

export default EntryPage;
