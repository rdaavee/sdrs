export default function PaymentFailed() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-red-600">Payment Failed</h2>
            <p className="mt-2 text-gray-600">
                Your payment was not completed. Please try again.
            </p>
        </div>
    );
}
