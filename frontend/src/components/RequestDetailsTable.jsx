import { useState, useEffect } from "react";
import { IoInformation } from "react-icons/io5";

const RequestDetailsTable = ({ copies, setCopies, setDataForm }) => {
    const diplomaOptions = [
        "Diploma with EDUFIED",
        "Diploma - Rush",
    ];

    const diplomaFees = {
        "Diploma - Rush": 1000,
        "Diploma with EDUFIED": 2000,
    };

    const diplomaRemarks = {
        "Diploma - Rush": "Rush processing; available within the day or next day; includes brown envelope",
        "Diploma with EDUFIED": "Regular processing days; includes brown envelope; 2nd copy",
    };

    const form137Options = [
        "Form 137/138/SFIO",
        "Form 137/138 - Rush",
    ];

    const form137Fees = {
        "Form 137/138/SFIO": 170,
        "Form 137/138 - Rush": 220,
    };

    const form137Remarks = {
        "Form 137/138/SFIO": "max 2 sheets; only BasicEd/SHS",
        "Form 137/138 - Rush": "Faster processing, may incur additional conditions",
    };

    const certificateOptions = [
        "Certification of Enrollment",
        "Certification of Graduation",
        "Certification of Units Earned",
        "Certification of Good Moral",
        "Certification of Weighted Average",
        "Certification-Med. of Instruction",
        "Certificate of Eligibility to Transfer",
        "Certificate of Eligibility to Transfer, 2nd copy",
        "Certification - Letter of Acceptance",
        "Certification - Letter of Acceptance; with SPA",
        "Certification - Course Description",
    ];

    const certificateRemarks = {
        "Certification of Enrollment": "includes with envelope",
        "Certification of Graduation": "includes with envelope",
        "Certification of Units Earned": "includes with envelope",
        "Certification of Good Moral": "includes with envelope",
        "Certification of Weighted Average": "includes with envelope",
        "Certification-Med. of Instruction": "includes with envelope",
        "Certificate of Eligibility to Transfer": "includes with envelope",
        "Certificate of Eligibility to Transfer, 2nd copy": "for those who lost their first copy",
        "Certification - Letter of Acceptance": "2 types of letter",
        "Certification - Letter of Acceptance; with SPA": "with SPA and notarization fee",
        "Certification - Course Description": "per page charging; previous charging was for every 3-page",
    };

    const certificateFees = {
        "Certificate of Eligibility to Transfer": 170,
        "Certificate of Eligibility to Transfer, 2nd copy": 170,
        "Certification of Enrollment": 150,
        "Certification of Graduation": 170,
        "Certification of Units Earned": 170,
        "Certification of Good Moral": 170,
        "Certification of Weighted Average": 170,
        "Certification-Med. of Instruction": 170,
        "Certification - Letter of Acceptance": 300,
        "Certification - Letter of Acceptance; with SPA": 700,
        "Certification - Course Description": 75,
    };

    const transcriptOptions = [
        "Transcript (first page with doc stamp)",
        "Transcript (succeeding page)",
        "Transcript (Rush rate; per page)",
    ]

    const transcriptRemarks = {
        "Transcript (first page with doc stamp)": "includes 1 doc stamp",
        "Transcript (succeeding page)": "no doc stamp",
        "Transcript (Rush rate; per page)": "available within the day or next day; with 1 doc stamp",
    }

    const transcriptFees = {
        "Transcript (first page with doc stamp)": 200,
        "Transcript (succeeding page)": 180,
        "Transcript (Rush rate; per page)": 300,
    }

    const [selectedCertificates, setSelectedCertificates] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState({
        diploma: false,
        form137: false,
        registrationForm: false,
        tor: false,
    });
    const [currentSelect, setCurrentSelect] = useState("");
    const [selectedDiploma, setSelectedDiploma] = useState(diplomaOptions[0]);
    const [selectedForm137, setSelectedForm137] = useState(form137Options[0]);
    const [selectedTranscript, setSelectedTranscript] = useState(transcriptOptions[0]);

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
            requestedDocs.push(["Transcript of Records", copies.tor]);
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
        <div>
            <div>
                <div className="mb-5 text-center space-y-0">
                    <p className="text-2xl font-bold tracking-tight">
                        University of Pangasinan
                    </p>
                    <p className="text-sm font-medium">List of Registrar's Fee</p>
                    <hr className="text-gray-300 m-7" />
                </div>
            
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 space-y-2 sm:space-y-0 sm:space-x-2">
                    <p className="text-sm text-gray-500 leading-snug text-justify">
                        Choose the documents and number of copies. Make sure to double-check
                        the fees and remarks for each item before proceeding.
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto w-full text-[10px] sm:text-xs md:text-sm lg:text-base">
                <table className="min-w-max w-full border-collapse border border-gray-300 text-xs sm:text-sm text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2"></th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">Copies</th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">Document Request</th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">Fee</th>
                            <th className="border px-2 py-1 sm:px-4 sm:py-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                            <td className="text-center border">
                                <select
                                    value={currentSelect}
                                    onChange={handleCertificateChange}
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                >
                                    <option value="" className="text-center border">
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
                                <td className="border p-2 text-sm">
                                    {certificateRemarks[cert] ?? ""}
                                </td>
                            </tr>
                        ))}

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
                            <td className="text-center border">
                                <select
                                    value={selectedDiploma}
                                    onChange={(e) => setSelectedDiploma(e.target.value)}
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                >
                                    {diplomaOptions.map((opt, idx) => (
                                        <option key={idx} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border p-2">
                                {diplomaFees[selectedDiploma].toFixed(2)}
                            </td>
                            <td className="border p-2 text-sm">
                                {diplomaRemarks[selectedDiploma]}
                            </td>
                        </tr>

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
                            <td className="text-center border">
                                <select
                                    value={selectedForm137}
                                    onChange={(e) => setSelectedForm137(e.target.value)}
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                >
                                    {form137Options.map((opt, idx) => (
                                        <option key={idx} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border p-2">
                                {form137Fees[selectedForm137].toFixed(2)}
                            </td>
                            <td className="border p-2 text-sm">
                                {form137Remarks[selectedForm137]}
                            </td>
                        </tr>

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
                            <td className="border p-2 text-center">Copy of Grades</td>
                            <td className="border p-2">50.00</td>
                            <td className="border p-2">per sem, per page</td>
                        </tr>

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
                            <td className="text-center border">
                                <select
                                    value={selectedTranscript}
                                    onChange={(e) => setSelectedTranscript(e.target.value)}
                                    className="appearance-auto w-full border px-2 py-1 text-center"
                                >
                                    {transcriptOptions.map((opt, idx) => (
                                        <option key={idx} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border p-2">
                                {transcriptFees[selectedTranscript].toFixed(2)}
                            </td>
                            <td className="border p-2 text-sm">
                                {transcriptRemarks[selectedTranscript]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default RequestDetailsTable;
