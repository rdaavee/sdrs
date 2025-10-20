import React, { useState, useEffect } from "react";
import { PiExportLight } from "react-icons/pi";
import socket from "../../../socket";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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
        case "for-review":
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

    const [pendingStatus, setPendingStatus] = useState(null);
    const [pendingRequestId, setPendingRequestId] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusOrder = [
        "waiting",
        "accepted",
        "processing",
        "for-review",
        "ready",
        "released",
    ];

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

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const exportToExcel = () => {
        if (!receipts.length) return;

        const exportData = receipts.map((req) => ({
            "Reference #": req.reference_number,
            Email: req.email_address,
            "Full Name": req.full_name,
            "Student No.": req.student_number,
            Course: req.course,
            "Complete Address": req.current_address,
            "Contact Number": req.contact_number,
            Documents: req.requested_documents.join(", "),
            Quantity: req.requested_documents.length,
            Payment: req.payment_method,
            "Payment Status": req.paid ? "Paid" : "Not yet paid",
            "Date Requested": new Date(req.createdAt).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            ),
            Status: req.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(
            data,
            `Request_List_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
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
        "Staff Admin": ["waiting", "accepted", "ready", "released"],
        "Middle Admin": ["accepted", "processing", "for-review"],
        Moderator: ["for-review", "ready"],
        "Super Admin": [
            "waiting",
            "processing",
            "for-review",
            "ready",
            "released",
        ],
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

        return {
            ...item,
            requested_documents: documentsArray,
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userRole) return;
            const data = await getAllRequestReceipt(userRole);
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
    }, [userRole]);

    const filtered = receipts.filter((req) => {
        const query = search.toLowerCase();
        const matchesSearch =
            req.reference_number?.toLowerCase().includes(query) ||
            req.email_address?.toLowerCase().includes(query) ||
            req.requested_documents?.join(", ").toLowerCase().includes(query) ||
            req.payment_method?.toLowerCase().includes(query) ||
            req.status?.toLowerCase().includes(query);

        const normalizeStatus = (s = "") => s.toLowerCase().trim();
        const matchesStatus =
            !statusFilter ||
            normalizeStatus(req.status) === normalizeStatus(statusFilter);

        const matchesPayment =
            !paymentFilter ||
            req.payment_method.toLowerCase() === paymentFilter;

        const allowedStatuses = rolePermissions[userRole] || [];

        const matchesRole =
            userRole === "Super Admin"
                ? true
                : allowedStatuses.includes(req.status);

        return matchesSearch && matchesStatus && matchesPayment && matchesRole;
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
                            {rolePermissions[userRole]?.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </option>
                            ))}
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

                        <div className="flex justify-end">
                            <button
                                onClick={exportToExcel}
                                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition"
                            >
                                <PiExportLight className="text-xl" />
                            </button>
                        </div>
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
                                            onClick={() => openModal(req)}
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
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setPendingStatus(
                                                                        "accepted"
                                                                    );
                                                                    setPendingRequestId(
                                                                        req._id
                                                                    );
                                                                    setIsConfirmModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="px-3 py-1 rounded bg-green-100 text-green-700 text-xs cursor-pointer"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setPendingStatus(
                                                                        "rejected"
                                                                    );
                                                                    setPendingRequestId(
                                                                        req._id
                                                                    );
                                                                    setIsConfirmModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs cursor-pointer"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : req.status ===
                                                      "ready" ? (
                                                        <select
                                                            value={req.status}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                setPendingStatus(
                                                                    e.target
                                                                        .value
                                                                );
                                                                setPendingRequestId(
                                                                    req._id
                                                                );
                                                                setIsConfirmModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getStatusStyle(
                                                                req.status
                                                            )}`}
                                                        >
                                                            <option value="ready">
                                                                Ready
                                                            </option>
                                                            <option value="released">
                                                                Released
                                                            </option>
                                                        </select>
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
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            setPendingStatus(
                                                                e.target.value
                                                            );
                                                            setPendingRequestId(
                                                                req._id
                                                            );
                                                            setIsConfirmModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getStatusStyle(
                                                            req.status
                                                        )}`}
                                                    >
                                                        {rolePermissions[
                                                            userRole
                                                        ]
                                                            ?.filter(
                                                                (status) =>
                                                                    statusOrder.indexOf(
                                                                        status
                                                                    ) >=
                                                                    statusOrder.indexOf(
                                                                        req.status
                                                                    )
                                                            )
                                                            .map((status) => (
                                                                <option
                                                                    key={status}
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {status
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        status.slice(
                                                                            1
                                                                        )}
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

            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
                    <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-lg w-full mx-auto outline-none flex flex-col items-center text-center">
                        <h2 className="text-2xl font-semibold text-black mb-1">
                            Request Details
                        </h2>

                        <hr className="w-full border-t border-gray-200 my-4" />

                        <div className="text-gray-600 font-[300] text-sm w-full space-y-3">
                            <div className="flex justify-between">
                                <strong>Reference #</strong>
                                <span>{selectedRequest.reference_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Email</strong>
                                <span>{selectedRequest.email_address}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Documents</strong>
                                <span className="text-right">
                                    {selectedRequest.requested_documents.join(
                                        ", "
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Payment Method</strong>
                                <span>{selectedRequest.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <strong>Payment Status</strong>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        selectedRequest.paid
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {selectedRequest.paid
                                        ? "Paid"
                                        : "Not yet paid"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Full Name</strong>
                                <span>{selectedRequest.full_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Student No</strong>
                                <span>{selectedRequest.student_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Course</strong>
                                <span>{selectedRequest.course}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Current Address</strong>
                                <span>{selectedRequest.current_address}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Contact Number</strong>
                                <span>{selectedRequest.contact_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Purpose</strong>
                                <span>
                                    {selectedRequest.purpose_of_request}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Date Requested</strong>
                                <span>
                                    {new Date(
                                        selectedRequest.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <strong>Status</strong>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                        selectedRequest.status
                                    )}`}
                                >
                                    {selectedRequest.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        selectedRequest.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 mt-6">
                            <button
                                onClick={closeModal}
                                className="bg-[#03b335] hover:bg-[#218838] transition-colors duration-300 text-white px-5 py-2 rounded-lg text-sm outline-0"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Confirm Status Change
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Are you sure you want to change this request’s
                            status to{" "}
                            <span className="font-bold capitalize text-green-700">
                                {pendingStatus}
                            </span>
                            ?
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => {
                                    handleStatusChange(
                                        pendingRequestId,
                                        pendingStatus
                                    );
                                    setIsConfirmModalOpen(false);
                                    setPendingRequestId(null);
                                    setPendingStatus(null);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    setIsConfirmModalOpen(false);
                                    setPendingRequestId(null);
                                    setPendingStatus(null);
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestList;
