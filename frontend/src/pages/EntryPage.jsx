import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegFile, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

import OfficeHours from "../components/OfficeHours";
import Reminders from "../components/Reminders";
import RequestDetailsTable from "../components/RequestDetailsTable";
import SubmitReview from "../components/SubmitReview";
import StepperNavigation from "../components/StepperNavigation";
import CustomStepper from "../components/Stepper";
import RequestDetailsForm from "../components/RequestDetailsForm";
import TrackRequestContent from "../components/TrackRequestContent";
import PrivacyModal from "../components/PrivacyModal";
import HighlightOverlay from "../components/HighlightOverlay";

const EntryPage = () => {
    const firstLoad = useRef(true);

    const [showModal, setShowModal] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [currentHighlightStep, setCurrentHighlightStep] = useState(0);

    const highlightSteps = [
        {
            targetId: "newRequest",
            message: "Click here to start a new document request.",
        },
        {
            targetId: "requestTracker",
            message: "Click here to track your existing requests.",
        },
    ];

    const [dataForm, setDataForm] = useState({
        full_name: "",
        current_address: "",
        course: "",
        gender: "",
        birthday: "",
        contact_number: "",
        email_address: "",
        purpose_of_request: "",
        requested_documents: [],
        isValidEmail: false,
        verification_code: "",
        payment_method: "",
        paid: false,
    });

    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "newRequest";
    });

    const [currentStep, setCurrentStep] = useState(0);
    const steps = ["Welcome", "Request Details", "Submit"];

    const [copies, setCopies] = useState({
        authentication: 1,
        certification: 1,
        diploma: 1,
        form137: 1,
        registrationForm: 1,
        tor: 1,
    });

    const [trackingData, setTrackingData] = useState(() => {
        return {
            reference: localStorage.getItem("referenceNumber") || "",
            code: localStorage.getItem("trackingCode") || "",
        };
    });

    const handleTrackingUpdate = (ref, code) => {
        setTrackingData({ reference: ref, code });
        localStorage.setItem("referenceNumber", ref);
        localStorage.setItem("trackingCode", code);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTab", tab);
        if (tab === "requestTracker") setCurrentStep(0);
    };

    const validateForm = () => {
        if (currentStep === 1) {
            const {
                full_name,
                current_address,
                course,
                gender,
                birthday,
                contact_number,
                email_address,
                purpose_of_request,
                isValidEmail,
                requested_documents,
            } = dataForm;

            if (
                !full_name.trim() ||
                !current_address.trim() ||
                !course.trim() ||
                !gender.trim() ||
                !birthday.trim() ||
                !contact_number.trim() ||
                !email_address.trim() ||
                !purpose_of_request.trim() ||
                !isValidEmail ||
                !requested_documents ||
                requested_documents.length === 0
            ) {
                toast.error("Please fill out all required fields.");
                return false;
            }
            return true;
        }
        return true;
    };

    const handleInputChange = (key, value) => {
        setDataForm((prev) => ({ ...prev, [key]: value }));
    };

    const renderContent = () => {
        if (activeTab === "requestTracker") {
            return (
                <TrackRequestContent
                    reference={trackingData.reference}
                    code={trackingData.code}
                    onTrackingUpdate={handleTrackingUpdate}
                />
            );
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
                            dataForm={dataForm}
                            setDataForm={setDataForm}
                            setCopies={setCopies}
                        />
                        <hr className="mt-7 mb-7 text-gray-300" />
                        <RequestDetailsForm
                            dataForm={dataForm}
                            handleInputChange={handleInputChange}
                        />
                        <ToastContainer position="top-right" autoClose={1500} />
                    </div>
                );
            case 2:
                return (
                    <div className="m-10 p-6 border border-gray-300 rounded shadow-xs bg-white">
                        <h2 className="text-xl mb-4 text-gray-500">
                            Step 2 : PAYMENT / SUBMIT
                        </h2>
                        <hr className="m-7 text-gray-300" />
                        <SubmitReview
                            dataForm={dataForm}
                            setDataForm={setDataForm}
                            handleInputChange={handleInputChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const handleNext = () => {
        const ok = validateForm();
        if (ok) setCurrentStep((s) => s + 1);
    };

    // Show privacy modal on first load
    useEffect(() => {
        if (firstLoad.current) {
            const agreed = localStorage.getItem("privacyAgreed") === "true";
            const expiry = parseInt(
                localStorage.getItem("privacyExpiry") || "0",
                10
            );
            const now = Date.now();
            const isExpired = !expiry || now > expiry;

            if (isExpired || !agreed) {
                setShowModal(true);
            }

            firstLoad.current = false;
        }
    }, [activeTab]);

    // Lock scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [showModal]);

    return (
        <div className="page-container shadow-lg relative">
            <div>
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
                        onClick={() => handleTabChange("newRequest")}
                    >
                        <FaRegFile className="icon" /> New Request
                    </button>

                    <button
                        data-id="requestTracker"
                        className={`tab-button ${
                            activeTab === "requestTracker" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("requestTracker")}
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
                        handleNext={handleNext}
                        dataForm={dataForm}
                        canProceed={dataForm.confirm_information}
                        nextButtonId="nextButton"
                    />
                )}

                {/* Show highlight only after user agrees */}
                {showHighlight && (
                    <HighlightOverlay
                        steps={highlightSteps}
                        currentStep={currentHighlightStep}
                        onNext={setCurrentHighlightStep}
                        onClose={() => setShowHighlight(false)}
                        onFinish={() => {
                            setShowHighlight(false);
                            localStorage.setItem("hasSeenHighlight", "true");
                        }}
                    />
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <PrivacyModal
                        onAgree={() => {
                            const expiry = Date.now() + 15 * 60 * 1000;
                            localStorage.setItem("privacyAgreed", "true");
                            localStorage.setItem(
                                "privacyExpiry",
                                expiry.toString()
                            );

                            localStorage.removeItem("referenceNumber");
                            localStorage.removeItem("trackingCode");
                            setTrackingData({ reference: "", code: "" });
                            setShowModal(false);

                            // ✅ Only here we trigger highlights
                            setShowHighlight(true);

                            // Optional: handle expiry after 15 mins
                            setTimeout(() => {
                                const savedExpiry = parseInt(
                                    localStorage.getItem("privacyExpiry") ||
                                        "0",
                                    10
                                );
                                if (Date.now() > savedExpiry) {
                                    localStorage.removeItem("privacyAgreed");
                                    localStorage.removeItem("privacyExpiry");
                                    localStorage.removeItem("referenceNumber");
                                    localStorage.removeItem("trackingCode");
                                    setTrackingData({
                                        reference: "",
                                        code: "",
                                    });
                                    setShowModal(true);
                                }
                            }, 15 * 60 * 1000);
                        }}
                        onCancel={() => {
                            setShowModal(false);
                            // Do not trigger highlight on cancel
                            setTimeout(() => setShowModal(true), 1500);
                        }}
                        note="⚠️ Your agreement will expire in 15 minutes."
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EntryPage;
