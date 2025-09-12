import React from "react";
import { Stepper, Step } from "react-form-stepper";

const CustomStepper = ({ currentStep, steps }) => {
    return (
        <Stepper
            activeStep={currentStep}
            styleConfig={{
                activeBgColor: "#03b335",
                activeTextColor: "#fff",
                completedBgColor: "#04882a",
                completedTextColor: "#fff",
                inactiveBgColor: "#ccc",
                inactiveTextColor: "#666",
                size: "2.2em",
                circleFontSize: "1rem",
                labelFontSize: "1rem",
                borderRadius: "50%",
                fontWeight: "500",
            }}
        >
            {steps.map((label, index) => (
                <Step key={index} label={label}>
                    {index === 0 ? "" : index}{" "}
                </Step>
            ))}
        </Stepper>
    );
};

export default CustomStepper;
