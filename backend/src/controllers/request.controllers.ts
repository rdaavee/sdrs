import { Request, Response } from 'express';
import { getAllRequestReceipt, getAllRequestReceiptStats, getRequestReceipt, saveRequestReceipt } from '../services/request.services';
import { sendEmailRequestReceipt, sendStatusUpdateEmail } from '../utils/send_email';
import { RequestReceipt } from '../models/request.model';

export const saveRequestReceiptController = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const field_name: { [key: string]: string } = {
            student_number: "Student Number",
            full_name: "Full Name",
            current_address: "Current Address",
            course: "Course",
            gender: "Gender",
            birthday: "Birthday",
            last_school_attended: "Last School Attended",
            semester: "Semester",
            school_year: "School Year",
            last_school_year_graduated: "Last School Year Graduated",
            elementary_school: "Elementary School",
            elementary_year_graduated: "Elementary Year Graduated",
            high_school: "High School",
            highschool_year_graduated: "High School Year Graduated",
            contact_number: "Contact Number",
            email_address: "Email Address",
            purpose_of_request: "Purpose of Request",
            requested_documents: "Requested Documents",
            payment_method: "Payment Method",
            paid: "is Paid"
        };

        const email_address = data.email_address.toLowerCase();

        for (const [key, value] of Object.entries({ email_address, ...data })) {
            if (key !== "paid") {
                if (!value) {
                    return res.status(400).json({ error: `${field_name[key]} is required and cannot be null or undefined.` })
                }
            }
        }

        const result = await saveRequestReceipt(data)
        if (result.httpCode === 200 && result.message) {
            sendEmailRequestReceipt(
                data.email_address,
                String(result.message.reference_number),
                String(result.message.code)
            );
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getRequestReceiptController = async (req: Request, res: Response) => {
    const { reference_number, code } = req.query;

    if (!reference_number || !code) {
        res.status(400).json({ error: 'Bad Request' });
        return;
    }

    if (code.length !== 6) {
        res.status(400).json({ error: 'Invalid Code format' });
        return;
    }
    const reference_regex = /^\d{6}SDRS-\d{5}$/;
    if (!reference_regex.test(reference_number as string)) {
        return res.status(400).json({ error: "Invalid reference number format" });
    }

    try {
        const result = await getRequestReceipt(reference_number as string, code as string)
        if (result.httpCode === 200) {
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getAllRequestReceiptController = async (req: Request, res: Response) => {
    try {
        const result = await getAllRequestReceipt()
        if (result.httpCode === 200) {
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getAllRequestReceiptStatsController = async (req: Request, res: Response) => {
    try {
        const result = await getAllRequestReceiptStats()
        if (result.httpCode === 200) {
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const actionRequestController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        if (!["accepted", "rejected"].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }

        const updatedRequest = await RequestReceipt.findByIdAndUpdate(
            id,
            { status: action },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: "Request not found" });
        }

        req.app.get("io").emit("requestUpdated", updatedRequest);

        return res.json({ message: "Request updated", request: updatedRequest });
    } catch (err) {
        console.error("error in actionRequestController:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateRequestStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { status } = req.body;
        const userRole = (req as any).user?.role || "Staff Admin";

        console.log("incoming update request:", { id, status, userRole });

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        //TODO: sana pag na-accept magiging waiting yung status
        if (userRole === "staff" && status === "accepted") {
            console.log("staff accepted, overriding status to waiting");
            status = "waiting";
        }

        const request = await RequestReceipt.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!request) {
            console.log("request not found:", id);
            return res.status(404).json({ error: "Request not found" });
        }

        if (request.email_address) {
            sendStatusUpdateEmail(request.email_address, request.reference_number, status)
        }

        req.app.get("io").emit("requestUpdated", request);

        console.log("request updated successfully:", request);

        return res.status(200).json({ request });
    } catch (err: any) {
        console.error("error in updateRequestStatusController:", err.message, err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
