import { FaRegClock } from "react-icons/fa";

const OfficeHours = () => {
    return (
        <div className="border border-gray-300 m-4 p-5 rounded-xs shadow-md">
            <div className="flex items-center gap-2 text-xl text-gray-500">
                <FaRegClock /> Office Hours
            </div>
            <hr className="mt-3 h-1 text-gray-300" />
            <p>
                Monday to Friday <br />
                8:00 am to 5:00 pm
            </p>
        </div>
    );
};

export default OfficeHours;
