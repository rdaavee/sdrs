import { Request, Response } from "express";
import axios from "axios";

export const createInvoiceController = async (req: Request, res: Response) => {
	try {
		const { amount, description } = req.body;
		console.log("Hit /payments/create-invoice", req.body);


		const response = await axios.post(
			"https://api.xendit.co/v2/invoices",
			{
				external_id: "invoice-" + Date.now(),
				amount,
				description,
				currency: "PHP",
				success_redirect_url: "http://47.129.128.196/success",
				failure_redirect_url: "http://47.129.128.196/failed",
			},
			{
				auth: {
					username: process.env.XENDIT_SECRET_KEY!,
					password: "",
				},
			}
		);

		return res.json(response.data);
	} catch (error: any) {
		console.error("Error creating Xendit invoice:", error.message);
		return res.status(500).json({ error: "Failed to create invoice" });
	}
};

export const xenditWebhookController = async (req: Request, res: Response) => {
	try {
		const event = req.body;

		if (event.status === "PAID") {
			// find request by external_id or reference_number
			// then update requestReceipt.paid = true
			console.log("Payment successful for invoice:", event.external_id);

			// TODO: update DB here
		}

		return res.status(200).json({ received: true });
	} catch (error: any) {
		console.error("Webhook error:", error.message);
		return res.status(500).json({ error: "Webhook failed" });
	}
};
