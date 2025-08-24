import React, { useState, useMemo } from "react";
import getStatusStyle from "./utils/getStatusStyle";

const RequestDocuments = () => {
    const documents = ["Certification", "Form 137", "Diploma", "Transcript"];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const documentStatuses = {
        Certification: [
            {
                name: "Certificate of Enrollment",
                status: "Processing",
                payments: "Paid Online",
            },
            {
                name: "Certificate of Enrollment",
                status: "Waiting",
                payments: "Cash",
            },
            {
                name: "Certificate of Enrollment",
                status: "Ready",
                payments: "Cash",
            },
            {
                name: "Certificate of Enrollment",
                status: "Processing",
                payments: "Paid Online",
            },
            {
                name: "Transcript of Records",
                status: "Ready",
                payments: "Paid Online",
            },
            {
                name: "Certificate of Good Moral",
                status: "Waiting",
                payments: "Cash",
            },
            {
                name: "Certificate of Good Moral",
                status: "Waiting",
                payments: "Cash",
            },
        ],
        "Form 137": [
            { name: "Form 137-A", status: "Processing", payments: "Cash" },
        ],
        Diploma: [
            {
                name: "College Diploma",
                status: "Ready",
                payments: "Pay Online",
            },
        ],
        Transcript: [
            { name: "TOR - Full Copy", status: "Waiting", payments: "Cash" },
        ],
    };

    const [selectedType, setSelectedType] = useState(documents[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Filtering
    const filteredDocs = useMemo(() => {
        return (
            documentStatuses[selectedType]?.filter((doc) =>
                doc.name.toLowerCase().includes(search.toLowerCase())
            ) || []
        );
    }, [documentStatuses, selectedType, search]);

    // Sorting
    const sortedDocs = useMemo(() => {
        if (!sortConfig.key) return filteredDocs;
        return [...filteredDocs].sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];
            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredDocs, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedDocs.length / rowsPerPage);
    const paginatedDocs = sortedDocs.slice(
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
        <div className="bg-white rounded-xl shadow-sm w-full card-item">
            <h2 className="font-semibold header-text border-b border-[#e3f0eb]">
                Request Documents
            </h2>
            <div className="header-body-content p-4">
                {/* Dropdown */}
                <div className="w-full mb-4 relative">
                    <div
                        className="border-1 border-[#3f634d] px-4 py-2 rounded-md cursor-pointer flex justify-between items-center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="text-md text-[#183b56] font-[300]">
                            {selectedType}
                        </span>
                        <svg
                            className={`w-4 h-4 ml-2 transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M19 9l-7 7-7-7"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    {isOpen && (
                        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {documents.map((doc, idx) => (
                                <li
                                    key={idx}
                                    className={`px-4 py-3 cursor-pointer hover:bg-[#f4f4f4] ${
                                        selectedType === doc
                                            ? "text-green-500 bg-[rgba(36,64,52,.03)]"
                                            : "text-[#183b56]"
                                    }`}
                                    onClick={() => {
                                        setSelectedType(doc);
                                        setIsOpen(false);
                                        setSearch("");
                                        setCurrentPage(1);
                                    }}
                                >
                                    {doc}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="border px-3 py-2 rounded-lg w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* Table */}
                <table className="min-w-full border border-gray-200 divide-y divide-gray-100 rounded-lg bg-white shadow-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Document{" "}
                                {sortConfig.key === "name" &&
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
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDocs.length > 0 ? (
                            paginatedDocs.map((doc, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-[#f9fafb] transition duration-300"
                                >
                                    <td className="px-4 py-2">{doc.name}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                doc.status
                                            )}`}
                                        >
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {doc.payments}
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

                {/* Pagination */}
                <div className="flex justify-between items-center mt-20 text-sm">
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
                                currentPage === totalPages || totalPages === 0
                            }
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDocuments;
