import { useState, useEffect } from "react";

const RequestDetailsTable = ({ copies, setCopies, setDataForm }) => {
    const certificateOptions = [
        "Certificate of Transfer Credentials",
        "Certification of Enrollment",
        "Certification of Graduation",
        "Certification of Units Earned",
        "Certification of Good Moral",
        "Certification of Weighted Average",
        "Certification-Med. of Instruction",
        "Certification - Letter of Acceptance",
        "Certification - Letter of Acceptance with SPA",
        "Certification - Course Description",
    ];

    const certificateFees = {
        "Certificate of Transfer Credentials": 120,
        "Certification of Enrollment": 50,
        "Certification of Graduation": 100,
        "Certification of Units Earned": 70,
        "Certification of Good Moral": 60,
        "Certification of Weighted Average": 80,
        "Certification-Med. of Instruction": 90,
        "Certification - Letter of Acceptance": 40,
        "Certification - Letter of Acceptance with SPA": 60,
        "Certification - Course Description": 55,
    };

    const [selectedCertificates, setSelectedCertificates] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState({
        diploma: false,
        form137: false,
        registrationForm: false,
        tor: false,
    });
    const [currentSelect, setCurrentSelect] = useState("");

    // Update requested docs
    useEffect(() => {
        const requestedDocs = [];

        selectedCertificates.forEach((cert) => {
            if (copies[cert] && copies[cert] > 0) {
                requestedDocs.push([cert, copies[cert]]);
            }
        });

        if (selectedDocuments.diploma && copies.diploma > 0) {
            requestedDocs.push(["Diploma", copies.diploma]);
        }
        if (selectedDocuments.form137 && copies.form137 > 0) {
            requestedDocs.push(["Form 137", copies.form137]);
        }
        if (selectedDocuments.registrationForm && copies.registrationForm > 0) {
            requestedDocs.push(["Copy of Grades", copies.registrationForm]);
        }
        if (selectedDocuments.tor && copies.tor > 0) {
            requestedDocs.push(["Transcript of Records", copies.tor]);
        }

        setDataForm((prev) => ({
            ...prev,
            requested_documents: requestedDocs,
        }));
    }, [selectedCertificates, selectedDocuments, copies, setDataForm]);

    const handleCertificateChange = (e) => {
        const value = e.target.value;
        if (value && !selectedCertificates.includes(value)) {
            setSelectedCertificates([...selectedCertificates, value]);
            setCopies({ ...copies, [value]: 1 }); // default 1 copy
            setCurrentSelect(""); // reset dropdown to placeholder
        }
    };

    const handleCheckboxChange = (documentType) => {
        setSelectedDocuments((prev) => ({
            ...prev,
            [documentType]: !prev[documentType],
        }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2"></th>
                        <th className="border p-2">Copies</th>
                        <th className="border p-2">Document Request</th>
                        <th className="border p-2">Fee</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="text-center">
                            <select
                                value={currentSelect}
                                onChange={handleCertificateChange}
                                className="appearance-auto border px-2 py-1 text-center"
                            >
                                <option value="" className="text-center">
                                    Select Certificate
                                </option>
                                {certificateOptions
                                    .filter(
                                        (opt) =>
                                            !selectedCertificates.includes(opt)
                                    )
                                    .map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                            </select>
                        </td>
                        <td className="border p-2"></td>
                    </tr>

                    {selectedCertificates.map((cert) => (
                        <tr key={cert}>
                            <td className="border p-2">
                                <input
                                    type="checkbox"
                                    checked={true} // always checked while it exists
                                    onChange={() => {
                                        // remove from selectedCertificates
                                        setSelectedCertificates((prev) =>
                                            prev.filter((c) => c !== cert)
                                        );
                                        // cleanup copies for that cert
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
                                    value={copies[cert]}
                                    onChange={(e) =>
                                        setCopies({
                                            ...copies,
                                            [cert]: Number(e.target.value),
                                        })
                                    }
                                    className="w-16 text-center border-none rounded"
                                />
                            </td>
                            <td className="border p-2 text-center">{cert}</td>
                            <td className="border p-2">
                                {(
                                    certificateFees[cert] * (copies[cert] || 0)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    ))}

                    {/* Diploma Row */}
                    <tr>
                        <td className="border p-2">
                            <input
                                type="checkbox"
                                checked={selectedDocuments.diploma}
                                onChange={() => handleCheckboxChange("diploma")}
                            />
                        </td>
                        <td className="border p-2">
                            <input
                                type="number"
                                min="0"
                                value={copies.diploma}
                                onChange={(e) =>
                                    setCopies({
                                        ...copies,
                                        diploma: Number(e.target.value),
                                    })
                                }
                                className="w-16 text-center border-none rounded"
                            />
                        </td>
                        <td className="border p-2 text-center">Diploma</td>
                        <td className="border p-2">100.00</td>
                    </tr>

                    {/* Form 137 Row */}
                    <tr>
                        <td className="border p-2">
                            <input
                                type="checkbox"
                                checked={selectedDocuments.form137}
                                onChange={() => handleCheckboxChange("form137")}
                            />
                        </td>
                        <td className="border p-2">
                            <input
                                type="number"
                                min="0"
                                value={copies.form137}
                                onChange={(e) =>
                                    setCopies({
                                        ...copies,
                                        form137: Number(e.target.value),
                                    })
                                }
                                className="w-16 text-center border-none rounded"
                            />
                        </td>
                        <td className="border p-2 text-center">Form 137</td>
                        <td className="border p-2">100.00</td>
                    </tr>

                    {/* Copy of Grades Row */}
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
                                value={copies.registrationForm}
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
                        <td className="border p-2">100.00</td>
                    </tr>

                    {/* Transcript of Records Row */}
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
                                value={copies.tor}
                                onChange={(e) =>
                                    setCopies({
                                        ...copies,
                                        tor: Number(e.target.value),
                                    })
                                }
                                className="w-16 text-center border-none rounded"
                            />
                        </td>
                        <td className="border p-2 text-center">
                            Transcript of Records
                        </td>
                        <td className="border p-2">30.00</td>
                    </tr>
                </tbody>
            </table>
            <p className="text-xs text-red-600 mt-3 text-center">
                * 2 pages is the minimum number of pages for TOR (Transcript of
                Records).
            </p>
        </div>
    );
};

export default RequestDetailsTable;
