import React from "react";

const StatsCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-6 gap-10 py-4">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="dashboard-item shadow-[0_6px_6px_rgba(0,0,0,.02)] bg-white rounded-[30px] total-request flex items-start justify-between relative"
                >
                    <div className="flex flex-col items-start z-[9]">
                        <div className="text-5xl mb-1 font-semibold text-[#244034]">
                            {item.value}
                        </div>
                        <span className="text-lg font-[500] text-[rgba(0,0,0,.5)]">
                            {item.label}
                        </span>
                    </div>
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center z-[9]">
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
