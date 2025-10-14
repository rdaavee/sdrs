import { Router, Request, Response } from "express";
import { RequestReceipt } from "../models/request.model";

const router = Router();

const OFFICE_HOURS = "Monday to Friday, 8 AM to 5 PM";

const FAQS = [
    { keyword: "documents", answer: "You need to submit a valid ID, enrollment form, and payment receipt." },
    { keyword: "office hours", answer: OFFICE_HOURS },
    { keyword: "payments", answer: "Payments can be done online via our portal or at the cashier." },
    { keyword: "tracking", answer: "You can track your request by entering your reference number." },
    { keyword: "reminder", answer: "Please submit all required documents before the deadline to avoid delays." },
];

router.post("/", async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        let reply = "Sorry, I can only answer questions related to document requests, payments, tracking, or office info.";

        const msg = message.trim();

        const refMatch = msg.match(/\d{6}SDRS-\d{5}/i);
        if (refMatch) {
            const request = await RequestReceipt.findOne({ reference_number: refMatch[0] });
        if (request) {
            reply = `Request #${request.reference_number} for ${request.full_name} is currently: ${request.status.toUpperCase()}.`;
        } else {
            reply = "Sorry, I could not find a request with that reference number. Please check and try again.";
        }
        } else {
            const lowerMsg = msg.toLowerCase();
                for (const faq of FAQS) {
                    if (lowerMsg.includes(faq.keyword)) {
                    reply = faq.answer;
                    break;
                }
            }
        }
        res.json({ reply });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Chatbot error" });
        }
    }
);

export default router;
