import { Router } from 'express';
import {loginController, signupController,logoutController, meController} from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/protectRout.js';
const router = Router();

router.post('/login', loginController);
router.get("/me",protectRoute,meController); 
router.post("/signup",signupController);

router.get("/logout",logoutController);


export default router;