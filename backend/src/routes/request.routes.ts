import { Router } from "express"
import { getAllRequestReceiptController, getAllRequestReceiptStatsController, getRequestReceiptController, saveRequestReceiptController } from "../controllers/request.controllers";


const router = Router()

router.post("/save-request-receipt", saveRequestReceiptController);
router.get("/get-request-receipt", getRequestReceiptController);

// TODO: ADD MIDDLEWARE TO ALLOW ONLY ADMINS
router.get("/get-all-request-receipt", getAllRequestReceiptController);
router.get("/get-all-request-receipt-stats", getAllRequestReceiptStatsController);

export default router