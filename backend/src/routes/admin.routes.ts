import { Router } from "express"
import { loginUserController } from "../controllers/admin.controller";


const router = Router()

router.post("/login", loginUserController);


export default router