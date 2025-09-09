import { Router } from "express"
import { actionRequestController, getAllRequestReceiptController, getAllRequestReceiptStatsController, getRequestReceiptController, saveRequestReceiptController, updateRequestStatusController } from "../controllers/request.controllers";


const router = Router()

router.post("/save-request-receipt", saveRequestReceiptController);
router.get("/get-request-receipt", getRequestReceiptController);
router.put("/action/:id", actionRequestController);
router.put("/update/:id", updateRequestStatusController);

// TODO: ADD MIDDLEWARE TO ALLOW ONLY ADMINS
router.get("/get-all-request-receipt", getAllRequestReceiptController);
router.get("/get-all-request-receipt-stats", getAllRequestReceiptStatsController);

export default router