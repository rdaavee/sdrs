import { Request, Response } from 'express';
import { getRequestReceipt, saveRequestReceipt } from '../services/request.services';

export const saveRequestReceiptController = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const field_name: { [key: string]: string } = {
            student_number: "Student Number",
            full_name: "Full Name",
            current_address: "Current Address",
            course: "Course",
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
        if (result.httpCode === 200) {
            // TODO: SEND EMAIL 
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getRequestReceiptController = async (req: Request, res: Response) => {
    const { reference_number, code } = req.body;

    if (!reference_number || !code) {
        res.status(400).json({ error: 'Bad Request' });
        return;
    }

    if (code.length !== 6) {
        res.status(400).json({ error: 'Invalid Code format' });
        return;
    }
    const reference_regex = /^\d{6}SDRS-\d{5}$/;
    if (!reference_regex.test(reference_number)) {
        return res.status(400).json({ error: "Invalid reference number format" });
    }

    try {
        const result = await getRequestReceipt(reference_number, code)
        if (result.httpCode === 200) {
            return res.status(result.httpCode).json({ message: result.message });
        }
        return res.status(result.httpCode).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}