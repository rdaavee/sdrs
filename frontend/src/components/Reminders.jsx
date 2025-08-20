import { IoNotificationsOutline } from "react-icons/io5";

const Reminders = () => {
    return (
        <div className="border border-gray-200 m-10 p-5 rounded-xs shadow-xs">
            <div className="flex items-center gap-2 text-xl text-gray-500">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <IoNotificationsOutline className="text-2xl text-gray-600" />
                </span>
                Reminders
            </div>
            <hr className="mt-4 mb-3 h-1 text-gray-300" />
            <ul className="list-disc ml-5 text-sm">
                <li>
                    To verify the identity, please present valid ID upon request
                    and upon claiming.
                </li>
                <li>
                    For representatives: present Letter of Authorization and
                    photocopy of valid ID of BOTH student/record-owner and
                    representative.
                </li>
                <li>
                    The University may withhold record of student who has
                    pending financial obligations to PHINMA-UPANG, or when
                    student has been charged with an official disciplinary
                    actions.
                </li>
                <li>
                    Documents not claimed{" "}
                    <strong className="fs-4">
                        <u>after sixty (60) days</u>
                    </strong>{" "}
                    will be destroyed. New request must be processed. Please
                    note due date/release date.
                </li>
                <li>
                    For requests, inquires and verification, you may email:{" "}
                    <strong className="fs-4">
                        <u>
                            <a
                                className="text-black"
                                href="https://up.phinma.edu.ph/contact-us/"
                            >
                                registrar.up@phinmaed.com
                            </a>
                        </u>
                    </strong>
                </li>
                <li>
                    Registrar's Office contact details:{" "}
                    <strong className="fs-4">
                        (075) 522-5635 local 113; or call Helpline:
                        0916-921-2125 / 0961-753-7369 / 0995-078-5660
                    </strong>
                </li>
            </ul>
        </div>
    );
};

export default Reminders;
