import { Router } from "express"
import { checkCurrentUser, getAllUsersController, loginUserController, signupUserController } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/auth.middleware";


const router = Router()

router.post("/login", loginUserController);
router.post("/signup", signupUserController);

router.get("/users", getAllUsersController);
router.post("/checkCurrentUser", authenticateToken, checkCurrentUser);


export default router