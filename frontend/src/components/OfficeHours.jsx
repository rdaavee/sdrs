import { IoTimeOutline } from "react-icons/io5";

const OfficeHours = () => {
    return (
        <div className="border border-gray-200 m-10 p-5 rounded-xs shadow-xs">
            <div className="flex items-center gap-2 text-xl text-[#8dcbd8]">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8dcbd8]/20">
                    <IoTimeOutline className="text-2xl text-[#8dcbd8]" />
                </span>
                Office Hours
            </div>
            <hr className="mt-4 mb-3 h-1 text-gray-300" />
            <p>
                Monday to Friday <br />
                8:00 am to 5:00 pm
            </p>
        </div>
    );
};

export default OfficeHours;
