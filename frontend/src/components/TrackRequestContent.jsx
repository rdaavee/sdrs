const TrackRequestContent = () => {
    return (
        <div className="space-y-6">
            {/* Info grid */}
            <div className="grid-item grid-container border border-gray-300 rounded shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Office Hours</h3>
                    <hr className="mb-2" />
                    <p>Monday to Friday</p>
                    <p>8:00 AM - 5:00 PM</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Contact Us</h3>
                    <hr className="mb-2" />
                    <p>Arellano Street, Dagupan City, 2400, Pangasinan</p>
                    <p>+63 995-078-5660</p>
                    <p>registrar.up@phinmaed.com</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Advisory</h3>
                    <hr className="mb-2" />
                    <p>
                        Your document request PIN (4 digit) together with the
                        REFERENCE NO. is now required for tracking. You can find
                        the PIN on the confirmation email sent to you. You can
                        ask the assistance of the Registration Services office
                        if you accidentally deleted the email.
                    </p>
                </div>
            </div>

            {/* Tracker form */}
            <div className="border m-4 border-gray-300 rounded shadow-md p-6">
                <p className="mb-2 text-gray-700 pText">
                    Enter your <strong>REFERENCE NUMBER</strong> and{" "}
                    <strong>CODE</strong> to track your request.
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Reference Number"
                        className="border border-gray-300 rounded px-3 py-2 flex-1"
                    />
                    <input
                        type="password"
                        placeholder="Enter Code"
                        className="border border-gray-300 rounded px-3 py-2 flex-1"
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Track
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackRequestContent;
