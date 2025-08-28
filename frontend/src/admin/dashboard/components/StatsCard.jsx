import React, { useEffect, useState } from "react";
import userIcon from "../../../assets/svgs/usericon.svg";
import { getAllRequestReceiptStats } from "../../../services/request";

const BASE_STATS_ICON = [
    { value: 0, label: "Requests", icon: userIcon },
    { value: 0, label: "Pending", icon: userIcon },
    { value: 0, label: "Processing", icon: userIcon },
    { value: 0, label: "Ready", icon: userIcon },
];

const StatsCards = () => {
    const [stats, setStats] = useState(BASE_STATS_ICON);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllRequestReceiptStats();
            if (data && typeof data === "object") {
                const updated = BASE_STATS_ICON.map((item) => {
                    let value = 0;
                    if (item.label === "Requests") value = data.active ?? 0;
                    if (item.label === "Pending") value = data.waiting ?? 0;
                    if (item.label === "Processing")
                        value = data.processing ?? 0;
                    if (item.label === "Ready") value = data.ready ?? 0;
                    return { ...item, value };
                });
                setStats(updated);
            }
        };

        fetchData();
    }, []);
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
