import { FaRegBell } from "react-icons/fa";

const Reminders = () => {
    return (
        <div className="border border-gray-300 m-4 p-5 rounded-xs shadow-md">
            <div className="flex items-center gap-2 text-xl text-gray-500">
                <FaRegBell /> Reminders
            </div>
            <hr className="mt-3 h-1 text-gray-300" />
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
