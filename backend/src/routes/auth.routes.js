import { Router } from 'express';
import {loginController, signupController,logoutController} from '../controller/auth.controller.js';
const router = Router();

router.get('/login', loginController);
 
router.get("/signup",signupController);

router.get("/logout",logoutController);


export default router;