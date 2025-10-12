import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRequestReceiptStats } from "../../../services/request";
import { MdOutlineCallReceived } from "react-icons/md";
import { FaClock, FaCog, FaCheckCircle } from "react-icons/fa";

const BASE_STATS_ICON = [
    { value: 0, label: "Requests", icon: MdOutlineCallReceived},
    { value: 0, label: "Pending", icon: FaClock},
    { value: 0, label: "Processing", icon: FaCog},
    { value: 0, label: "Ready", icon: FaCheckCircle},
];

const StatsCards = () => {
    const [stats, setStats] = useState(BASE_STATS_ICON);
    const navigate = useNavigate();

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
            {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        onClick={() => navigate("/pages/RequestList")}
                        className="dashboard-item shadow-[0_6px_6px_rgba(0,0,0,.02)] bg-white rounded-[30px] total-request flex items-start justify-between relative cursor-pointer"
                    >
                        <div className="flex flex-col items-start z-[9]">
                            <div className="text-5xl mb-1 font-semibold text-[#244034]">
                                {item.value}
                            </div>
                            <span className="text-lg mt-1 font-[500] text-[rgba(0,0,0,.5)]">
                                {item.label}
                            </span>
                        </div>
                        <div
                            className={`rounded-full w-16 h-16 flex items-center justify-center z-[9] animate-pulse ${
                                item.label === "Requests" ? "bg-purple-50" :
                                item.label === "Pending" ? "bg-blue-50" :
                                item.label === "Processing" ? "bg-purple-50" :
                                "bg-green-50"
                            }`}
                            >
                            <Icon
                                className={`w-7 h-7 ${
                                item.label === "Requests" ? "text-purple-500" :
                                item.label === "Pending" ? "text-blue-200" :
                                item.label === "Processing" ? "text-amber-500" :
                                "text-green-500"
                                }`}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
