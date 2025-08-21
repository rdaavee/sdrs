import { Router } from "express"
import { requestCodeController, verifyCodeController } from "../controllers/verify.controllers";


const router = Router()

router.get("/request-code", requestCodeController);
router.post("/verify-code", verifyCodeController);

export default router