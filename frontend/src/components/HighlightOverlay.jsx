import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HighlightOverlay = ({
    steps,
    currentStep,
    onNext,
    onClose,
    onFinish,
}) => {
    const [rect, setRect] = useState(null);
    const step = steps[currentStep];

    const smoothScrollTo = (targetY) => {
        const start = window.scrollY;
        const distance = targetY - start;
        const duration = 400;
        let startTime = null;

        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, start + distance * progress);
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (!step) return;
        let animationFrame;

        const updatePosition = () => {
            const el = document.querySelector(`[data-id="${step.targetId}"]`);
            if (!el) {
                animationFrame = requestAnimationFrame(updatePosition);
                return;
            }

            const r = el.getBoundingClientRect();
            const newRect = {
                top: r.top + window.scrollY,
                left: r.left + window.scrollX,
                width: r.width,
                height: r.height,
            };
            setRect(newRect);

            const targetY =
                newRect.top - window.innerHeight / 2 + newRect.height / 2;
            smoothScrollTo(targetY);
        };

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [step]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (!rect || !step) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <motion.div
                className="absolute border-4 border-green-400 rounded-xl shadow-lg pointer-events-none"
                layout
                style={{
                    top: rect.top - 8,
                    left: rect.left - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            />

            <motion.div
                className="absolute bg-white p-4 rounded-lg shadow-xl text-sm font-medium text-gray-700 max-w-sm"
                style={{
                    top: rect.top + rect.height + 16,
                    left: rect.left,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <p>{step.message}</p>
                <div className="flex gap-2 mt-3 justify-between">
                    {currentStep > 0 && (
                        <button
                            onClick={() => onNext(currentStep - 1)}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-black"
                        >
                            Back
                        </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={() => onNext(currentStep + 1)}
                            className="px-3 py-1 rounded bg-green-400 hover:bg-green-500 text-white font-semibold ml-auto"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                onFinish?.();
                                onClose();
                            }}
                            className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-semibold"
                        >
                            Done
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default HighlightOverlay;
