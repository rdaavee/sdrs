import React, { useState, useMemo } from "react";

const getStatusStyle = (status) => {
    switch (status) {
        case "Processing":
            return "bg-yellow-100 text-yellow-700";
        case "Ready":
            return "bg-green-100 text-green-700";
        case "Waiting":
            return "bg-gray-200 text-gray-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const RequestList = () => {
    const [expandedRows, setExpandedRows] = useState({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requests = [
        {
            name: "John Doe",
            email: "john@example.com",
            document: ["Transcript", "Diploma"],
            status: "Processing",
            payments: "Paid Online",
            quantity: 2,
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            document: ["Diploma"],
            status: "Ready",
            payments: "Cash",
            quantity: 1,
        },
        {
            name: "Alex Johnson",
            email: "alex@example.com",
            document: ["Form 137", "Certification", "Diploma"],
            status: "Waiting",
            payments: "Cash",
            quantity: 3,
        },
        {
            name: "Emily Brown",
            email: "emily@example.com",
            document: ["Certification"],
            status: "Ready",
            payments: "Paid Online",
            quantity: 1,
        },
        {
            name: "Michael Lee",
            email: "michael@example.com",
            document: ["Transcript", "Form 137"],
            status: "Processing",
            payments: "Cash",
            quantity: 2,
        },
    ];

    const toggleExpand = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 13;

    const filteredRequests = useMemo(() => {
        return requests.filter(
            (req) =>
                req.name.toLowerCase().includes(search.toLowerCase()) ||
                req.email.toLowerCase().includes(search.toLowerCase()) ||
                req.document.toLowerCase().includes(search.toLowerCase()) ||
                req.payments.toLowerCase().includes(search.toLowerCase())
        );
    }, [requests, search]);

    const sortedRequests = useMemo(() => {
        if (!sortConfig.key) return filteredRequests;
        return [...filteredRequests].sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];
            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredRequests, sortConfig]);

    const totalPages = Math.ceil(sortedRequests.length / rowsPerPage);
    const paginatedRequests = sortedRequests.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-3xl font-[500] text-[#244034] py-2">
                Request List
            </h2>

            <div className="bg-white rounded-xl shadow-sm w-full flex flex-col">
                <div className="p-4 flex flex-col h-full">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by name, email, document or payment..."
                        className="border px-3 py-2 rounded-lg w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
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
                                        Name{" "}
                                        {sortConfig.key === "name" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort("email")}
                                    >
                                        Email{" "}
                                        {sortConfig.key === "email" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort("document")}
                                    >
                                        Document{" "}
                                        {sortConfig.key === "document" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort("quantity")}
                                    >
                                        Quantity{" "}
                                        {sortConfig.key === "quantity" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort("payments")}
                                    >
                                        Payment{" "}
                                        {sortConfig.key === "payments" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status{" "}
                                        {sortConfig.key === "status" &&
                                            (sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRequests.length > 0 ? (
                                    paginatedRequests.map((req, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-[#f9fafb] transition duration-300"
                                        >
                                            <td className="px-4 py-2">
                                                {req.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {req.email}
                                            </td>
                                            <td className="px-4 py-2">
                                                {Array.isArray(req.document) ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(expandedRows[idx]
                                                            ? req.document
                                                            : req.document.slice(0,2)
                                                        ).map((doc, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                            >
                                                                {doc}
                                                            </span>
                                                        ))}
                                                        {req.document.length >
                                                            2 && (
                                                            <span
                                                                onClick={() =>
                                                                    toggleExpand(
                                                                        idx
                                                                    )
                                                                }
                                                                className="text-blue-600 text-xs cursor-pointer"
                                                            >
                                                                {
                                                                expandedRows[idx]
                                                                    ? "Show less"
                                                                    : `+${req.document.length - 2} more`
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    req.document
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {req.quantity}
                                            </td>
                                            <td className="px-4 py-2">
                                                {req.payments}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                        req.status
                                                    )}`}
                                                >
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6 text-sm">
                        <span>
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
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="px-3 py-1 border rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestList;
