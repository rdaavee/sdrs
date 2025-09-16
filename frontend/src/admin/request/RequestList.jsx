import React, { useState, useEffect } from "react";
import socket from "../../../socket";

import {
    actionRequest,
    getAllRequestReceipt,
    updateRequestStatus,
} from "../../services/request";
import { cookies } from "../../services/admin";

const getStatusStyle = (status) => {
    switch (status) {
        case "processing":
            return "bg-yellow-100 text-yellow-700";
        case "ready":
            return "bg-green-100 text-green-700";
        case "waiting":
            return "bg-gray-100 text-gray-700";
        case "released":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const highlightMatch = (text, query) => {
    const safeText = String(text ?? "");
    if (!query) return safeText;
    const regex = new RegExp(`(${query})`, "gi");
    return safeText.split(regex).map((part, i) =>
        regex.test(part) ? (
            <span key={i} className="bg-black/4 font-semibold">
                {part}
            </span>
        ) : (
            part
        )
    );
};

const RequestList = () => {
    const [expandedRows, setExpandedRows] = useState({});
    const [receipts, setReceipts] = useState([]);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });
    const [userRole, setUserRole] = useState(null);

    const statusOrder = ["waiting", "processing", "ready", "released"];

    //pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 12;

    //filters
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");

    const toggleExpand = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            const dir =
                prev.key === key && prev.direction === "asc" ? "desc" : "asc";

            const get = (item) =>
                ({
                    name: item.reference_number?.toLowerCase() || "",
                    email: item.email_address?.toLowerCase() || "",
                    document: item.requested_documents?.join(", ") || "",
                    quantity: item.requested_documents?.length || 0,
                    payments: item.payment_method?.toLowerCase() || "",
                    status: item.status?.toLowerCase() || "",
                }[key]);

            setReceipts(
                [...receipts].sort((a, b) =>
                    get(a) > get(b)
                        ? dir === "asc"
                            ? 1
                            : -1
                        : get(a) < get(b)
                        ? dir === "asc"
                            ? -1
                            : 1
                        : 0
                )
            );

            return { key, direction: dir };
        });
    };

    const handleAction = async (id, action) => {
        try {
            const updatedRequest = await actionRequest(id, action);
            console.log("Updated request:", updatedRequest);
        } catch (error) {
            console.error("Action failed:", error.message);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setReceipts((prev) => {
                const currentReq = prev.find((r) => r._id === id);
                if (!currentReq) return prev;

                const currentIndex = statusOrder.indexOf(currentReq.status);
                const newIndex = statusOrder.indexOf(newStatus);

                // Prevent backward status change
                if (newIndex < currentIndex) {
                    console.warn("Backward status change is not allowed");
                    return prev;
                }

                updateRequestStatus(id, newStatus).then((data) => {
                    setReceipts((prev2) =>
                        prev2.map((req) =>
                            req._id === id ? formatData(data.request) : req
                        )
                    );
                });

                return prev;
            });
        } catch (err) {
            console.error("Error updating status:", err.message);
        }
    };

    const rolePermissions = {
        "Staff Admin": ["accepted", "rejected"],
        Moderator: ["waiting", "processing"],
        "Middle Admin": ["waiting", "processing", "ready"],
        "Super Admin": ["waiting", "processing", "ready", "released"],
    };

    useEffect(() => {
        setUserRole(cookies.get("role"));

        socket.on("requestUpdated", (data) => {
            setReceipts((prev) =>
                prev.map((req) =>
                    req._id === data._id ? formatData(data) : req
                )
            );
        });
    }, []);
    const formatData = (item) => {
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

        console.log("fjhdkfjhaskf", {
            ...item,
            requested_documents: documentsArray,
        });
        return {
            ...item,
            requested_documents: documentsArray,
        };
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

        // socket.on("requestUpdated", (updatedRequest) => {
        //     setReceipts((prev) =>
        //         prev.map((req) =>
        //             req._id === updatedRequest._id ? updatedRequest : req
        //         )
        //     );
        // });

        // return () => {
        //     socket.off("requestUpdated");
        // };
    }, []);

    //filter n search
    const filtered = receipts.filter((req) => {
        const query = search.toLowerCase();
        const matchesSearch =
            req.reference_number?.toLowerCase().includes(query) ||
            req.email_address?.toLowerCase().includes(query) ||
            req.requested_documents?.join(", ").toLowerCase().includes(query) ||
            req.payment_method?.toLowerCase().includes(query) ||
            req.status?.toLowerCase().includes(query);

        const matchesStatus =
            !statusFilter || req.status.toLowerCase() === statusFilter;
        const matchesPayment =
            !paymentFilter ||
            req.payment_method.toLowerCase() === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-3xl font-[500] text-[#244034] py-2">
                Request List
            </h2>

            <div className="bg-white rounded-xl shadow-sm w-full flex flex-col">
                <div className="p-4 flex flex-col h-full">
                    {/* Search + Filters */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />

                        {/* Status filter */}
                        <select
                            className="border px-3 py-2 rounded-lg text-sm"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready</option>
                            <option value="waiting">Waiting</option>
                        </select>

                        {/* Payment filter */}
                        <select
                            className="border px-3 py-2 rounded-lg text-sm"
                            value={paymentFilter}
                            onChange={(e) => {
                                setPaymentFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Payments</option>
                            <option value="cashier">Cash</option>
                            <option value="online">Online</option>
                        </select>
                    </div>
                    {/* Table */}
                    <div className="flex-1">
                        <table className="min-w-full border border-gray-200 divide-y divide-gray-100 rounded-lg bg-white shadow-xs">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        "reference #",
                                        "email",
                                        "document",
                                        "quantity",
                                        "payments",
                                        "status",
                                    ].map((col) => (
                                        <th
                                            key={col}
                                            className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                            onClick={() => handleSort(col)}
                                        >
                                            {col.charAt(0).toUpperCase() +
                                                col.slice(1)}{" "}
                                            {sortConfig.key === col &&
                                                (sortConfig.direction === "asc"
                                                    ? "▲"
                                                    : "▼")}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((req, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-[#f9fafb] transition duration-300"
                                        >
                                            <td className="px-4 py-2">
                                                {highlightMatch(
                                                    req.reference_number,
                                                    search
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {highlightMatch(
                                                    req.email_address,
                                                    search
                                                )}
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
                                                                {highlightMatch(
                                                                    doc,
                                                                    search
                                                                )}
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
                                                    highlightMatch(
                                                        req.requested_documents ||
                                                            "",
                                                        search
                                                    )
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {req.requested_documents.length}
                                            </td>
                                            <td className="px-4 py-2">
                                                {highlightMatch(
                                                    req.payment_method
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        req.payment_method.slice(
                                                            1
                                                        ),
                                                    search
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {userRole === "Staff Admin" ? (
                                                    req.status === "waiting" ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        req._id,
                                                                        "accepted"
                                                                    )
                                                                }
                                                                className="px-3 py-1 rounded bg-green-100 text-green-700 text-xs cursor-pointer"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        req._id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs cursor-pointer"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                                req.status
                                                            )}`}
                                                        >
                                                            {req.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                req.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    )
                                                ) : (
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getStatusStyle(req.status)}`}
                                                    >
                                                        {rolePermissions[userRole]
                                                            ?.filter(
                                                                (status) =>
                                                                    statusOrder.indexOf(status) >=
                                                                    statusOrder.indexOf(req.status)
                                                            )
                                                            .map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </option>
                                                            ))}
                                                    </select>
                                                )}
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
                    {totalPages > 1 && (
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded ${
                                        page === i + 1
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestList;
