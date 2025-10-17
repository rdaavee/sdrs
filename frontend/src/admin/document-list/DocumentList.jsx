import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDoc, setNewDoc] = useState({
        name: "",
        category: "",
        fee: 0,
        active: true,
    });
    const [editDoc, setEditDoc] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    //fetch all docs
    const fetchDocuments = async () => {
        try {
            const res = await fetch("http://localhost:3000/documents");
            const data = await res.json();
            setDocuments(Array.isArray(data) ? data : data?.documents || []);
        } catch (error) {
            console.error("Error fetching documents:", error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    //create
    const createDocument = async () => {
        if (!newDoc.name || !newDoc.category || !newDoc.fee) return;
        try {
            const res = await fetch("http://localhost:3000/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoc),
            });
            if (!res.ok) throw new Error("Failed to create");
            await fetchDocuments();
            setNewDoc({ name: "", category: "", fee: 0, active: true });
        } catch (error) {
            console.error(error);
        }
    };

    //update
    const updateDocument = async (updatedDoc) => {
        try {
            const res = await fetch(
                `http://localhost:3000/documents/${updatedDoc._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedDoc),
                }
            );
            if (!res.ok) throw new Error("Failed to update");
            await fetchDocuments();
            setIsEditOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    //delete
    const deleteDocument = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/documents/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            await fetchDocuments();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Filters
    const filteredDocs = documents.filter((doc) => {
        const matchesSearch =
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.category.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            statusFilter === "all" ||
            (statusFilter === "available" && doc.active) ||
            (statusFilter === "unavailable" && !doc.active);

        return matchesSearch && matchesFilter;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-3xl font-[500] text-[#244034] py-2">
                Document List
            </h2>

            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border-b">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={newDoc.name}
                        onChange={(e) =>
                            setNewDoc({ ...newDoc, name: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={newDoc.category}
                        onChange={(e) =>
                            setNewDoc({ ...newDoc, category: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Fee"
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={newDoc.fee}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setNewDoc({ ...newDoc, fee: value });
                        }}
                    />

                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={createDocument}
                    >
                        Add Document
                    </button>
                </div>

                <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="border px-3 py-2 rounded-lg w-full flex-1 md:w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Category
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Fee
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No documents found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocs.map((doc) => (
                                        <tr
                                            key={doc._id}
                                            className="bg-white hover:bg-gray-100 transition"
                                        >
                                            <td className="px-4 py-2">
                                                {doc.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {doc.category}
                                            </td>
                                            <td className="px-4 py-2">
                                                ₱{doc.fee}
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    className={`border px-3 py-1 rounded-full text-xs font-semibold ${
                                                        doc.active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                    value={
                                                        doc.active
                                                            ? "available"
                                                            : "unavailable"
                                                    }
                                                    onChange={(e) =>
                                                        updateDocument({
                                                            ...doc,
                                                            active:
                                                                e.target
                                                                    .value ===
                                                                "available",
                                                        })
                                                    }
                                                >
                                                    <option value="available">
                                                        Available
                                                    </option>
                                                    <option value="unavailable">
                                                        Unavailable
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 space-x-3">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => {
                                                        setEditDoc(doc);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() =>
                                                        deleteDocument(doc._id)
                                                    }
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isEditOpen && editDoc && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
                        <div className="bg-white border-t-2 border-t-green-500 rounded-2xl shadow-xs p-6 max-w-sm w-full mx-auto outline-none flex flex-col">
                            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
                                Edit Document
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editDoc.name}
                                        onChange={(e) =>
                                            setEditDoc({
                                                ...editDoc,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editDoc.category}
                                        onChange={(e) =>
                                            setEditDoc({
                                                ...editDoc,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Fee
                                    </label>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editDoc.fee}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setEditDoc({
                                                ...editDoc,
                                                fee: value,
                                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-6 mt-6">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="text-[#2c2c50] hover:underline font-[500] text-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-[#03b335] hover:bg-[#218838] transition-colors duration-300 text-white px-8 py-2 rounded-lg text-lg font-[500]"
                                    onClick={() => updateDocument(editDoc)}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentList;
