import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getAllRequestReceipt } from "../../../services/request";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ranges = {
    "1d": 1,
    "1w": 7,
    "1m": 30,
    "6m": 182,
    "1y": 365,
};

const RequestDocumentsChart = () => {
    const [receipts, setReceipts] = useState([]);
    const [lineRange, setLineRange] = useState("1m");
    const [barRange, setBarRange] = useState("1m");

    useEffect(() => {
        const fetchData = async () => {
            setReceipts(await getAllRequestReceipt());
        };
        fetchData();
    }, []);

    const filterByRange = (rangeKey) => {
        return receipts.filter((doc) => {
            const docDate = new Date(doc.createdAt);
            const today = new Date();
            const diffDays = Math.floor(
                (today - docDate) / (1000 * 60 * 60 * 24)
            );
            return diffDays < ranges[rangeKey];
        });
    };

    const filteredLineReceipts = filterByRange(lineRange);

    const requestsByDate = filteredLineReceipts.reduce((acc, doc) => {
        const date = new Date(doc.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const lineData = {
        labels: Object.keys(requestsByDate),
        datasets: [
            {
                label: "Requests",
                data: Object.values(requestsByDate),
                borderColor: "#03b335",
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const chartArea = context.chart.chartArea;
                    if (!chartArea) return null;

                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.bottom,
                        0,
                        chartArea.top
                    );
                    gradient.addColorStop(0, "rgba(3, 179, 53, 0.1)");
                    gradient.addColorStop(1, "rgba(3, 179, 53, 0.8)");
                    return gradient;
                },
                tension: 0.5,
                fill: true,
                borderWidth: 1,
                pointBackgroundColor: "#10b981",
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Incoming Requests Over Time" },
        },
    };

    const filteredBarReceipts = filterByRange(barRange);

    const paymentCounts = filteredBarReceipts.reduce((acc, doc) => {
        const key =
            doc.payment_method === "cashier"
                ? doc.paid
                    ? "Cash"
                    : "Not yet paid"
                : "Online";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const barData = {
        labels: Object.keys(paymentCounts),
        datasets: [
            {
                label: "Payments",
                data: Object.values(paymentCounts),
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return null;

                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.bottom,
                        0,
                        chartArea.top
                    );
                    gradient.addColorStop(0, "rgba(211, 174, 10, 0.1)");
                    gradient.addColorStop(1, "rgba(211, 174, 10, 0.8)");
                    return gradient;
                },
                borderRadius: 4,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Requests by Payment" },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-sm w-full card-item flex flex-col p-6">
            <h2 className="font-semibold text-lg text-[#244034] mb-6">
                Request Documents Overview
            </h2>
            <hr className="h-1 text-gray-300" />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-end gap-1 mb-3">
                        {Object.keys(ranges).map((key) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <button
                                    key={key}
                                    onClick={() => setLineRange(key)}
                                    className={`px-3 py-1 rounded-xs text-xs font-medium ${
                                        lineRange === key
                                            ? "bg-[#03b335]/10 border border-[#03b335] text-[#03b335]"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {key}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    <Line data={lineData} options={lineOptions} />
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-end gap-1 mb-3">
                        {Object.keys(ranges).map((key) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <button
                                    key={key}
                                    onClick={() => setBarRange(key)}
                                    className={`px-3 py-1 rounded-xs text-xs font-medium ${
                                        barRange === key
                                            ? "bg-[#d3ae0a]/10 border border-[#d3ae0a] text-[#d3ae0a]"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {key}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
};

export default RequestDocumentsChart;
