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
} from "chart.js";
import { getAllRequestReceipt } from "../../../services/request";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RequestDocumentsChart = () => {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setReceipts(await getAllRequestReceipt());
        };
        fetchData();
    }, []);

    const requestsByDate = receipts.reduce((acc, doc) => {
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
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: "#10b981",
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "bottom" },
            title: { display: true, text: "Incoming Requests Over Time" },
        },
    };

    const paymentCounts = receipts.reduce((acc, doc) => {
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
                backgroundColor: "#3b82f6",
                borderRadius: 8,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow p-4">
                    <Line data={lineData} options={lineOptions} />
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
};

export default RequestDocumentsChart;
