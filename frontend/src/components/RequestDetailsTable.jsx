import { useState } from "react";

const RequestDetailsTable = ({ copies, setCopies }) => {
    const certificateOptions = [
        "Certificates",
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
        Certificates: 0,
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

    const [selectedDoc, setSelectedDoc] = useState(certificateOptions[0]);

    const certificationFee =
        certificateFees[selectedDoc] * copies.certification;

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
                    {/* Certification Row */}
                    <tr>
                        <td className="border p-2">
                            <input type="checkbox" />
                        </td>
                        <td className="border p-2">
                            <input
                                type="number"
                                min="0"
                                value={copies.certification}
                                onChange={(e) =>
                                    setCopies({
                                        ...copies,
                                        certification: Number(e.target.value),
                                    })
                                }
                                className="w-16 text-center border-none rounded"
                            />
                        </td>
                        <td className="text-center">
                            <select
                                value={selectedDoc}
                                onChange={(e) => setSelectedDoc(e.target.value)}
                                className="appearance-auto border-0 text-center px-2 py-1 focus:outline-none focus:ring-0"
                            >
                                {certificateOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="border p-2">
                            {certificationFee.toFixed(2)}
                        </td>
                    </tr>

                    {/* Diploma Row */}
                    <tr>
                        <td className="border p-2">
                            <input type="checkbox" />
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
                            <input type="checkbox" />
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
                            <input type="checkbox" />
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
                            <input type="checkbox" />
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
