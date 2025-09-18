import express from "express";
import {
    createInvoiceController,
    xenditWebhookController,
} from "../controllers/payment.controllers";

const router = express.Router();

router.post("/create-invoice", createInvoiceController);
router.post("/xendit-webhook", xenditWebhookController);

export default router;
