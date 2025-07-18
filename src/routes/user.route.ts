import { Router } from "express";
import sampleController from "../controllers/user.controller";
import validate from "../config/validate";
import userValidation from "../validations/user.validation";
import { auth } from "../config/auth";
import { authLimiter } from "../config/rate.limitter";

const router = Router();

router.post(
  "/login",
  validate(userValidation.loginUser),
  sampleController.userLogin
);
router.post(
  "/register",
  validate(userValidation.registerUser),
  sampleController.userRegister
);
router.get("/refresh-token", auth, sampleController.generateAuthToken);
router.get(
  "/motivational-quote",
  authLimiter,
  auth,
  sampleController.fetchMotivationQuote
);

export default router;
