import React, { useState, useEffect } from "react";
import { getAllRequestReceipt } from "../../services/request";

const getStatusStyle = (status) => {
    switch (status) {
        case "processing":
            return "bg-yellow-100 text-yellow-700";
        case "ready":
            return "bg-green-100 text-green-700";
        case "waiting":
            return "bg-gray-200 text-gray-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const RequestList = () => {
    const [expandedRows, setExpandedRows] = useState({});

    //

    const [receipts, setReceipts] = useState([]);

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
    // const [currentPage, setCurrentPage] = useState(1);
    // const rowsPerPage = 13;

    // const filteredRequests = useMemo(() => {
    //     return requests.filter(
    //         (req) =>
    //             req.name.toLowerCase().includes(search.toLowerCase()) ||
    //             req.email.toLowerCase().includes(search.toLowerCase()) ||
    //             req.document.toLowerCase().includes(search.toLowerCase()) ||
    //             req.payments.toLowerCase().includes(search.toLowerCase())
    //     );
    // }, [requests, search]);

    // const sortedRequests = useMemo(() => {
    //     if (!sortConfig.key) return filteredRequests;
    //     return [...filteredRequests].sort((a, b) => {
    //         const valueA = a[sortConfig.key];
    //         const valueB = b[sortConfig.key];
    //         if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    //         if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    //         return 0;
    //     });
    // }, [filteredRequests, sortConfig]);

    // const totalPages = Math.ceil(sortedRequests.length / rowsPerPage);
    // const paginatedRequests = sortedRequests.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // );

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllRequestReceipt();
            const normalized = Array.isArray(data)
                ? data.map((item) => {
                      let documentsArray = [];
                      const documents = item.requested_documents;

                      if (Array.isArray(documents)) {
                          documentsArray = documents;
                      } else if (typeof documents === "string") {
                          const str = documents.trim();
                          try {
                              const parsed = JSON.parse(str);
                              if (Array.isArray(parsed)) {
                                  documentsArray = parsed;
                              } else if (typeof parsed === "string") {
                                  documentsArray = [parsed];
                              }
                          } catch {
                              if (str.includes(",")) {
                                  documentsArray = str
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean);
                              } else if (str.length > 0) {
                                  documentsArray = [str];
                              }
                          }
                      }

                      return {
                          ...item,
                          requested_documents: documentsArray,
                      };
                  })
                : [];

            setReceipts(normalized);
        };
        fetchData();
    }, []);
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
                            // setCurrentPage(1);
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
                                {receipts.length > 0 ? (
                                    receipts.map((req, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-[#f9fafb] transition duration-300"
                                        >
                                            <td className="px-4 py-2">
                                                {req.full_name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {req.email_address}
                                            </td>
                                            <td className="px-4 py-2">
                                                {Array.isArray(
                                                    req.requested_documents
                                                ) ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(expandedRows[idx]
                                                            ? req.requested_documents
                                                            : req.requested_documents.slice(
                                                                  0,
                                                                  2
                                                              )
                                                        ).map((doc, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                            >
                                                                {doc}
                                                            </span>
                                                        ))}
                                                        {req.requested_documents
                                                            .length > 2 && (
                                                            <span
                                                                onClick={() =>
                                                                    toggleExpand(
                                                                        idx
                                                                    )
                                                                }
                                                                className="text-blue-600 text-xs cursor-pointer"
                                                            >
                                                                {expandedRows[
                                                                    idx
                                                                ]
                                                                    ? "Show less"
                                                                    : `+${
                                                                          req
                                                                              .requested_documents
                                                                              .length -
                                                                          2
                                                                      } more`}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    req.requested_documents
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {req.requested_documents.length}
                                            </td>
                                            <td className="px-4 py-2">
                                                {req.payment_method
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    req.payment_method.slice(1)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                        req.status
                                                    )}`}
                                                >
                                                    {req.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        req.status.slice(1)}
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
                    {/* <div className="flex justify-between items-center mt-6 text-sm">
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
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default RequestList;
