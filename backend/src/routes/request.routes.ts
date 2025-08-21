import { Router } from "express"
import { getRequestReceiptController, saveRequestReceiptController } from "../controllers/request.controllers";


const router = Router()

router.post("/save-request-receipt", saveRequestReceiptController);
router.get("/get-request-receipt", getRequestReceiptController);

export default router