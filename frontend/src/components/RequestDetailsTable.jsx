import { useState, useEffect } from "react";
import { IoInformation } from "react-icons/io5";

const RequestDetailsTable = ({ copies, setCopies, dataForm, setDataForm }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch("http://localhost:3000/documents");
                const data = await res.json();
                // only include active documents
                const activeDocs = data.filter((doc) => doc.active);
                setDocuments(activeDocs);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);

    const categories = documents.reduce((acc, doc) => {
        if (!acc[doc.category]) acc[doc.category] = [];
        acc[doc.category].push(doc);
        return acc;
    }, {});

    const [selectedCertificates, setSelectedCertificates] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState({
        diploma: false,
        form137: false,
        registrationForm: false,
        tor: false,
    });
    const [currentSelect, setCurrentSelect] = useState("");
    const [selectedDiploma, setSelectedDiploma] = useState("");
    const [selectedForm137, setSelectedForm137] = useState("");
    const [selectedTranscript, setSelectedTranscript] = useState("");

    useEffect(() => {
        if (
            dataForm.requested_documents &&
            dataForm.requested_documents.length > 0
        ) {
            const newSelectedCertificates = [];
            const newSelectedDocuments = {
                diploma: false,
                form137: false,
                registrationForm: false,
                tor: false,
            };
            const newCopies = { ...copies };

            dataForm.requested_documents.forEach(([docName, quantity]) => {
                const doc = documents.find((d) => d.name === docName);
                if (!doc) return;

                if (doc.category === "certificate") {
                    newSelectedCertificates.push(docName);
                    newCopies[docName] = quantity;
                } else if (doc.category === "diploma") {
                    newSelectedDocuments.diploma = true;
                    newCopies.diploma = quantity;
                    setSelectedDiploma(docName);
                } else if (doc.category === "form137") {
                    newSelectedDocuments.form137 = true;
                    newCopies.form137 = quantity;
                    setSelectedForm137(docName);
                } else if (doc.category === "transcript") {
                    newSelectedDocuments.tor = true;
                    newCopies.tor = quantity;
                    setSelectedTranscript(docName);
                } else if (docName === "Copy of Grades") {
                    newSelectedDocuments.registrationForm = true;
                    newCopies.registrationForm = quantity;
                }
            });

            setSelectedCertificates(newSelectedCertificates);
            setSelectedDocuments(newSelectedDocuments);
            setCopies(newCopies);
        }
    }, [documents]);

    useEffect(() => {
        if (
            categories["diploma"] &&
            categories["diploma"].length > 0 &&
            !selectedDiploma
        ) {
            setSelectedDiploma(categories["diploma"][0].name);
        }
        if (
            categories["form137"] &&
            categories["form137"].length > 0 &&
            !selectedForm137
        ) {
            setSelectedForm137(categories["form137"][0].name);
        }
        if (
            categories["transcript"] &&
            categories["transcript"].length > 0 &&
            !selectedTranscript
        ) {
            setSelectedTranscript(categories["transcript"][0].name);
        }
    }, [categories]);


    // Update requested docs
    useEffect(() => {
        const requestedDocs = [];

        selectedCertificates.forEach((cert) => {
            if (copies[cert] && copies[cert] > 0) {
                requestedDocs.push([cert, copies[cert]]);
            }
        });

        if (selectedDocuments.diploma && copies.diploma > 0) {
            requestedDocs.push([selectedDiploma, copies.diploma]);
        }
        if (selectedDocuments.form137 && copies.form137 > 0) {
            requestedDocs.push([selectedForm137, copies.form137]);
        }
        if (selectedDocuments.registrationForm && copies.registrationForm > 0) {
            requestedDocs.push(["Copy of Grades", copies.registrationForm]);
        }
        if (selectedDocuments.tor && copies.tor > 0) {
            requestedDocs.push([selectedTranscript, copies.tor]);
        }

        setDataForm((prev) => ({
            ...prev,
            requested_documents: requestedDocs,
        }));
    }, [
        selectedCertificates,
        selectedDocuments,
        copies,
        selectedDiploma,
        selectedForm137,
        selectedTranscript,
        setDataForm,
    ]);

    const handleCertificateChange = (e) => {
        const value = e.target.value;
        if (value && !selectedCertificates.includes(value)) {
            setSelectedCertificates([...selectedCertificates, value]);
            setCopies({ ...copies, [value]: 1 });
            setCurrentSelect("");
        }
    };

    const handleCheckboxChange = (documentType) => {
        setSelectedDocuments((prev) => ({
            ...prev,
            [documentType]: !prev[documentType],
        }));
    };

    const getFee = (name) => {
        if (!name) return 0;
        const doc = documents.find((d) => d.name === name);
        return doc ? doc.fee : 0;
    };


    return (
        <div>
            <div>
                <div className="mb-5 text-center space-y-0">
                    <p className="text-2xl font-bold tracking-tight">
                        University of Pangasinan
                    </p>
                    <p className="text-sm font-medium">
                        List of Registrar's Fee
                    </p>
                    <hr className="text-gray-300 m-7" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 space-y-2 sm:space-y-0 sm:space-x-2">
                    <p className="text-sm text-gray-500 leading-snug text-justify">
                        Choose the documents and number of copies. Make sure to
                        double-check the fees and remarks for each item before
                        proceeding.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto w-full text-[10px] sm:text-xs md:text-sm lg:text-base">
                <table className="min-w-max w-full border-collapse border border-gray-300 text-xs sm:text-sm text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2"></th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">
                                Copies
                            </th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">
                                Document Request
                            </th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">
                                Fee
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dropdown Certificates */}
                        <tr>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                            <td className="text-center border">
                                <select
                                    value={currentSelect}
                                    onChange={handleCertificateChange}
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                >
                                    {categories["certificate"] &&
                                    categories["certificate"].length > 0 ? (
                                        <>
                                            <option value="">
                                                Select Certificate
                                            </option>
                                            {categories["certificate"]
                                                .filter(
                                                    (opt) =>
                                                        !selectedCertificates.includes(
                                                            opt.name
                                                        )
                                                )
                                                .map((opt) => (
                                                    <option
                                                        key={opt._id}
                                                        value={
                                                            opt.active
                                                                ? opt.name
                                                                : ""
                                                        }
                                                        disabled={!opt.active}
                                                        className={
                                                            !opt.active
                                                                ? "text-gray-400 italic"
                                                                : ""
                                                        }
                                                    >
                                                        {opt.name}{" "}
                                                        {!opt.active &&
                                                            "(Not Available)"}
                                                    </option>
                                                ))}
                                        </>
                                    ) : (
                                        <option value="" disabled>
                                            No certificates available
                                        </option>
                                    )}
                                </select>
                            </td>
                            <td className="border p-2"></td>
                        </tr>

                        {/* Selected Certificates */}
                        {selectedCertificates.map((cert) => (
                            <tr key={cert}>
                                <td className="border p-2">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={() => {
                                            setSelectedCertificates((prev) =>
                                                prev.filter((c) => c !== cert)
                                            );
                                            const updatedCopies = { ...copies };
                                            delete updatedCopies[cert];
                                            setCopies(updatedCopies);
                                        }}
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={copies[cert] || 0}
                                        onChange={(e) =>
                                            setCopies({
                                                ...copies,
                                                [cert]: Number(e.target.value),
                                            })
                                        }
                                        className="w-16 text-center border-none rounded"
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    {cert}
                                </td>
                                <td className="border p-2">
                                    {(
                                        getFee(cert) * (copies[cert] || 0)
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {/* Diploma */}
                        <tr>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.diploma}
                                    onChange={() =>
                                        handleCheckboxChange("diploma")
                                    }
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={copies.diploma || 0}
                                    onChange={(e) =>
                                        setCopies({
                                            ...copies,
                                            diploma: Number(e.target.value),
                                        })
                                    }
                                    className="w-16 text-center border-none rounded"
                                />
                            </td>
                            <td className="text-center border">
                                <select
                                    value={selectedDiploma}
                                    onChange={(e) =>
                                        setSelectedDiploma(e.target.value)
                                    }
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                    disabled={
                                        !(
                                            categories["diploma"] &&
                                            categories["diploma"].length > 0
                                        )
                                    }
                                >
                                    {categories["diploma"] &&
                                    categories["diploma"].length > 0 ? (
                                        categories["diploma"].map((opt) => (
                                            <option
                                                key={opt._id}
                                                value={opt.name}
                                            >
                                                {opt.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option
                                            disabled
                                            className="text-gray-400 italic"
                                        >
                                            Not Available
                                        </option>
                                    )}
                                </select>
                            </td>

                            <td className="border p-2">
                                {(
                                    getFee(selectedDiploma) *
                                    (copies.diploma || 0)
                                ).toFixed(2)}
                            </td>
                        </tr>

                        {/* Form 137 */}
                        <tr>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.form137}
                                    onChange={() =>
                                        handleCheckboxChange("form137")
                                    }
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={copies.form137 || 0}
                                    onChange={(e) =>
                                        setCopies({
                                            ...copies,
                                            form137: Number(e.target.value),
                                        })
                                    }
                                    className="w-16 text-center border-none rounded"
                                />
                            </td>
                            <td className="text-center border">
                                <select
                                    value={selectedForm137}
                                    onChange={(e) =>
                                        setSelectedForm137(e.target.value)
                                    }
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                    disabled={
                                        !(
                                            categories["form137"] &&
                                            categories["form137"].length > 0
                                        )
                                    }
                                >
                                    {categories["form137"] &&
                                    categories["form137"].length > 0 ? (
                                        categories["form137"].map((opt) => (
                                            <option
                                                key={opt._id}
                                                value={opt.name}
                                            >
                                                {opt.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option
                                            disabled
                                            className="text-gray-400 italic"
                                        >
                                            Not Available
                                        </option>
                                    )}
                                </select>
                            </td>

                            <td className="border p-2">
                                {(
                                    getFee(selectedForm137) *
                                    (copies.form137 || 0)
                                ).toFixed(2)}
                            </td>
                        </tr>

                        {/* Copy of Grades (fixed fee) */}
                        <tr>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.registrationForm}
                                    onChange={() =>
                                        handleCheckboxChange("registrationForm")
                                    }
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={copies.registrationForm || 0}
                                    onChange={(e) =>
                                        setCopies({
                                            ...copies,
                                            registrationForm: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-16 text-center border-none rounded"
                                />
                            </td>
                            <td className="border p-2 text-center">
                                Copy of Grades
                            </td>
                            <td className="border p-2">
                                {(50 * (copies.registrationForm || 0)).toFixed(
                                    2
                                )}
                            </td>
                        </tr>

                        {/* Transcript */}
                        <tr>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.tor}
                                    onChange={() => handleCheckboxChange("tor")}
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={copies.tor || 0}
                                    onChange={(e) =>
                                        setCopies({
                                            ...copies,
                                            tor: Number(e.target.value),
                                        })
                                    }
                                    className="w-16 text-center border-none rounded"
                                />
                            </td>
                            <td className="text-center border">
                                <select
                                    value={selectedTranscript}
                                    onChange={(e) =>
                                        setSelectedTranscript(e.target.value)
                                    }
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                    disabled={
                                        !(
                                            categories["transcript"] &&
                                            categories["transcript"].length > 0
                                        )
                                    }
                                >
                                    {categories["transcript"] &&
                                    categories["transcript"].length > 0 ? (
                                        categories["transcript"].map((opt) => (
                                            <option
                                                key={opt._id}
                                                value={opt.name}
                                            >
                                                {opt.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option
                                            disabled
                                            className="text-gray-400 italic"
                                        >
                                            Not Available
                                        </option>
                                    )}
                                </select>
                            </td>

                            <td className="border p-2">
                                {(
                                    getFee(selectedTranscript) *
                                    (copies.tor || 0)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestDetailsTable;
