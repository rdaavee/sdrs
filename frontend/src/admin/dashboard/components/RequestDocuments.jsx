import React, { useState, useEffect } from "react";
import getStatusStyle from "../utils/getStatusStyle";
import { getAllRequestReceipt } from "../../../services/request";

const RequestDocuments = () => {
    const [receipts, setReceipts] = useState([]);

    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setReceipts(await getAllRequestReceipt());
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm w-full card-item flex flex-col">
            <h2 className="font-semibold header-text border-b border-[#e3f0eb]">
                Request Documents
            </h2>
            <div className="header-body-content p-4 flex flex-col h-full">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="border px-3 py-2 rounded-lg w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />

                {/* Table */}
                <div className="flex-1">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-100 rounded-lg bg-white shadow-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    Full Name
                                    {sortConfig.key === "name" &&
                                        (sortConfig.direction === "asc"
                                            ? "▲"
                                            : "▼")}
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                    onClick={() => handleSort("status")}
                                >
                                    Status
                                    {sortConfig.key === "status" &&
                                        (sortConfig.direction === "asc"
                                            ? "▲"
                                            : "▼")}
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                    onClick={() => handleSort("payments")}
                                >
                                    Payment
                                    {sortConfig.key === "payments" &&
                                        (sortConfig.direction === "asc"
                                            ? "▲"
                                            : "▼")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.length > 0 ? (
                                receipts.map((doc, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-[#f9fafb] transition duration-300"
                                    >
                                        <td className="px-4 py-2">
                                            {doc.full_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                    doc.status
                                                )}`}
                                            >
                                                {doc.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    doc.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {doc.payment_method === "cashier"
                                                ? doc.paid
                                                    ? "Cash"
                                                    : "Not yet Paid"
                                                : "Online"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No documents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm">
                    {/* <span>
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <div className="space-x-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default RequestDocuments;
